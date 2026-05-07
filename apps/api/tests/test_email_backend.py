from unittest.mock import Mock, patch
from datetime import timedelta

from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.core import mail
from django.test import SimpleTestCase, TestCase, override_settings
from django.utils import timezone

from matchmaking.email_backend import SESBoto3EmailBackend
from matchmaking.models import AuthActionToken
from matchmaking.views import send_auth_action_email


class SESBoto3EmailBackendTests(SimpleTestCase):
    @override_settings(
        DEFAULT_FROM_EMAIL='noreply@example.com',
        AWS_SES_REGION_NAME='ap-south-1',
        AWS_SES_CONFIGURATION_SET='transactional',
    )
    @patch('matchmaking.email_backend.boto3.client')
    def test_send_messages_uses_ses_raw_email(self, mock_boto_client):
        ses_client = Mock()
        mock_boto_client.return_value = ses_client

        message = EmailMultiAlternatives(
            subject='Verify account',
            body='Plain text body',
            from_email='noreply@example.com',
            to=['user@example.com'],
        )
        message.attach_alternative('<p>Plain text body</p>', 'text/html')

        backend = SESBoto3EmailBackend()
        sent_count = backend.send_messages([message])

        assert sent_count == 1
        mock_boto_client.assert_called_once_with(
            'ses',
            region_name='ap-south-1',
            aws_access_key_id=None,
            aws_secret_access_key=None,
            aws_session_token=None,
        )
        ses_client.send_raw_email.assert_called_once()
        kwargs = ses_client.send_raw_email.call_args.kwargs
        assert kwargs['Source'] == 'noreply@example.com'
        assert kwargs['Destinations'] == ['user@example.com']
        assert kwargs['ConfigurationSetName'] == 'transactional'
        raw_message = kwargs['RawMessage']['Data'].decode('utf-8', errors='ignore')
        assert 'Subject: Verify account' in raw_message
        assert 'Content-Type: multipart/alternative' in raw_message

    @patch('matchmaking.email_backend.boto3.client')
    def test_send_messages_skips_messages_without_recipients(self, mock_boto_client):
        backend = SESBoto3EmailBackend()
        message = EmailMultiAlternatives(
            subject='No recipient',
            body='Body',
            from_email='noreply@example.com',
            to=[],
        )

        sent_count = backend.send_messages([message])

        assert sent_count == 0
        mock_boto_client.assert_not_called()


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    DEFAULT_FROM_EMAIL='noreply@example.com',
    FRONTEND_BASE_URL='https://app.example.com',
    EMAIL_VERIFICATION_PATH='/verify-email',
    PASSWORD_RESET_PATH='/reset-password',
)
class AuthActionEmailTests(TestCase):
    def test_verification_email_includes_html_button(self):
        user = User.objects.create_user(
            username='verify@example.com',
            email='verify@example.com',
            password='SecretPass123!',
            is_active=False,
        )
        token_record = AuthActionToken.objects.create(
            user=user,
            purpose=AuthActionToken.PURPOSE_EMAIL_VERIFICATION,
            token='verify-token-123',
            expires_at=timezone.now() + timedelta(hours=24),
        )

        send_auth_action_email(user, token_record)

        assert len(mail.outbox) == 1
        message = mail.outbox[0]
        assert message.subject == 'Verify your Matchmaking account'
        assert message.body
        assert 'verify your email address' in message.body.lower()
        assert 'https://app.example.com/verify-email?token=verify-token-123' in message.body
        assert len(message.alternatives) == 1
        html_body, mimetype = message.alternatives[0]
        assert mimetype == 'text/html'
        assert 'Verify email address' in html_body
        assert 'https://app.example.com/verify-email?token=verify-token-123' in html_body
        assert 'background:#901214' in html_body

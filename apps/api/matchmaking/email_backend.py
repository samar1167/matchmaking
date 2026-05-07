import boto3
from botocore.exceptions import BotoCoreError, ClientError
from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend


class SESBoto3EmailBackend(BaseEmailBackend):
    """Send Django email through AWS SES using boto3."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.region_name = getattr(settings, 'AWS_SES_REGION_NAME', '') or getattr(settings, 'AWS_S3_REGION_NAME', '') or None
        self.access_key_id = getattr(settings, 'AWS_SES_ACCESS_KEY_ID', '') or getattr(settings, 'AWS_ACCESS_KEY_ID', '') or None
        self.secret_access_key = getattr(settings, 'AWS_SES_SECRET_ACCESS_KEY', '') or getattr(settings, 'AWS_SECRET_ACCESS_KEY', '') or None
        self.session_token = getattr(settings, 'AWS_SES_SESSION_TOKEN', '') or None
        self.configuration_set_name = getattr(settings, 'AWS_SES_CONFIGURATION_SET', '') or None
        self._client = None

    @property
    def client(self):
        if self._client is None:
            self._client = boto3.client(
                'ses',
                region_name=self.region_name,
                aws_access_key_id=self.access_key_id,
                aws_secret_access_key=self.secret_access_key,
                aws_session_token=self.session_token,
            )
        return self._client

    def send_messages(self, email_messages):
        if not email_messages:
            return 0

        sent_message_count = 0
        for email_message in email_messages:
            recipients = email_message.recipients()
            if not recipients:
                continue

            payload = {
                'Source': email_message.from_email or settings.DEFAULT_FROM_EMAIL,
                'Destinations': recipients,
                'RawMessage': {
                    'Data': email_message.message().as_bytes(),
                },
            }
            if self.configuration_set_name:
                payload['ConfigurationSetName'] = self.configuration_set_name

            try:
                self.client.send_raw_email(**payload)
                sent_message_count += 1
            except (BotoCoreError, ClientError):
                if not self.fail_silently:
                    raise

        return sent_message_count

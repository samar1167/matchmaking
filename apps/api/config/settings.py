import os
from pathlib import Path
from datetime import timedelta
from decouple import config
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')

INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'drf_yasg',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'channels',
    'storages',
    'matchmaking',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [],
    'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]},
}]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='db'),
        'PORT': config('DB_PORT', default='3306'),
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'matchmaking-cache',
    }
}

REDIS_URL = config('REDIS_URL', default='')
if REDIS_URL:
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels_redis.core.RedisChannelLayer',
            'CONFIG': {
                'hosts': [REDIS_URL],
            },
        },
    }
else:
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels.layers.InMemoryChannelLayer',
        },
    }

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework_simplejwt.authentication.JWTAuthentication'],
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
}

CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000').split(',')
DILAANU_EMAIL = config('DILAANU_EMAIL', default='')
DILAANU_BASE_URL = config('DILAANU_BASE_URL', default='')
DILAANU_PUBLIC_KEY = config('DILAANU_PUBLIC_KEY', default='')
DILAANU_SECRET_KEY = config('DILAANU_SECRET_KEY', default='')
USE_AWS_SES_EMAIL = config('USE_AWS_SES_EMAIL', default=False, cast=bool)
EMAIL_BACKEND = (
    'matchmaking.email_backend.SESBoto3EmailBackend'
    if USE_AWS_SES_EMAIL
    else config('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
)
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@matchmaking.local')
EMAIL_HOST = config('EMAIL_HOST', default='localhost')
EMAIL_PORT = config('EMAIL_PORT', default=25, cast=int)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=False, cast=bool)
EMAIL_USE_SSL = config('EMAIL_USE_SSL', default=False, cast=bool)
AWS_SES_REGION_NAME = config('AWS_SES_REGION_NAME', default='').strip()
AWS_SES_ACCESS_KEY_ID = config('AWS_SES_ACCESS_KEY_ID', default='').strip()
AWS_SES_SECRET_ACCESS_KEY = config('AWS_SES_SECRET_ACCESS_KEY', default='').strip()
AWS_SES_SESSION_TOKEN = config('AWS_SES_SESSION_TOKEN', default='').strip()
AWS_SES_CONFIGURATION_SET = config('AWS_SES_CONFIGURATION_SET', default='').strip()
FRONTEND_BASE_URL = config('FRONTEND_BASE_URL', default='http://localhost:3000')
STRIPE_SECRET_KEY = config('STRIPE_SECRET_KEY', default='')
STRIPE_WEBHOOK_SECRET = config('STRIPE_WEBHOOK_SECRET', default='')
EMAIL_VERIFICATION_PATH = config('EMAIL_VERIFICATION_PATH', default='/verify-email')
PASSWORD_RESET_PATH = config('PASSWORD_RESET_PATH', default='/reset-password')
EMAIL_VERIFICATION_TOKEN_LIFETIME = timedelta(hours=config('EMAIL_VERIFICATION_TOKEN_LIFETIME_HOURS', default=24, cast=int))
PASSWORD_RESET_TOKEN_LIFETIME = timedelta(minutes=config('PASSWORD_RESET_TOKEN_LIFETIME_MINUTES', default=30, cast=int))

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
USE_S3_MEDIA_STORAGE = config('USE_S3_MEDIA_STORAGE', default=False, cast=bool)
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID', default='').strip()
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY', default='').strip()
AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME', default='').strip()
AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', default='').strip()
AWS_S3_ENDPOINT_URL = config('AWS_S3_ENDPOINT_URL', default='').strip() or None
AWS_S3_CUSTOM_DOMAIN = config('AWS_S3_CUSTOM_DOMAIN', default='').strip() or None
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': config('AWS_S3_CACHE_CONTROL', default='max-age=86400'),
}
AWS_DEFAULT_ACL = None
AWS_QUERYSTRING_AUTH = config('AWS_QUERYSTRING_AUTH', default=False, cast=bool)
AWS_QUERYSTRING_EXPIRE = config('AWS_QUERYSTRING_EXPIRE', default=3600, cast=int)
AWS_S3_FILE_OVERWRITE = True

if USE_S3_MEDIA_STORAGE:
    if not AWS_STORAGE_BUCKET_NAME:
        raise ImproperlyConfigured('AWS_STORAGE_BUCKET_NAME is required when USE_S3_MEDIA_STORAGE is enabled.')

    s3_media_options = {
        'access_key': AWS_ACCESS_KEY_ID,
        'secret_key': AWS_SECRET_ACCESS_KEY,
        'bucket_name': AWS_STORAGE_BUCKET_NAME,
        'region_name': AWS_S3_REGION_NAME or None,
        'default_acl': AWS_DEFAULT_ACL,
        'querystring_auth': AWS_QUERYSTRING_AUTH,
        'querystring_expire': AWS_QUERYSTRING_EXPIRE,
        'file_overwrite': AWS_S3_FILE_OVERWRITE,
        'object_parameters': AWS_S3_OBJECT_PARAMETERS,
    }
    if AWS_S3_ENDPOINT_URL:
        s3_media_options['endpoint_url'] = AWS_S3_ENDPOINT_URL
    if AWS_S3_CUSTOM_DOMAIN:
        s3_media_options['custom_domain'] = AWS_S3_CUSTOM_DOMAIN

    STORAGES = {
        'default': {
            'BACKEND': 'storages.backends.s3.S3Storage',
            'OPTIONS': s3_media_options,
        },
        'staticfiles': {
            'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
        },
    }
else:
    STORAGES = {
        'default': {
            'BACKEND': 'django.core.files.storage.FileSystemStorage',
            'OPTIONS': {
                'location': MEDIA_ROOT,
                'base_url': MEDIA_URL,
            },
        },
        'staticfiles': {
            'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
        },
    }

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {'verbose': {'format': '{levelname} {asctime} {module} {message}', 'style': '{'}},
    'handlers': {
        'console': {'class': 'logging.StreamHandler', 'formatter': 'verbose'},
        'file': {'class': 'logging.FileHandler', 'filename': os.path.join(BASE_DIR, 'logs/matchmaking.log'), 'formatter': 'verbose'},
    },
    'root': {'handlers': ['console', 'file'], 'level': 'INFO'},
}

SWAGGER_SETTINGS = {
    'USE_SESSION_AUTH': False,          # <-- stops the Django login redirect
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
        }
    },
    'JSON_EDITOR': True,
}

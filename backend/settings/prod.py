import os
import dj_database_url
from .base import *

DEBUG = False
ALLOWED_HOSTS = ['*.onrender.com', 'localhost']

DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
    )
}

SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
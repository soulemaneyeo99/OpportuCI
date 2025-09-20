"""
Paramètres de base pour le projet OpportuCI.
Configuré pour le développement avec support de l'IA Gemini.
"""
import os
import sys
from datetime import timedelta
from pathlib import Path
from dotenv import load_dotenv

# ===========================
# CONFIGURATION DES CHEMINS
# ===========================

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Charger les variables d'environnement
load_dotenv(BASE_DIR / '.env')

# ===========================
# SÉCURITÉ
# ===========================

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-key-for-development-only')
DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# ===========================
# CONFIGURATION GEMINI API
# ===========================

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

if not GEMINI_API_KEY:
    import warnings
    warnings.warn(
        "GEMINI_API_KEY n'est pas définie dans les variables d'environnement. "
        "Les fonctionnalités IA ne fonctionneront pas."
    )

# Variables d'environnement pour Google AI (nécessaire pour Gemini)
os.environ['GOOGLE_API_KEY'] = GEMINI_API_KEY

# ===========================
# APPLICATIONS DJANGO
# ===========================

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'corsheaders',
    'djoser',
    'django_filters',
    'drf_yasg',  # Documentation API
]

LOCAL_APPS = [
    'accounts',
    'core',
    'opportunities',
    'formations',
    'courses',
    'credibility',
    'notifications',
    'chat',           # Système de chat IA
    'ai_services',    # Services IA (recommandations, conseils)
    'gamification',
    'recommendations', 
    'innovative',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# ===========================
# MIDDLEWARE
# ===========================

MIDDLEWARE = [
    'django.middleware.cache.UpdateCacheMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.cache.FetchFromCacheMiddleware',

]
CACHE_MIDDLEWARE_SECONDS = 600

ROOT_URLCONF = 'core.urls'

# ===========================
# TEMPLATES
# ===========================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# ===========================
# BASE DE DONNÉES
# ===========================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
        'OPTIONS': {
            'timeout': 20,  # Éviter les timeouts en développement
        }
    }
}

# ===========================
# CACHE
# ===========================

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.getenv('REDIS_URL'),
        'TIMEOUT': 300,  # 5 minutes
        'OPTIONS': {
            'MAX_ENTRIES': 1000,
        }
    }
}

# ===========================
# VALIDATION DES MOTS DE PASSE
# ===========================

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ===========================
# INTERNATIONALISATION
# ===========================

LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Africa/Abidjan'
USE_I18N = True
USE_TZ = True

# ===========================
# FICHIERS STATIQUES ET MÉDIAS
# ===========================

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Créer les dossiers s'ils n'existent pas
os.makedirs(MEDIA_ROOT, exist_ok=True)
os.makedirs(BASE_DIR / 'static', exist_ok=True)

# ===========================
# MODÈLE UTILISATEUR
# ===========================

AUTH_USER_MODEL = 'accounts.User'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ===========================
# DJANGO REST FRAMEWORK
# ===========================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'EXCEPTION_HANDLER': 'rest_framework.views.exception_handler',
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
        'chat': '60/minute',  # Limite pour les requêtes chat
    }
}

# ===========================
# CONFIGURATION JWT
# ===========================

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

# ===========================
# CONFIGURATION CORS
# ===========================

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Seulement en développement

# ===========================
# CONFIGURATION DJOSER
# ===========================

DJOSER = {
    'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    'USERNAME_RESET_CONFIRM_URL': 'username/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': False,  # Désactivé en développement
    'SERIALIZERS': {
        'user_create': 'accounts.serializers.UserCreateSerializer',
        'user': 'accounts.serializers.UserDetailSerializer',
        'current_user': 'accounts.serializers.UserDetailSerializer',
    },
    'PERMISSIONS': {
        'user': ['djoser.permissions.CurrentUserOrAdmin'],
        'user_list': ['rest_framework.permissions.IsAdminUser'],
    }
}

# ===========================
# CONFIGURATION EMAIL
# ===========================

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Pour la production, utiliser :
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
# EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
# EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')

# ===========================
# CONFIGURATION LOGGING
# ===========================

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose' if DEBUG else 'simple',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'formatter': 'verbose',
        } if DEBUG else None,
    },
    'root': {
        'handlers': ['console'] + (['file'] if DEBUG else []),
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'chat': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
        'ai_services': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
    },
}

# Créer le dossier logs s'il n'existe pas
if DEBUG:
    os.makedirs(BASE_DIR / 'logs', exist_ok=True)

# ===========================
# CONFIGURATION DRF-YASG (Documentation API)
# ===========================

SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    },
    'USE_SESSION_AUTH': False,
    'JSON_EDITOR': True,
    'SUPPORTED_SUBMIT_METHODS': [
        'get',
        'post',
        'put',
        'delete',
        'patch'
    ],
}

# ===========================
# CONFIGURATION IA SPÉCIFIQUE
# ===========================

# Limites pour l'API Gemini
GEMINI_CONFIG = {
    'MAX_TOKENS': 2048,
    'TEMPERATURE': 0.7,
    'TOP_P': 0.8,
    'TOP_K': 40,
    'REQUEST_TIMEOUT': 30,  # secondes
    'MAX_RETRIES': 3,
}

# Configuration pour les recommandations IA
AI_RECOMMENDATIONS_CONFIG = {
    'MAX_RECOMMENDATIONS': 10,
    'REFRESH_INTERVAL_HOURS': 6,
    'MIN_USER_ACTIONS_FOR_PERSONALIZATION': 3,
}

# ===========================
# MÉTRIQUES ET MONITORING
# ===========================

# Configuration pour le suivi des performances en développement
if DEBUG:
    INTERNAL_IPS = [
        '127.0.0.1',
        'localhost',
    ]

# ===========================
# VALIDATION DE LA CONFIGURATION
# ===========================

# Vérifications de sécurité en développement
if DEBUG:
    if SECRET_KEY == 'django-insecure-key-for-development-only':
        print("⚠️  ATTENTION: Vous utilisez la clé secrète par défaut!")
    
    if not GEMINI_API_KEY:
        print("⚠️  ATTENTION: GEMINI_API_KEY n'est pas configurée!")
    else:
        print(f"✅ GEMINI_API_KEY configurée: {GEMINI_API_KEY[:10]}...")

    print(f"✅ Configuration chargée pour l'environnement: {'DÉVELOPPEMENT' if DEBUG else 'PRODUCTION'}")
    print(f"✅ Base de données: {DATABASES['default']['NAME']}")
    print(f"✅ Applications installées: {len(INSTALLED_APPS)} apps")
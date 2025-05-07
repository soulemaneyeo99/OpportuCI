# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Documentation API avec Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="OpportuCI API",
        default_version='v1',
        description="API de la plateforme OpportuCI connectant les jeunes Ivoiriens à des opportunités",
        contact=openapi.Contact(email="contact@opportunici.ci"),
        license=openapi.License(name="Propriétaire"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Documentation API
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Authentification
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    
    # Vos APIs
    path('api/accounts/', include('accounts.urls')),
    path('api/opportunities/', include('opportunities.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/formations/', include('formations.urls')),
    path('api/credibility/', include('credibility.urls')),
    path('api/notifications/', include('notifications.urls')),
]
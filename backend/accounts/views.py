from rest_framework import viewsets, permissions, status, generics, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth import get_user_model
from django.db.models import Q
from .serializers import (
    UserDetailSerializer, UserCreateSerializer, UserUpdateSerializer,
    ProfilePictureUploadSerializer
)
from .models import UserProfile
from .permissions import IsOwnerOrReadOnly, IsAdminOrSelf

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """Vue pour l'inscription des utilisateurs"""
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().select_related('profile')
    filterset_fields = ['user_type', 'is_verified', 'city', 'country']
    search_fields = ['email', 'username', 'first_name', 'last_name', 'organization_name']
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering_fields = ['created_at', 'username', 'email']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        elif self.action == 'upload_profile_picture':
            return ProfilePictureUploadSerializer
        return UserDetailSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        elif self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdminOrSelf()]
        elif self.action in ['me', 'update_me', 'upload_profile_picture']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminOrSelf()]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Recherche avancée
        search_query = self.request.query_params.get('q', None)
        if search_query:
            queryset = queryset.filter(
                Q(email__icontains=search_query) |
                Q(username__icontains=search_query) |
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query) |
                Q(organization_name__icontains=search_query)
            )
            
        # Filtres par type d'utilisateur
        user_type = self.request.query_params.get('user_type', None)
        if user_type:
            queryset = queryset.filter(user_type=user_type)
            
        return queryset
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Récupérer les informations de l'utilisateur connecté"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_me(self, request):
        """Mettre à jour les informations de l'utilisateur connecté"""
        user = request.user
        partial = request.method == 'PATCH'
        serializer = UserUpdateSerializer(user, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def upload_profile_picture(self, request):
        """Télécharger une photo de profil"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            user.profile_picture = serializer.validated_data['profile_picture']
            user.save()
            return Response(
                UserDetailSerializer(user).data,
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['delete'])
    def remove_profile_picture(self, request):
        """Supprimer la photo de profil"""
        user = request.user
        if user.profile_picture:
            user.profile_picture.delete(save=True)
            user.profile_picture = None
            user.save()
            return Response(
                {'message': 'Photo de profil supprimée avec succès'},
                status=status.HTTP_200_OK
            )
        return Response(
            {'message': 'Aucune photo de profil à supprimer'},
            status=status.HTTP_400_BAD_REQUEST
        )
        
        
        
class UserLoginSerializer(TokenObtainPairSerializer):
    """Sérialiseur personnalisé pour le login afin d'ajouter plus de détails utilisateur"""
    def validate(self, attrs):
        data = super().validate(attrs)

        # Ajouter les infos utiles à la réponse
        data.update({
            'user': {
                'id': self.user.id,
                'username': self.user.username,
                'email': self.user.email,
                'first_name': self.user.first_name,
                'last_name': self.user.last_name,
                'user_type': self.user.user_type,
                'is_verified': self.user.is_verified,
            }
        })
        return data

class UserLoginView(TokenObtainPairView):
    """Vue personnalisée pour la connexion des utilisateurs"""
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]
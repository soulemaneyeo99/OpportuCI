# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import UserProfile

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        exclude = ('user',)
        extra_kwargs = {
            'cv': {'allow_null': True, 'required': False},
        }

class UserDetailSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 'first_name', 'last_name', 'user_type',
            'phone_number', 'profile_picture', 'bio', 'date_of_birth',
            'address', 'city', 'country', 'education_level', 'institution',
            'is_verified', 'created_at', 'updated_at', 'organization_name',
            'organization_type', 'organization_website', 'profile'
        )
        read_only_fields = ('id', 'email', 'is_verified', 'created_at', 'updated_at')
        extra_kwargs = {
            'profile_picture': {'allow_null': True, 'required': False},
        }

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    profile = UserProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = (
            'email', 'username', 'password', 'confirm_password', 'first_name', 
            'last_name', 'user_type', 'profile'
        )
        
    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as exc:
            raise serializers.ValidationError(str(exc))
        return value
        
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Les mots de passe ne correspondent pas."})
        return attrs
    
    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            user_type=validated_data.get('user_type', User.UserType.STUDENT)
        )
        
        # Le signal va créer le profil, nous devons donc le mettre à jour
        if profile_data:
            for attr, value in profile_data.items():
                setattr(user.profile, attr, value)
            user.profile.save()
            
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = (
            'first_name', 'last_name', 'phone_number', 'bio', 'date_of_birth',
            'address', 'city', 'country', 'education_level', 'institution',
            'organization_name', 'organization_type', 'organization_website', 
            'profile', 'current_password', 'new_password', 'profile_picture'
        )
        extra_kwargs = {
            'profile_picture': {'required': False},
        }
    
    def validate(self, attrs):
        # Vérifier si l'utilisateur essaie de changer son mot de passe
        if 'new_password' in attrs and not attrs.get('current_password'):
            raise serializers.ValidationError({
                "current_password": "Le mot de passe actuel est requis pour définir un nouveau mot de passe."
            })
            
        if 'current_password' in attrs and attrs['current_password']:
            user = self.instance
            if not user.check_password(attrs['current_password']):
                raise serializers.ValidationError({
                    "current_password": "Le mot de passe actuel est incorrect."
                })
            
            if 'new_password' in attrs:
                try:
                    validate_password(attrs['new_password'])
                except ValidationError as exc:
                    raise serializers.ValidationError({"new_password": str(exc)})
                    
        return attrs
    
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        current_password = validated_data.pop('current_password', None)
        new_password = validated_data.pop('new_password', None)
        
        # Mettre à jour les champs de l'utilisateur
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Changer le mot de passe si demandé
        if current_password and new_password:
            instance.set_password(new_password)
            
        instance.save()
        
        # Mettre à jour le profil
        if profile_data:
            for attr, value in profile_data.items():
                setattr(instance.profile, attr, value)
            instance.profile.save()
            
        return instance

class ProfilePictureUploadSerializer(serializers.Serializer):
    profile_picture = serializers.ImageField(
        required=True,
        error_messages={'required': 'Veuillez fournir une image.'}
    )
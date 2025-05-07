# accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core.validators import FileExtensionValidator, MinLengthValidator, RegexValidator
from django.utils import timezone
from django.core.exceptions import ValidationError
import os

def validate_image_size(file_obj):
    """Valide la taille de l'image (max 5MB)"""
    max_size = 5 * 1024 * 1024  # 5MB
    if file_obj.size > max_size:
        raise ValidationError(_('La taille maximale du fichier est de 5MB'))

def profile_picture_upload_path(instance, filename):
    """Chemin de stockage pour les photos de profil"""
    ext = filename.split('.')[-1].lower()
    timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
    return f'profile_pictures/{instance.id}/{instance.username}_{timestamp}.{ext}'

def user_cv_upload_path(instance, filename):
    """Chemin de stockage pour les CV"""
    ext = filename.split('.')[-1].lower()
    timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
    return f'cv/{instance.user.id}/{instance.user.username}_{timestamp}.{ext}'

class CustomUserManager(BaseUserManager):
    """
    Gestionnaire personnalisé pour le modèle User avec l'email comme identifiant unique.
    Fournit des méthodes pour créer des utilisateurs réguliers et des superutilisateurs.
    """
    
    def create_user(self, email, username, password=None, **extra_fields):
        """
        Crée et sauvegarde un utilisateur avec l'email et le mot de passe donnés.
        
        Args:
            email (str): Adresse email de l'utilisateur (obligatoire)
            username (str): Nom d'utilisateur (obligatoire)
            password (str, optional): Mot de passe
            **extra_fields: Champs supplémentaires pour User
            
        Returns:
            User: L'objet utilisateur créé
            
        Raises:
            ValueError: Si l'email n'est pas fourni
        """
        if not email:
            raise ValueError(_('L\'adresse e-mail est obligatoire'))
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, password=None, **extra_fields):
        """
        Crée et sauvegarde un superutilisateur avec l'email et le mot de passe donnés.
        
        Args:
            email (str): Adresse email du superutilisateur
            username (str): Nom d'utilisateur du superutilisateur
            password (str, optional): Mot de passe
            **extra_fields: Champs supplémentaires pour User
            
        Returns:
            User: L'objet superutilisateur créé
            
        Raises:
            ValueError: Si is_staff ou is_superuser n'est pas True
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_type', 'admin')
        extra_fields.setdefault('is_verified', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Un superutilisateur doit avoir is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Un superutilisateur doit avoir is_superuser=True.'))
        
        return self.create_user(email, username, password, **extra_fields)

class User(AbstractUser):
    """
    Modèle utilisateur étendu pour OpportuCI.
    
    Ce modèle comprend tous les champs nécessaires pour gérer les différents types
    d'utilisateurs (étudiants, organisations, administrateurs) avec leurs informations
    spécifiques et les fonctionnalités de sécurité.
    """

    class UserType(models.TextChoices):
        """Types d'utilisateurs disponibles dans le système"""
        STUDENT = 'student', _('Étudiant')
        ORGANIZATION = 'organization', _('Organisation')
        ADMIN = 'admin', _('Administrateur')

    # Informations de base
    email = models.EmailField(
        _('adresse e-mail'), 
        unique=True, 
        db_index=True,
        error_messages={
            'unique': _("Un utilisateur avec cette adresse e-mail existe déjà.")
        }
    )
    user_type = models.CharField(
        _('type d\'utilisateur'), 
        max_length=20, 
        choices=UserType.choices, 
        default=UserType.STUDENT,
        db_index=True
    )
    
    # Informations personnelles
    phone_number = models.CharField(
        _('numéro de téléphone'), 
        max_length=20, 
        blank=True, 
        null=True,
        validators=[
            RegexValidator(
                regex=r'^\+?[0-9]{8,15}$',
                message=_("Le numéro de téléphone doit contenir entre 8 et 15 chiffres.")
            )
        ]
    )
    profile_picture = models.ImageField(
        _('photo de profil'), 
        upload_to=profile_picture_upload_path, 
        blank=True, 
        null=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),
            validate_image_size
        ]
    )
    date_of_birth = models.DateField(_('date de naissance'), blank=True, null=True)
    address = models.CharField(_('adresse'), max_length=255, blank=True, null=True)
    city = models.CharField(_('ville'), max_length=100, blank=True, null=True)
    country = models.CharField(_('pays'), max_length=100, default='Côte d\'Ivoire')
    
    # Statut et vérification
    is_verified = models.BooleanField(_('est vérifié'), default=False)
    verification_token = models.CharField(_('jeton de vérification'), max_length=100, blank=True, null=True)
    verification_token_expires = models.DateTimeField(_('expiration du jeton'), blank=True, null=True)
    
    # Pour les étudiants
    education_level = models.CharField(_('niveau d\'éducation'), max_length=100, blank=True, null=True)
    institution = models.CharField(_('institution'), max_length=200, blank=True, null=True)

    # Pour les organisations
    organization_name = models.CharField(_('nom de l\'organisation'), max_length=200, blank=True, null=True)
    organization_type = models.CharField(_('type d\'organisation'), max_length=100, blank=True, null=True)
    organization_website = models.URLField(_('site web'), blank=True, null=True)

    # Sécurité et audit
    last_login_ip = models.GenericIPAddressField(_('dernière IP de connexion'), blank=True, null=True)
    failed_login_attempts = models.PositiveIntegerField(_('tentatives de connexion échouées'), default=0)
    last_failed_login = models.DateTimeField(_('dernière tentative échouée'), blank=True, null=True)
    is_locked = models.BooleanField(_('compte verrouillé'), default=False)
    created_at = models.DateTimeField(_('date de création'), auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(_('date de mise à jour'), auto_now=True)

    # Authentification
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    # Manager
    objects = CustomUserManager()

    class Meta:
        verbose_name = _('utilisateur')
        verbose_name_plural = _('utilisateurs')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['user_type']),
            models.Index(fields=['created_at']),
            models.Index(fields=['username']),
        ]

    def __str__(self):
        return self.email

    def get_full_name(self):
        """Retourne le nom complet de l'utilisateur ou le nom d'utilisateur si non disponible"""
        if self.is_organization and self.organization_name:
            return self.organization_name
            
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name or self.username

    def get_short_name(self):
        """Retourne le prénom de l'utilisateur ou le nom d'utilisateur si non disponible"""
        if self.is_organization:
            return self.organization_name or self.username
        return self.first_name or self.username

    def clean(self):
        """Validation personnalisée pour le modèle"""
        super().clean()
        
        # Validation spécifique selon le type d'utilisateur
        if self.user_type == self.UserType.ORGANIZATION:
            if not self.organization_name:
                raise ValidationError({'organization_name': _("Le nom de l'organisation est requis pour ce type d'utilisateur")})
        elif self.user_type == self.UserType.STUDENT:
            if not self.education_level:
                raise ValidationError({'education_level': _("Le niveau d'éducation est requis pour un étudiant")})

    @property
    def is_student(self):
        """Vérifie si l'utilisateur est un étudiant"""
        return self.user_type == self.UserType.STUDENT

    @property
    def is_organization(self):
        """Vérifie si l'utilisateur est une organisation"""
        return self.user_type == self.UserType.ORGANIZATION

    @property
    def is_admin(self):
        """Vérifie si l'utilisateur est un administrateur"""
        return self.user_type == self.UserType.ADMIN
    
    @property
    def age(self):
        """Calcule l'âge de l'utilisateur à partir de sa date de naissance"""
        if not self.date_of_birth:
            return None
        today = timezone.now().date()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )
    
    def reset_failed_login_attempts(self):
        """Réinitialise le compteur de tentatives de connexion échouées"""
        if self.failed_login_attempts > 0 or self.is_locked:
            self.failed_login_attempts = 0
            self.is_locked = False
            self.last_failed_login = None
            self.save(update_fields=['failed_login_attempts', 'is_locked', 'last_failed_login'])
    
    def record_login_failure(self, request=None):
        """
        Enregistre une tentative de connexion échouée et verrouille le compte si nécessaire
        
        Args:
            request: Objet request Django (optionnel)
        """
        self.failed_login_attempts += 1
        self.last_failed_login = timezone.now()
        
        # Verrouiller le compte après 5 tentatives échouées
        if self.failed_login_attempts >= 5:
            self.is_locked = True
        
        # Enregistrer l'IP si disponible
        if request and not self.is_locked:
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                self.last_login_ip = x_forwarded_for.split(',')[0]
            else:
                self.last_login_ip = request.META.get('REMOTE_ADDR')
        
        self.save(update_fields=['failed_login_attempts', 'last_failed_login', 'is_locked', 'last_login_ip'])
    
    def record_login_success(self, request=None):
        """
        Enregistre une connexion réussie
        
        Args:
            request: Objet request Django (optionnel)
        """
        self.reset_failed_login_attempts()
        
        # Enregistrer l'IP si disponible
        if request:
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                self.last_login_ip = x_forwarded_for.split(',')[0]
            else:
                self.last_login_ip = request.META.get('REMOTE_ADDR')
            self.save(update_fields=['last_login_ip'])
    
    def generate_verification_token(self):
        """Génère un jeton de vérification pour l'utilisateur"""
        import secrets
        self.verification_token = secrets.token_urlsafe(32)
        self.verification_token_expires = timezone.now() + timezone.timedelta(days=1)
        self.save(update_fields=['verification_token', 'verification_token_expires'])
        return self.verification_token

class UserProfile(models.Model):
    """
    Profil utilisateur avec informations supplémentaires.
    
    Ce modèle stocke les informations complémentaires liées au profil
    professionnel et académique d'un utilisateur.
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='profile',
        verbose_name=_('utilisateur')
    )
    bio = models.TextField(_('biographie'), blank=True, null=True)
    skills = models.TextField(
        _('compétences'), 
        blank=True, 
        null=True,
        help_text=_("Séparées par des virgules")
    )
    interests = models.TextField(
        _('centres d\'intérêt'), 
        blank=True, 
        null=True,
        help_text=_("Séparés par des virgules")
    )
    cv = models.FileField(
        _('CV'), 
        upload_to=user_cv_upload_path, 
        blank=True, 
        null=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx']),
            MinLengthValidator(10) # Pour éviter les fichiers vides
        ],
        help_text=_("Formats acceptés: PDF, DOC, DOCX (max 10MB)")
    )
    linkedin_profile = models.URLField(_('profil LinkedIn'), blank=True, null=True)
    github_profile = models.URLField(_('profil GitHub'), blank=True, null=True)
    portfolio_website = models.URLField(_('site portfolio'), blank=True, null=True)
    languages = models.TextField(
        _('langues'), 
        blank=True, 
        null=True, 
        help_text=_("Séparées par des virgules")
    )
    certifications = models.TextField(
        _('certifications'), 
        blank=True, 
        null=True,
        help_text=_("Séparées par des virgules")
    )
    availability_status = models.CharField(
        _('statut de disponibilité'),
        max_length=50,
        choices=[
            ('available', _('Disponible')),
            ('limited', _('Disponibilité limitée')),
            ('unavailable', _('Non disponible')),
        ],
        default='available'
    )
    created_at = models.DateTimeField(_('date de création'), auto_now_add=True)
    updated_at = models.DateTimeField(_('date de mise à jour'), auto_now=True)

    class Meta:
        verbose_name = _('profil utilisateur')
        verbose_name_plural = _('profils utilisateurs')

    def __str__(self):
        return f"Profil de {self.user.get_full_name()}"
    
    def get_skills_list(self):
        """Retourne les compétences sous forme de liste"""
        if not self.skills:
            return []
        return [skill.strip() for skill in self.skills.split(',') if skill.strip()]
    
    def get_languages_list(self):
        """Retourne les langues sous forme de liste"""
        if not self.languages:
            return []
        return [lang.strip() for lang in self.languages.split(',') if lang.strip()]

    def get_interests_list(self):
        """Retourne les centres d'intérêt sous forme de liste"""
        if not self.interests:
            return []
        return [interest.strip() for interest in self.interests.split(',') if interest.strip()]
    
    def clean(self):
        """Validation personnalisée pour le profil"""
        super().clean()
        
        # Validation des URLs
        for field_name in ['linkedin_profile', 'github_profile', 'portfolio_website']:
            url = getattr(self, field_name)
            if url:
                # Vérification simple que l'URL utilise HTTP ou HTTPS
                if not url.startswith(('http://', 'https://')):
                    raise ValidationError({field_name: _("L'URL doit commencer par http:// ou https://")})
        
        # Validation du CV
        if self.cv and self.cv.size > 10 * 1024 * 1024:  # 10MB
            raise ValidationError({'cv': _("La taille maximale du CV est de 10MB")})


# Création automatique du profil utilisateur
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Signal pour créer automatiquement un profil utilisateur lors de la création d'un utilisateur.
    
    Args:
        sender: Modèle qui envoie le signal (User)
        instance: Instance du modèle User qui a été sauvegardée
        created: True si l'instance a été créée, False si elle a été mise à jour
    """
    if created:
        UserProfile.objects.create(user=instance)
    else:
        # S'assurer que le profil existe même pour les utilisateurs existants
        UserProfile.objects.get_or_create(user=instance)
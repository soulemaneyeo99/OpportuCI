# backend/gamification/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from django.core.validators import MinValueValidator, MaxValueValidator

class CareerPath(models.Model):
    """Parcours de carrière structurés"""
    name = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default="#3B82F6")
    
    # Niveaux du parcours
    total_levels = models.PositiveIntegerField(default=5)
    estimated_duration_months = models.PositiveIntegerField(default=12)
    
    def get_user_progress(self, user):
        """Récupère le progrès de l'utilisateur dans ce parcours"""
        progress, created = UserCareerProgress.objects.get_or_create(
            user=user, career_path=self
        )
        return progress

class CareerLevel(models.Model):
    """Niveaux dans un parcours de carrière"""
    career_path = models.ForeignKey(CareerPath, on_delete=models.CASCADE, related_name='levels')
    level = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Exigences pour débloquer ce niveau
    required_points = models.PositiveIntegerField()
    required_skills = models.JSONField(default=list)
    required_badges = models.ManyToManyField('credibility.Badge', blank=True)
    
    class Meta:
        unique_together = ['career_path', 'level']
        ordering = ['career_path', 'level']

class UserCareerProgress(models.Model):
    """Progrès de l'utilisateur dans un parcours"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    career_path = models.ForeignKey(CareerPath, on_delete=models.CASCADE)
    current_level = models.PositiveIntegerField(default=1)
    started_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    @property
    def completion_percentage(self):
        return min(100, (self.current_level / self.career_path.total_levels) * 100)
    
    def can_advance_to_level(self, target_level):
        """Vérifie si l'utilisateur peut avancer au niveau suivant"""
        try:
            level_obj = CareerLevel.objects.get(career_path=self.career_path, level=target_level)
            user_points = self.user.credibility.points
            
            # Vérification des points
            if user_points < level_obj.required_points:
                return False, f"Il vous faut {level_obj.required_points - user_points} points de plus"
            
            # Vérification des badges
            user_badges = set(self.user.badges.values_list('badge_id', flat=True))
            required_badges = set(level_obj.required_badges.values_list('id', flat=True))
            
            if not required_badges.issubset(user_badges):
                missing = required_badges - user_badges
                return False, f"Badges manquants: {len(missing)}"
            
            return True, "Critères remplis"
        except CareerLevel.DoesNotExist:
            return False, "Niveau invalide"

class Challenge(models.Model):
    """Défis gamifiés pour engager les utilisateurs"""
    CHALLENGE_TYPES = [
        ('daily', 'Défi quotidien'),
        ('weekly', 'Défi hebdomadaire'),
        ('monthly', 'Défi mensuel'),
        ('special', 'Défi spécial'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    challenge_type = models.CharField(max_length=20, choices=CHALLENGE_TYPES)
    
    # Critères de complétion
    target_type = models.CharField(max_length=50)  # 'opportunities_applied', 'courses_completed', etc.
    target_count = models.PositiveIntegerField()
    
    # Récompenses
    reward_points = models.PositiveIntegerField()
    reward_badge = models.ForeignKey('credibility.Badge', on_delete=models.CASCADE, null=True, blank=True)
    
    # Période de validité
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    def check_completion(self, user):
        """Vérifie si l'utilisateur a complété le défi"""
        progress = UserChallengeProgress.objects.filter(
            user=user, challenge=self
        ).first()
        
        if not progress:
            return False
            
        return progress.current_count >= self.target_count

class UserChallengeProgress(models.Model):
    """Progrès de l'utilisateur dans les défis"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    current_count = models.PositiveIntegerField(default=0)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'challenge']

class MentorshipProgram(models.Model):
    """Programme de mentorat"""
    name = models.CharField(max_length=200)
    description = models.TextField()
    domain = models.CharField(max_length=100)  # Tech, Business, etc.
    is_active = models.BooleanField(default=True)
    
    # Critères pour devenir mentor
    min_experience_years = models.PositiveIntegerField()
    min_credibility_points = models.PositiveIntegerField()
    required_skills = models.JSONField(default=list)

class Mentor(models.Model):
    """Profil mentor"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentor_profile')
    programs = models.ManyToManyField(MentorshipProgram, related_name='mentors')
    
    # Informations professionnelles
    current_position = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    experience_years = models.PositiveIntegerField()
    expertise_areas = models.JSONField(default=list)
    
    # Disponibilité
    max_mentees = models.PositiveIntegerField(default=3)
    available_slots = models.PositiveIntegerField(default=3)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_pro_bono = models.BooleanField(default=False)
    
    # Statistiques
    total_mentees = models.PositiveIntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    response_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    def can_take_mentee(self):
        return self.available_slots > 0

class MentorshipRequest(models.Model):
    """Demandes de mentorat"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('accepted', 'Acceptée'),
        ('rejected', 'Rejetée'),
        ('completed', 'Terminée'),
    ]
    
    mentee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentorship_requests')
    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='received_requests')
    program = models.ForeignKey(MentorshipProgram, on_delete=models.CASCADE)
    
    # Détails de la demande
    goals = models.TextField()
    duration_weeks = models.PositiveIntegerField()
    preferred_meeting_frequency = models.CharField(max_length=50)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    
class MentorshipSession(models.Model):
    """Sessions de mentorat"""
    mentorship = models.ForeignKey(MentorshipRequest, on_delete=models.CASCADE, related_name='sessions')
    scheduled_at = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=60)
    
    # Feedback et notes
    mentee_notes = models.TextField(blank=True)
    mentor_notes = models.TextField(blank=True)
    mentee_rating = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    completed = models.BooleanField(default=False)
    cancelled = models.BooleanField(default=False)
    cancel_reason = models.TextField(blank=True)

# Services pour la gamification
class GamificationService:
    @staticmethod
    def update_user_progress(user, action_type, related_object=None):
        """Met à jour le progrès utilisateur après une action"""
        # Mise à jour des défis actifs
        active_challenges = Challenge.objects.filter(
            is_active=True,
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        )
        
        for challenge in active_challenges:
            if challenge.target_type == action_type:
                progress, created = UserChallengeProgress.objects.get_or_create(
                    user=user, challenge=challenge
                )
                
                if not progress.completed:
                    progress.current_count += 1
                    
                    # Vérification de complétion
                    if progress.current_count >= challenge.target_count:
                        progress.completed = True
                        progress.completed_at = timezone.now()
                        
                        # Attribution des récompenses
                        GamificationService.award_challenge_rewards(user, challenge)
                    
                    progress.save()
    
    @staticmethod
    def award_challenge_rewards(user, challenge):
        """Attribue les récompenses d'un défi complété"""
        from credibility.models import CredibilityPoints, PointsHistory
        
        # Attribution des points
        credibility, _ = CredibilityPoints.objects.get_or_create(user=user)
        credibility.add_points(challenge.reward_points)
        
        # Historique des points
        PointsHistory.objects.create(
            user=user,
            operation='add',
            points=challenge.reward_points,
            source='challenge_completion',
            description=f"Défi complété: {challenge.title}"
        )
        
        # Attribution du badge si applicable
        if challenge.reward_badge:
            from credibility.models import UserBadge
            UserBadge.objects.get_or_create(
                user=user,
                badge=challenge.reward_badge
            )
        
        # Notification
        from notifications.services import create_notification
        create_notification(
            user=user,
            title=f"Défi complété: {challenge.title}",
            message=f"Félicitations ! Vous avez gagné {challenge.reward_points} points.",
            notification_type='achievement'
        )
    
    @staticmethod
    def get_recommended_mentors(user, domain=None, max_results=5):
        """Recommande des mentors basés sur le profil utilisateur"""
        mentors = Mentor.objects.filter(
            available_slots__gt=0,
            user__is_active=True
        ).order_by('-average_rating', '-response_rate')
        
        if domain:
            mentors = mentors.filter(programs__domain=domain)
        
        # Filtrage par compétences similaires
        if hasattr(user, 'profile') and user.profile.skills:
            user_skills = set(user.profile.get_skills_list())
            scored_mentors = []
            
            for mentor in mentors[:20]:  # Limite pour performance
                mentor_skills = set(mentor.expertise_areas)
                overlap = len(user_skills.intersection(mentor_skills))
                scored_mentors.append((mentor, overlap))
            
            # Tri par score de correspondance
            scored_mentors.sort(key=lambda x: x[1], reverse=True)
            return [mentor for mentor, score in scored_mentors[:max_results]]
        
        return mentors[:max_results]
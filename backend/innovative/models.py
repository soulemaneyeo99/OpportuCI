# backend/innovative/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal
import uuid

class SkillAssessment(models.Model):
    """Évaluations de compétences adaptatives"""
    SKILL_CATEGORIES = [
        ('technical', 'Compétences techniques'),
        ('soft', 'Compétences douces'),
        ('language', 'Langues'),
        ('digital', 'Compétences numériques'),
    ]
    
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=SKILL_CATEGORIES)
    description = models.TextField()
    max_score = models.PositiveIntegerField(default=100)
    duration_minutes = models.PositiveIntegerField(default=30)
    
    # Questions adaptatives
    adaptive = models.BooleanField(default=True)
    difficulty_adjustment = models.BooleanField(default=True)

class AssessmentQuestion(models.Model):
    """Questions d'évaluation avec IA"""
    assessment = models.ForeignKey(SkillAssessment, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    question_type = models.CharField(max_length=20, choices=[
        ('multiple_choice', 'QCM'),
        ('coding', 'Code'),
        ('scenario', 'Scénario'),
        ('video_response', 'Réponse vidéo'),
    ])
    
    difficulty_level = models.PositiveIntegerField(default=1)  # 1-5
    time_limit_seconds = models.PositiveIntegerField(null=True, blank=True)
    
    # Données pour l'adaptation
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    average_time = models.PositiveIntegerField(default=0)

class UserSkillAssessment(models.Model):
    """Résultats d'évaluation utilisateur"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    assessment = models.ForeignKey(SkillAssessment, on_delete=models.CASCADE)
    score = models.PositiveIntegerField()
    percentile = models.PositiveIntegerField()
    
    # Analyse détaillée
    strengths = models.JSONField(default=list)
    weaknesses = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
    
    completed_at = models.DateTimeField(auto_now_add=True)
    time_taken_seconds = models.PositiveIntegerField()

class VirtualInternship(models.Model):
    """Stages virtuels et projets pratiques"""
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    industry = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=20, choices=[
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
    ])
    
    description = models.TextField()
    objectives = models.JSONField(default=list)
    duration_weeks = models.PositiveIntegerField()
    
    # Ressources et tâches
    resources = models.JSONField(default=list)
    tasks = models.JSONField(default=list)
    deliverables = models.JSONField(default=list)
    
    # Gamification
    points_reward = models.PositiveIntegerField(default=100)
    certificate_template = models.FileField(upload_to='certificates/', null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class VirtualInternshipProgress(models.Model):
    """Progrès dans les stages virtuels"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    internship = models.ForeignKey(VirtualInternship, on_delete=models.CASCADE)
    
    current_task = models.PositiveIntegerField(default=0)
    completed_tasks = models.JSONField(default=list)
    submissions = models.JSONField(default=dict)
    
    mentor_feedback = models.TextField(blank=True)
    peer_reviews = models.JSONField(default=list)
    
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    @property
    def completion_percentage(self):
        if not self.internship.tasks:
            return 0
        return int((len(self.completed_tasks) / len(self.internship.tasks)) * 100)

class NetworkingEvent(models.Model):
    """Événements de networking virtuels"""
    EVENT_TYPES = [
        ('webinar', 'Webinaire'),
        ('workshop', 'Atelier'),
        ('networking', 'Networking'),
        ('career_fair', 'Salon de l\'emploi virtuel'),
        ('panel', 'Table ronde'),
    ]
    
    title = models.CharField(max_length=200)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    description = models.TextField()
    
    # Logistique
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    registration_deadline = models.DateTimeField()
    
    # Plateforme
    platform = models.CharField(max_length=50, choices=[
        ('zoom', 'Zoom'),
        ('teams', 'Microsoft Teams'),
        ('meet', 'Google Meet'),
        ('custom', 'Plateforme personnalisée'),
    ])
    meeting_link = models.URLField(blank=True)
    meeting_password = models.CharField(max_length=50, blank=True)
    
    # Intervenants
    speakers = models.JSONField(default=list)
    agenda = models.JSONField(default=list)
    
    # Gamification
    attendance_points = models.PositiveIntegerField(default=20)
    participation_points = models.PositiveIntegerField(default=10)
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

class EventRegistration(models.Model):
    """Inscriptions aux événements"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(NetworkingEvent, on_delete=models.CASCADE)
    
    registered_at = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)
    feedback = models.TextField(blank=True)
    rating = models.PositiveIntegerField(null=True, blank=True)
    
    # Networking
    connections_made = models.JSONField(default=list)

class CareerSimulation(models.Model):
    """Simulations de parcours de carrière"""
    title = models.CharField(max_length=200)
    career_field = models.CharField(max_length=100)
    description = models.TextField()
    
    # Scénarios
    scenarios = models.JSONField(default=list)
    decision_points = models.JSONField(default=list)
    outcomes = models.JSONField(default=dict)
    
    # Métriques
    success_criteria = models.JSONField(default=dict)
    learning_objectives = models.JSONField(default=list)
    
    duration_minutes = models.PositiveIntegerField(default=45)
    difficulty = models.CharField(max_length=20, choices=[
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
    ])

class SimulationResult(models.Model):
    """Résultats de simulation de carrière"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    simulation = models.ForeignKey(CareerSimulation, on_delete=models.CASCADE)
    
    decisions_made = models.JSONField(default=dict)
    final_score = models.PositiveIntegerField()
    success_rate = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Feedback personnalisé
    strengths_identified = models.JSONField(default=list)
    areas_for_improvement = models.JSONField(default=list)
    career_recommendations = models.JSONField(default=list)
    
    completed_at = models.DateTimeField(auto_now_add=True)
    time_taken_minutes = models.PositiveIntegerField()

class AICareerCoach(models.Model):
    """Assistant IA pour coaching de carrière"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_coach')
    
    # Profil de l'utilisateur analysé par l'IA
    personality_profile = models.JSONField(default=dict)  # Big 5, MBTI insights
    career_interests = models.JSONField(default=list)
    skill_gaps = models.JSONField(default=dict)
    career_trajectory = models.JSONField(default=dict)
    
    # Recommandations personnalisées
    next_steps = models.JSONField(default=list)
    skill_development_plan = models.JSONField(default=dict)
    opportunity_matches = models.JSONField(default=list)
    
    last_analysis = models.DateTimeField(auto_now=True)
    
    def generate_career_insights(self):
        """Génère des insights de carrière basés sur l'IA"""
        # Analyse des données utilisateur
        user_data = {
            'skills': self.user.profile.get_skills_list() if hasattr(self.user, 'profile') else [],
            'applications': list(self.user.user_opportunities.filter(relation_type='applied').values_list('opportunity__category__name', flat=True)),
            'assessments': list(self.user.userskillassessment_set.values('assessment__name', 'score')),
            'activity_pattern': self._analyze_activity_pattern(),
        }
        
        # Algorithme de recommandation simplifié (à remplacer par une vraie IA)
        insights = {
            'career_fit': self._calculate_career_fit(user_data),
            'skill_recommendations': self._recommend_skills(user_data),
            'opportunity_alignment': self._analyze_opportunity_alignment(user_data),
            'next_actions': self._suggest_next_actions(user_data)
        }
        
        return insights
    
    def _analyze_activity_pattern(self):
        """Analyse les patterns d'activité de l'utilisateur"""
        from datetime import timedelta
        
        recent_activities = {
            'opportunities_viewed': self.user.user_opportunities.filter(
                relation_type='viewed',
                created_at__gte=timezone.now() - timedelta(days=30)
            ).count(),
            'courses_started': getattr(self.user, 'course_progress', []),
            'assessments_completed': self.user.userskillassessment_set.filter(
                completed_at__gte=timezone.now() - timedelta(days=30)
            ).count()
        }
        return recent_activities

class SocialImpactTracker(models.Model):
    """Suivi de l'impact social de la plateforme"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Métriques d'impact
    opportunities_secured = models.PositiveIntegerField(default=0)
    skills_acquired = models.PositiveIntegerField(default=0)
    mentees_helped = models.PositiveIntegerField(default=0)
    community_contributions = models.PositiveIntegerField(default=0)
    
    # Impact économique estimé
    estimated_income_increase = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    employment_status_improvements = models.PositiveIntegerField(default=0)
    
    # Impact social
    networks_expanded = models.PositiveIntegerField(default=0)
    knowledge_shared = models.PositiveIntegerField(default=0)
    
    last_updated = models.DateTimeField(auto_now=True)
    
    @classmethod
    def calculate_platform_impact(cls):
        """Calcule l'impact global de la plateforme"""
        from django.db.models import Sum
        
        total_impact = cls.objects.aggregate(
            total_opportunities=Sum('opportunities_secured'),
            total_skills=Sum('skills_acquired'),
            total_income_impact=Sum('estimated_income_increase'),
            total_mentoring=Sum('mentees_helped')
        )
        
        return {
            'users_impacted': cls.objects.filter(opportunities_secured__gt=0).count(),
            'total_opportunities_secured': total_impact['total_opportunities'] or 0,
            'total_skills_developed': total_impact['total_skills'] or 0,
            'economic_impact_xof': total_impact['total_income_impact'] or 0,
            'mentoring_connections': total_impact['total_mentoring'] or 0,
        }

class CompanyPartnerships(models.Model):
    """Partenariats avec entreprises pour placement direct"""
    company_name = models.CharField(max_length=200)
    industry = models.CharField(max_length=100)
    partnership_type = models.CharField(max_length=50, choices=[
        ('hiring_partner', 'Partenaire d\'embauche'),
        ('training_partner', 'Partenaire de formation'),
        ('internship_partner', 'Partenaire de stage'),
        ('mentorship_partner', 'Partenaire de mentorat'),
    ])
    
    # Détails du partenariat
    contact_person = models.CharField(max_length=200)
    contact_email = models.EmailField()
    partnership_agreement = models.FileField(upload_to='partnerships/', null=True, blank=True)
    
    # Métriques de performance
    total_placements = models.PositiveIntegerField(default=0)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    average_time_to_hire = models.PositiveIntegerField(default=0)  # en jours
    
    # Exigences spécifiques
    skill_requirements = models.JSONField(default=list)
    preferred_profiles = models.JSONField(default=dict)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class DirectPlacement(models.Model):
    """Placements directs via partenariats"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    company = models.ForeignKey(CompanyPartnerships, on_delete=models.CASCADE)
    position_title = models.CharField(max_length=200)
    
    # Processus de placement
    application_date = models.DateTimeField(auto_now_add=True)
    interview_scheduled = models.DateTimeField(null=True, blank=True)
    offer_received = models.DateTimeField(null=True, blank=True)
    offer_accepted = models.DateTimeField(null=True, blank=True)
    
    # Détails de l'offre
    salary_offered = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    benefits = models.JSONField(default=dict)
    start_date = models.DateField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=[
        ('applied', 'Candidature envoyée'),
        ('screening', 'Présélection'),
        ('interview', 'Entretien'),
        ('offer', 'Offre reçue'),
        ('accepted', 'Offre acceptée'),
        ('rejected', 'Rejeté'),
        ('withdrawn', 'Candidature retirée'),
    ], default='applied')

class BlockchainCertification(models.Model):
    """Certifications blockchain pour la vérification des compétences"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    certification_type = models.CharField(max_length=100)
    skill_name = models.CharField(max_length=200)
    
    # Hash blockchain
    blockchain_hash = models.CharField(max_length=128, unique=True)
    issuer_signature = models.TextField()
    
    # Métadonnées
    issued_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    verification_url = models.URLField()
    
    # Données de certification
    assessment_score = models.PositiveIntegerField()
    evidence_files = models.JSONField(default=list)
    verified_by = models.CharField(max_length=200)
    
    is_revoked = models.BooleanField(default=False)
    revocation_reason = models.TextField(blank=True)
    
    def verify_authenticity(self):
        """Vérifie l'authenticité du certificat sur la blockchain"""
        # Implémentation simplifiée - à connecter à une vraie blockchain
        import hashlib
        
        data = f"{self.user.id}{self.skill_name}{self.assessment_score}{self.issued_at}"
        expected_hash = hashlib.sha256(data.encode()).hexdigest()
        
        return self.blockchain_hash == expected_hash

# Services et utilitaires
class InnovativeServices:
    @staticmethod
    def create_personalized_learning_path(user):
        """Crée un parcours d'apprentissage personnalisé"""
        # Analyse des compétences actuelles
        current_skills = user.profile.get_skills_list() if hasattr(user, 'profile') else []
        
        # Analyse des objectifs de carrière
        career_goals = user.ai_coach.career_interests if hasattr(user, 'ai_coach') else []
        
        # Recommandations basées sur l'IA
        skill_gaps = InnovativeServices._identify_skill_gaps(current_skills, career_goals)
        
        learning_path = {
            'current_level': InnovativeServices._assess_current_level(user),
            'target_level': 'advanced',  # Basé sur les objectifs
            'skill_gaps': skill_gaps,
            'recommended_courses': InnovativeServices._recommend_courses(skill_gaps),
            'estimated_duration': InnovativeServices._estimate_completion_time(skill_gaps),
            'milestones': InnovativeServices._create_milestones(skill_gaps)
        }
        
        return learning_path
    
    @staticmethod
    def _identify_skill_gaps(current_skills, career_goals):
        """Identifie les gaps de compétences"""
        # Mapping simplifié compétences -> carrières
        career_skill_mapping = {
            'software_development': ['python', 'javascript', 'sql', 'git', 'agile'],
            'data_science': ['python', 'statistics', 'machine_learning', 'sql', 'visualization'],
            'digital_marketing': ['seo', 'social_media', 'analytics', 'content_creation', 'ppc'],
            'business_analysis': ['excel', 'sql', 'process_mapping', 'stakeholder_management']
        }
        
        required_skills = set()
        for goal in career_goals:
            if goal in career_skill_mapping:
                required_skills.update(career_skill_mapping[goal])
        
        current_skills_set = set([skill.lower().replace(' ', '_') for skill in current_skills])
        gaps = required_skills - current_skills_set
        
        return list(gaps)
    
    @staticmethod
    def match_users_for_networking(user, max_matches=10):
        """Trouve des utilisateurs compatibles pour le networking"""
        from django.contrib.auth import get_user_model
        from django.db.models import Q
        
        User = get_user_model()
        
        # Critères de matching
        user_skills = set(user.profile.get_skills_list()) if hasattr(user, 'profile') else set()
        user_interests = set(user.profile.get_interests_list()) if hasattr(user, 'profile') else set()
        
        # Trouve des utilisateurs avec compétences/intérêts similaires
        potential_matches = User.objects.filter(
            is_active=True
        ).exclude(id=user.id)[:50]  # Limite pour performance
        
        scored_matches = []
        for candidate in potential_matches:
            if not hasattr(candidate, 'profile'):
                continue
                
            candidate_skills = set(candidate.profile.get_skills_list())
            candidate_interests = set(candidate.profile.get_interests_list())
            
            # Score de similarité
            skill_overlap = len(user_skills.intersection(candidate_skills))
            interest_overlap = len(user_interests.intersection(candidate_interests))
            
            total_score = (skill_overlap * 2) + interest_overlap  # Pondération des compétences
            
            if total_score > 0:
                scored_matches.append((candidate, total_score))
        
        # Tri par score
        scored_matches.sort(key=lambda x: x[1], reverse=True)
        
        return [match[0] for match in scored_matches[:max_matches]]
    
    @staticmethod
    def generate_impact_report(user):
        """Génère un rapport d'impact personnalisé"""
        impact_tracker, _ = SocialImpactTracker.objects.get_or_create(user=user)
        
        # Calcul des métriques personnelles
        personal_impact = {
            'opportunities_applied': user.user_opportunities.filter(relation_type='applied').count(),
            'skills_assessed': user.userskillassessment_set.count(),
            'courses_completed': getattr(user, 'course_progress', []),  # À adapter selon votre modèle
            'community_contributions': impact_tracker.community_contributions,
            'estimated_career_growth': impact_tracker.estimated_income_increase
        }
        
        # Comparaison avec les autres utilisateurs
        platform_averages = SocialImpactTracker.calculate_platform_impact()
        
        report = {
            'personal_metrics': personal_impact,
            'platform_comparison': {
                'your_rank': InnovativeServices._calculate_user_rank(user, impact_tracker),
                'platform_averages': platform_averages
            },
            'achievements': InnovativeServices._get_user_achievements(user),
            'next_goals': InnovativeServices._suggest_next_goals(user, personal_impact)
        }
        
        return report
    
    @staticmethod
    def _calculate_user_rank(user, impact_tracker):
        """Calcule le rang de l'utilisateur"""
        total_score = (
            impact_tracker.opportunities_secured * 10 +
            impact_tracker.skills_acquired * 5 +
            impact_tracker.mentees_helped * 15 +
            impact_tracker.community_contributions * 3
        )
        
        better_users = SocialImpactTracker.objects.filter(
            opportunities_secured__gt=impact_tracker.opportunities_secured
        ).count()
        
        total_users = SocialImpactTracker.objects.count()
        percentile = max(1, 100 - int((better_users / total_users) * 100)) if total_users > 0 else 1
        
        return {
            'percentile': percentile,
            'total_score': total_score,
            'rank_description': f"Top {100 - percentile}%" if percentile > 50 else "Rising Star"
        }
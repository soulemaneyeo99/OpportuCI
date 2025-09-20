# backend/recommendations/models.py
from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib

class UserProfile(models.Model):
    """Profil utilisateur enrichi pour les recommandations"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_profile')
    
    # Compétences et centres d'intérêt
    skills_vector = models.JSONField(default=list, blank=True)
    interests_vector = models.JSONField(default=list, blank=True)
    career_goals = models.TextField(blank=True)
    
    # Historique de comportement
    viewed_opportunities = models.ManyToManyField('opportunities.Opportunity', blank=True, related_name='viewed_by_users')
    applied_opportunities = models.ManyToManyField('opportunities.Opportunity', blank=True, related_name='applied_by_users')
    
    # Score de matching
    preference_score = models.JSONField(default=dict, blank=True)
    
    def update_preference_vector(self):
        """Met à jour le vecteur de préférences basé sur l'activité utilisateur"""
        # Analyse des opportunités consultées/postulées
        viewed = list(self.viewed_opportunities.all().values_list('tags', 'category__name', 'location'))
        applied = list(self.applied_opportunities.all().values_list('tags', 'category__name', 'location'))
        
        # Pondération plus forte pour les candidatures
        all_interactions = viewed + (applied * 3)
        
        # Vectorisation TF-IDF
        if all_interactions:
            texts = [' '.join(filter(None, interaction)) for interaction in all_interactions]
            vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
            vectors = vectorizer.fit_transform(texts)
            self.preference_score = vectors.mean(axis=0).A1.tolist()
            self.save()

class RecommendationEngine:
    """Moteur de recommandation intelligent"""
    
    @staticmethod
    def get_personalized_opportunities(user, limit=10):
        """Recommandations personnalisées basées sur l'IA"""
        from opportunities.models import Opportunity
        
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        if created or not profile.preference_score:
            # Pour nouveaux utilisateurs, recommandations basées sur popularité
            return Opportunity.objects.filter(status='published').order_by('-view_count', '-created_at')[:limit]
        
        # Calcul de similarité avec toutes les opportunités
        opportunities = Opportunity.objects.filter(status='published').exclude(
            id__in=profile.applied_opportunities.all()
        )
        
        scores = []
        for opp in opportunities:
            # Vectorisation de l'opportunité
            opp_text = f"{opp.title} {opp.description} {opp.tags} {opp.category.name if opp.category else ''}"
            
            # Calcul de similarité cosinus avec les préférences utilisateur
            similarity = RecommendationEngine._calculate_similarity(
                profile.preference_score, 
                opp_text
            )
            
            # Facteurs de boost
            boost = 1.0
            if opp.featured:
                boost *= 1.5
            if opp.deadline and (opp.deadline - timezone.now()).days <= 7:
                boost *= 1.2
                
            scores.append((opp, similarity * boost))
        
        # Tri par score et retour
        scores.sort(key=lambda x: x[1], reverse=True)
        return [opp for opp, score in scores[:limit]]
    
    @staticmethod
    def _calculate_similarity(user_vector, opportunity_text):
        """Calcule la similarité entre préférences utilisateur et opportunité"""
        try:
            vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
            opp_vector = vectorizer.fit_transform([opportunity_text])
            
            # Cosinus similarity
            if len(user_vector) == opp_vector.shape[1]:
                return cosine_similarity([user_vector], opp_vector.toarray())[0][0]
            return 0.0
        except:
            return 0.0

class SmartAlert(models.Model):
    """Alertes intelligentes basées sur les préférences"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    keywords = models.JSONField(default=list)
    locations = models.JSONField(default=list) 
    categories = models.JSONField(default=list)
    min_match_score = models.FloatField(default=0.7)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def check_match(self, opportunity):
        """Vérifie si l'opportunité correspond aux critères d'alerte"""
        score = RecommendationEngine._calculate_similarity(
            self.keywords, 
            f"{opportunity.title} {opportunity.description}"
        )
        return score >= self.min_match_score

# backend/recommendations/tasks.py (avec Celery)
from celery import shared_task
from django.contrib.auth import get_user_model
from notifications.services import create_notification

@shared_task
def update_all_user_preferences():
    """Tâche périodique pour mettre à jour les préférences utilisateur"""
    User = get_user_model()
    for user in User.objects.filter(is_active=True):
        try:
            profile = UserProfile.objects.get(user=user)
            profile.update_preference_vector()
        except UserProfile.DoesNotExist:
            continue

@shared_task
def send_smart_alerts():
    """Envoie des alertes intelligentes pour nouvelles opportunités"""
    from opportunities.models import Opportunity
    from datetime import timedelta
    from django.utils import timezone
    
    # Opportunités publiées dans les dernières 24h
    recent_opps = Opportunity.objects.filter(
        publication_date__gte=timezone.now() - timedelta(days=1),
        status='published'
    )
    
    for opportunity in recent_opps:
        # Trouve les utilisateurs avec des alertes correspondantes
        matching_alerts = SmartAlert.objects.filter(is_active=True)
        
        for alert in matching_alerts:
            if alert.check_match(opportunity):
                create_notification(
                    user=alert.user,
                    title=f"Nouvelle opportunité qui vous correspond: {opportunity.title}",
                    message=f"Une opportunité correspondant à vos critères vient d'être publiée par {opportunity.organization}",
                    notification_type='new_opportunity',
                    related_object=opportunity
                )
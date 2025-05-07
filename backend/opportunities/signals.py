# opportunities/signals.py
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Opportunity, UserOpportunity

@receiver(pre_save, sender=Opportunity)
def set_publication_date(sender, instance, **kwargs):
    """
    Définir la date de publication si l'opportunité passe en statut 'published'
    """
    try:
        old_instance = Opportunity.objects.get(pk=instance.pk)
        # Si l'opportunité passe de brouillon à publiée, définir la date de publication
        if old_instance.status != 'published' and instance.status == 'published':
            instance.publication_date = timezone.now()
    except Opportunity.DoesNotExist:
        # Nouvelle opportunité, si publiée directement, définir la date de publication
        if instance.status == 'published' and not instance.publication_date:
            instance.publication_date = timezone.now()

@receiver(post_save, sender=Opportunity)
def update_opportunity_status(sender, instance, **kwargs):
    """
    Mettre à jour le statut de l'opportunité après sauvegarde si elle est expirée
    """
    if instance.is_expired and instance.status == 'published':
        # Éviter une boucle infinie de signaux en vérifiant si le statut a changé
        Opportunity.objects.filter(pk=instance.pk).update(status='expired')

@receiver(post_save, sender=UserOpportunity)
def handle_user_opportunity_creation(sender, instance, created, **kwargs):
    """
    Actions à effectuer lors de la création d'une relation utilisateur-opportunité
    """
    if created and instance.relation_type == 'applied':
        # Incrémenter le compteur de candidatures
        opportunity = instance.opportunity
        opportunity.application_count += 1
        opportunity.save(update_fields=['application_count'])

# Assurez-vous d'importer ces signaux dans votre fichier apps.py pour les activer
# opportunities/apps.py
from django.apps import AppConfig

class OpportunitiesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'opportunities'

    def ready(self):
        import opportunities.signals  # noqa
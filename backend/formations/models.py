# backend/formations/models.py
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Formation(models.Model):
    STATUS_CHOICES = (
        ('upcoming', 'À venir'),
        ('ongoing', 'En cours'),
        ('completed', 'Terminée'),
        ('canceled', 'Annulée'),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='formations')
    instructor = models.CharField(max_length=255)
    image = models.ImageField(upload_to='formations/', blank=True, null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True, null=True)
    is_online = models.BooleanField(default=False)
    is_free = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    max_participants = models.PositiveIntegerField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    @property
    def current_participants_count(self):
        return self.enrollments.count()
    
    @property
    def is_full(self):
        if self.max_participants:
            return self.current_participants_count >= self.max_participants
        return False


class Enrollment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('approved', 'Approuvée'),
        ('rejected', 'Rejetée'),
        ('canceled', 'Annulée'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='formation_enrollments')
    formation = models.ForeignKey(Formation, on_delete=models.CASCADE, related_name='enrollments')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    enrollment_date = models.DateTimeField(auto_now_add=True)
    completion_percentage = models.PositiveIntegerField(
        default=0, 
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    certificate_issued = models.BooleanField(default=False)
    feedback = models.TextField(blank=True, null=True)
    rating = models.PositiveSmallIntegerField(
        blank=True, 
        null=True, 
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )

    class Meta:
        unique_together = ('user', 'formation')
        ordering = ['-enrollment_date']

    def __str__(self):
        return f"{self.user.username} - {self.formation.title}"
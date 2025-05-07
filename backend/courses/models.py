# backend/courses/models.py
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.functional import cached_property
from formations.models import Formation


class Course(models.Model):
    DIFFICULTY_CHOICES = (
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
        ('expert', 'Expert'),
    )
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    formation = models.ForeignKey(Formation, on_delete=models.CASCADE, related_name='courses')
    instructor = models.CharField(max_length=255)
    duration_minutes = models.PositiveIntegerField()
    difficulty = models.CharField(max_length=15, choices=DIFFICULTY_CHOICES, default='beginner')
    order = models.PositiveIntegerField(default=1)  # For order in a formation
    is_published = models.BooleanField(default=False, db_index=True)  # Indexed for better filtering performance
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['formation', 'order']
        unique_together = ['formation', 'order']
        indexes = [
            models.Index(fields=['is_published', 'formation']),  # Common query pattern
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            # Ensure unique slug
            slug = base_slug
            counter = 1
            while Course.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
    
    @cached_property
    def published_lessons_count(self):
        """Cached property to avoid repeated queries"""
        return self.lessons.filter(is_published=True).count()
    
    @cached_property
    def total_duration(self):
        """Calculate total course duration based on lessons"""
        return self.lessons.filter(is_published=True).aggregate(
            total=models.Sum('duration_minutes')
        )['total'] or 0


class Lesson(models.Model):
    TYPE_CHOICES = (
        ('video', 'Vidéo'),
        ('article', 'Article'),
        ('quiz', 'Quiz'),
        ('exercise', 'Exercice'),
        ('project', 'Projet'),
    )
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    content = models.TextField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='video')
    video_url = models.URLField(blank=True, null=True)
    duration_minutes = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=1)
    is_published = models.BooleanField(default=False, db_index=True)  # Indexed for better filtering
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['course', 'order']
        unique_together = ['course', 'order']
        indexes = [
            models.Index(fields=['course', 'is_published']),  # Common query pattern
            models.Index(fields=['type']),  # For filtering by type
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    @cached_property
    def question_count(self):
        """Return the number of questions for this lesson (useful for quizzes)"""
        if self.type == 'quiz':
            return self.questions.count()
        return 0


class UserProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='course_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='user_progress')
    completed = models.BooleanField(default=False, db_index=True)  # Indexed for faster filtering
    completion_date = models.DateTimeField(blank=True, null=True)
    last_position_seconds = models.PositiveIntegerField(default=0)  # To resume video where left off
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'lesson']
        verbose_name_plural = "User Progress"
        indexes = [
            models.Index(fields=['user', 'completed']),  # For filtering completed lessons for a user
            models.Index(fields=['lesson', 'user']),  # Alternative lookup direction
        ]

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"


class Question(models.Model):
    DIFFICULTY_CHOICES = (
        ('easy', 'Facile'),
        ('medium', 'Moyen'),
        ('hard', 'Difficile'),
    )
    
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    points = models.PositiveIntegerField(default=1)
    explanation = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['lesson']),  # Frequently queried
        ]

    def __str__(self):
        return f"Question {self.id} - {self.lesson.title}"
    
    @cached_property
    def correct_answer(self):
        """Get the correct answer for this question"""
        return self.answers.filter(is_correct=True).first()


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False, db_index=True)  # Index for faster filtering
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['question', 'is_correct']),  # For finding correct answers efficiently
        ]

    def __str__(self):
        return f"Answer {self.id} - {self.question.id}"


class UserAnswer(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='user_answers')
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='user_selections')
    is_correct = models.BooleanField(default=False, db_index=True)  # Add index for faster filtering
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'question']
        indexes = [
            models.Index(fields=['user', 'is_correct']),  # For getting correct/incorrect answers by user
            models.Index(fields=['question', 'is_correct']),  # For analysis of question difficulty
        ]

    def __str__(self):
        return f"{self.user.username} - Question {self.question.id}"
    
    def save(self, *args, **kwargs):
        # Automatically set is_correct based on the selected answer
        if self.answer and not kwargs.get('update_fields') or 'answer' in kwargs.get('update_fields', []):
            self.is_correct = self.answer.is_correct
        super().save(*args, **kwargs)
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class User(AbstractUser):
    """
    Custom user model that extends Django's AbstractUser
    """
    is_company_admin = models.BooleanField(default=False)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    
    # Additional profile fields
    phone_number = models.CharField(
        max_length=15, 
        blank=True, 
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$')]
    )
    location = models.CharField(max_length=255, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    title = models.CharField(max_length=100, blank=True)
    occupation = models.CharField(max_length=100, blank=True)
    linkedin = models.URLField(max_length=200, blank=True)
    languages = models.CharField(max_length=200, blank=True)
    skills = models.JSONField(null=True, blank=True)  # Store skills as a JSON array
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    profile_image_url = models.URLField(max_length=500, blank=True)  # For storing URLs to external images

    def __str__(self):
        return self.username

class Job(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('in_progress', 'In Progress')
    ]

    title = models.CharField(max_length=200)
    company = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_jobs')
    description = models.TextField()
    requirements = models.TextField()
    location = models.CharField(max_length=200)
    salary_range = models.CharField(max_length=100)
    job_type = models.CharField(max_length=50)  # Full-time, Part-time, Contract, etc.
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    applicants = models.ManyToManyField(
        User,
        through='JobApplication',
        related_name='applied_jobs'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} at {self.company.company_name}"

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    applicant = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    cover_letter = models.TextField(blank=True)
    
    class Meta:
        unique_together = ('job', 'applicant')
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.applicant.username}'s application for {self.job.title}"

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    is_company_admin = models.BooleanField(default=False)
    company_name = models.CharField(max_length=255, blank=True, null=True)

    # Additional fields you mentioned:
    full_name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    occupation = models.CharField(max_length=255, blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)

    # For storing lists like jobs, use JSONField (works with SQLite)
    added_jobs = models.JSONField(default=list, blank=True)
    applied_jobs = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.username

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth import get_user_model


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
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)  # Add this field

    # For storing lists like jobs, use JSONField (works with SQLite)
    applied_jobs = models.ManyToManyField('Jobs', blank=True, related_name='applied_users')
    # applied_jobs = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.username


# Classes to store attributes
# This class stores contries supported by the website
class Countries(models.Model):
    country = models.CharField(max_length=255, blank=True, null=False)

    def __str__(self):
        return f"{self.country}"


# Class to store categories
class Categories(models.Model):
    category = models.CharField(max_length=255, blank=False, null=False)

    def __str__(self):
        return f"{self.category}"


# Class to store job types
class JobType(models.Model):
    job_type = models.CharField(max_length=255, blank=False, null=False)

    def __str__(self):
        return f"{self.job_type}"


# Class to store workplace
class Workplace(models.Model):
    workplace = models.CharField(max_length=50, blank=False, null=False)

    def __str__(self):
        return f"{self.workplace}"


# Class to store career level
class Career_level(models.Model):
    level = models.CharField(max_length=50, null=False, blank=True)

    def __str__(self):
        return f"{self.level}"


class Jobs(models.Model):
    title = models.CharField(max_length=50, blank=False, null=False)
    countries = models.ManyToManyField(Countries, related_name="countries", blank=True)
    post_date = models.DateField(auto_now_add=True, verbose_name="posted")
    # Admin and admin's company can be accessed from this field
    added_by = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        blank=True,
        null=False,
        related_name="added",
    )
    applied = models.ManyToManyField(CustomUser, blank=True, related_name="applied_to")
    salary = models.FloatField(blank=False, null=False)
    # True or False for Open or Closed
    status = models.BooleanField(null=False, default=True)
    job_type = models.ForeignKey(
        JobType, on_delete=models.CASCADE, related_name="jobs_in_jobType"
    )
    experience = models.IntegerField(null=False, blank=False)

    workplace = models.ForeignKey(
        Workplace, on_delete=models.CASCADE, related_name="jobs_in_workplace"
    )
    category = models.ForeignKey(
        Categories, on_delete=models.CASCADE, related_name="jobs_in_category"
    )
    logo = models.ImageField(upload_to="logos/", blank=True, null=True)
    career_level = models.ForeignKey(
        Career_level, on_delete=models.CASCADE, related_name="jobs_in_level"
    )

    details_link = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()

    def __str__(self):
        return f"{self.title}"

    def as_json(self):
        return {
            "id": self.pk,
            "title": self.title,
            "company": self.added_by.company_name,
            "country": [country.country for country in self.countries.all()],
            "posted": self.post_date.isoformat() if self.post_date else None,
            "salary": self.salary,
            "status": self.status,
            "experience": self.experience,
            "created_by": self.added_by.username,
            "job_type": self.job_type.job_type,
            "workplace": self.workplace.workplace,
            "tags": [tag.tag for tag in self.job_tags.all()],
            "category": self.category.category,
            "career_level": self.career_level.level,
            "logo": self.logo.url if self.logo else "/media/logos/img_missing.jpg",
            "details_link": self.details_link or f"/pages/job_details.html?job_id={self.pk}",
            "description": self.description,
        }


# Classes to store multi-valued attributes
# This class stores tags for each job
class Tags(models.Model):
    tag = models.CharField(max_length=255, null=False)
    job = models.ForeignKey(Jobs, on_delete=models.CASCADE, related_name="job_tags")

    def __str__(self):
        return f"{self.job}: {self.tag}"


class JobApplication(models.Model):
    job = models.ForeignKey('Jobs', on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='applications')
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    cover_letter = models.TextField()
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ])

    class Meta:
        unique_together = ('job', 'applicant')  # Prevent duplicate applications
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.applicant.username}'s application for {self.job.title}"

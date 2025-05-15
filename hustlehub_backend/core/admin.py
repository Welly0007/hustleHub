from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Job, JobApplication

class UserAdmin(BaseUserAdmin):
    """
    Custom User Admin that includes the additional fields
    from our User model
    """
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Company Info', {'fields': ('is_company_admin', 'company_name')}),
        ('Profile Info', {'fields': (
            'phone_number', 'location', 'date_of_birth', 
            'title', 'occupation', 'linkedin', 'languages',
            'skills', 'profile_image', 'profile_image_url'
        )}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_company_admin')
    list_filter = BaseUserAdmin.list_filter + ('is_company_admin',)
    search_fields = ('username', 'email', 'first_name', 'last_name', 'company_name')

admin.site.register(User, UserAdmin)
admin.site.register(Job)
admin.site.register(JobApplication)

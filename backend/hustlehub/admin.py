from django.contrib import admin
from .models import CustomUser, Jobs, JobType, Workplace, Career_level, Categories, Countries, Tags

admin.site.register(CustomUser)
admin.site.register(Tags)
admin.site.register(Jobs)
admin.site.register(JobType)
admin.site.register(Workplace)
admin.site.register(Career_level)
admin.site.register(Categories)
admin.site.register(Countries)
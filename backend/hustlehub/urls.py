from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('pages/jobs.html', views.jobs, name='jobs'),
    path('pages/contact.html', views.contact, name='contact'),
    path('pages/profile.html', views.profile, name='profile'),
    path('pages/AProfile.html', views.admin_profile, name='admin_profile'),
    path('pages/login.html', views.login_view, name='login'),
    path('pages/add_job.html', views.add_job, name='add_job'),
    path('pages/apply.html', views.apply, name='apply'),
    path('pages/job_details.html', views.job_details, name='job_details'),
    path('pages/submitted_successfully.html', views.submitted_successfully, name='submitted_successfully'),
    path('pages/signup.html', views.signup, name='signup'),
    path('pages/forgotPassword.html', views.forgot_password, name='forgot_password'),
    path('pages/edit_job.html', views.edit_job, name='edit_job'),

]
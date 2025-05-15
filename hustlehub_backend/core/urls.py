from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.home_view, name='home'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    path('jobs/', views.jobs_view, name='jobs'),
    path('jobs/add/', views.jobs_add_view, name='jobs_add'),
    path('contact/', views.contact_view, name='contact'),
    path('api/profile/', views.api_user_profile, name='api_profile'),
] 
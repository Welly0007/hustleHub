from django.urls import path
from .views import (
    signup_view,
    custom_login_view,
    addJob,
    login_page_view,  # Updated import
    home,
    edit_job,
    contact,
    jobs,
    profile,
    admin_profile,
    delete_account,  # Import delete_account
)
from .views import (
    login_page,
    add_job,
    apply,
    job_details,
    submitted_successfully,
    forgot_password,
    signup,
)
from . import views
from django.urls import re_path
from .views.jobs import job_detail_api, edit_job_api, check_application_status
from .views.editjob import edit_job as edit_job_page
from .views.addJob import addJob
from .views.accounts import get_job_details, get_applied_jobs, apply_to_job

urlpatterns = [
    path('api/user/applied_jobs/', get_applied_jobs, name='get_applied_jobs'),
    path("", views.home, name="home"),
    path("pages/jobs.html", views.jobs, name="jobs"),
    path("pages/contact.html", views.contact, name="contact"),
    path("pages/profile.html", views.profile, name="profile"),
    path("pages/AProfile.html", views.admin_profile, name="admin_profile"),
    path("pages/login.html", login_page_view, name="login_page"),  # Updated usage
    path("pages/login.html/", login_page_view, name="login_page_slash"),  # Updated usage
    path("api/login/", custom_login_view, name="login_api"),  # Updated usage
    path("pages/add_job.html", views.addJob, name="add_job"),
    path("pages/apply.html", views.apply, name="apply"),
    path("pages/job_details.html", views.job_details, name="job_details"),
    path(
        "pages/submitted_successfully.html",
        views.submitted_successfully,
        name="submitted_successfully",
    ),
    path("pages/signup.html", views.signup, name="signup_page"),
    path("pages/signup.html/", views.signup, name="signup_page_slash"),
    path("api/signup/", signup_view, name="signup_api"),
    path("pages/forgotPassword.html", views.forgot_password, name="forgot_password"),
    path(
        "pages/edit_job.html",
        lambda request: edit_job_page(request, request.GET.get("job_id")),
        name="edit_job",
    ),
    path("api/jobs/<int:job_id>/", job_detail_api, name="job_detail_api"),
    path("api/jobs/<int:job_id>/edit/", edit_job_api, name="edit_job_api"),
    path("api/applications/check/", check_application_status, name="check_application_status"),
    path("profile/delete/", delete_account, name="delete_account"),  # Add this line
    path("api/jobs/<int:job_id>/", get_job_details, name="get_job_details"),
    path('api/apply/', apply_to_job, name='apply_to_job'),
]

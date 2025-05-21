from django.urls import path
from .views import (
    signup_view,
    login_view,
    login,
    home,
    edit_job,
    contact,
    jobs,
    profile,
    admin_profile,
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
from .views.jobs import job_detail_api, edit_job_api
from .views.editjob import edit_job as edit_job_page
from .views.addJob import addJob

urlpatterns = [
    path("", views.home, name="home"),
    path("pages/jobs.html", views.jobs, name="jobs"),
    path("pages/contact.html", views.contact, name="contact"),
    path("pages/profile.html", views.profile, name="profile"),
    path("pages/AProfile.html", views.admin_profile, name="admin_profile"),
    path("pages/login.html", views.login, name="login_page"),
    path("pages/login.html/", views.login, name="login_page_slash"),
    path("api/login/", views.login_view, name="login_api"),
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
]

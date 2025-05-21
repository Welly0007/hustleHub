from .accounts import (
    signup_view,
    custom_login_view,
    login_page_view,
    home,
    edit_job,
    contact,
    profile,
    admin_profile,
    delete_account,  # Add this import
)
from .accounts import login_page, add_job, apply, submitted_successfully, forgot_password, signup
from .jobs import jobs, job_details
from .addJob import addJob

__all__ = [
    "signup_view",
    "custom_login_view",
    "login_page_view",
    "home",
    "edit_job",
    "contact",
    "profile",
    "admin_profile",
    "delete_account",  # Add this to the __all__ list
    "login_page",
    "addJob",
    "apply",
    "job_details",
    "submitted_successfully",
    "forgot_password",
    "signup",
]
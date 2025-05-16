from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'index.html')

def jobs(request):
    return render(request, 'pages/jobs.html')

def contact(request):
    return render(request, 'pages/contact.html')

def profile(request):
    return render(request, 'pages/profile.html')

def admin_profile(request):
    return render(request, 'pages/AProfile.html')

def login_view(request):
    return render(request, 'pages/login.html')

def add_job(request):
    return render(request, 'pages/add_job.html')

def apply(request):
    return render(request, 'pages/apply.html')

def job_details(request):
    return render(request, 'pages/job_details.html')

def submitted_successfully(request):
    return render(request, 'pages/submitted_successfully.html')

def signup(request):
    return render(request, 'pages/signup.html')

def forgot_password(request):
    return render(request, 'pages/forgotPassword.html')

def edit_job(request):
    return render(request, 'pages/edit_job.html')
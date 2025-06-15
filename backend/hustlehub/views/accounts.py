from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model, login as auth_login, authenticate
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import logging
import json
from datetime import date
from hustlehub.models import Jobs, JobApplication

logger = logging.getLogger(__name__)
User = get_user_model()

# Create your views here.
def home(request):
    user_data = get_user_data(request)
    return render(request, 'index.html',  {"user_data": json.dumps(user_data)})

def contact(request):
    return render(request, 'pages/contact.html')

@login_required
def profile_get(request):
    user_data = {
        "username": request.user.username,
        "email": request.user.email,
        "phone_number": request.user.phone_number,
        "full_name": request.user.full_name,
        "date_of_birth": request.user.date_of_birth.isoformat() if request.user.date_of_birth else None,
        "location": request.user.location,
        "title": request.user.title,
        "occupation": request.user.occupation,
        "language": request.user.language,
        "linkedin": request.user.linkedin,
        "avatar": request.user.avatar.url if request.user.avatar else None,
        "is_company_admin": request.user.is_company_admin,
    }

    return render(request, 'pages/profile.html', {"user_data": json.dumps(user_data)})

def admin_profile(request):
    return render(request, 'pages/AProfile.html')

def login_page(request):
    return render(request, 'pages/login.html')

def add_job(request):
    return render(request, 'pages/add_job.html')

def apply(request):
    return render(request, 'pages/apply.html')

def submitted_successfully(request):
    return render(request, 'pages/submitted_successfully.html')

def signup(request):
   return render(request, 'pages/signup.html') 

def forgot_password(request):
    return render(request, 'pages/forgotPassword.html')

def edit_job(request):
    return render(request, 'pages/edit_job.html')

########

@csrf_exempt
def signup_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            logger.info(f"Received signup data: {data}")

            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            is_admin = data.get('isAdmin', False)
            company_name = data.get('companyName', '')

            # Check for duplicate email or username
            if User.objects.filter(username=username).exists():
                logger.warning(f"Username already exists: {username}")
                return JsonResponse({'error': 'Username already exists'}, status=400)
            if User.objects.filter(email=email).exists():
                logger.warning(f"Email already exists: {email}")
                return JsonResponse({'error': 'Email already exists'}, status=400)

            # Create and save user with CustomUser model
            try:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    is_company_admin=is_admin,
                    company_name=company_name if is_admin else '',
                )
                auth_login(request, user)
                logger.info(f"User created successfully: {username}")

                return JsonResponse({
                    'message': 'Signup successful',
                    'isAdmin': is_admin
                })
            except Exception as e:
                logger.error(f"Error creating user: {str(e)}")
                return JsonResponse({'error': f'Error creating user: {str(e)}'}, status=500)

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON: {str(e)}")
            return JsonResponse({'error': f'Invalid JSON: {str(e)}'}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error in signup: {str(e)}")
            return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

@login_required
def profile(request):
    if request.method == "POST":
        user = request.user
        user.username = request.POST.get("username", user.username)
        user.email = request.POST.get("email", user.email)
        user.phone_number = request.POST.get("phoneNumber", user.phone_number)
        user.full_name = request.POST.get("fullName", user.full_name)
        
        # Handle empty date_of_birth
        date_of_birth = request.POST.get("dateOfBirth")
        user.date_of_birth = date_of_birth if date_of_birth else None
        
        user.location = request.POST.get("location", user.location)
        user.title = request.POST.get("title", user.title)
        user.occupation = request.POST.get("occupation", user.occupation)
        user.language = request.POST.get("language", user.language)
        user.linkedin = request.POST.get("linkedin", user.linkedin)        # Handle avatar upload
        if "avatar" in request.FILES:
            user.avatar = request.FILES["avatar"]
        
        user.save()  # Save all changes to the database
        return redirect("profile")  # This redirects to the URL named "profile" in urls.py
        
    # Pass serialized user data to the template
    user_data = {
        "username": request.user.username,
        "email": request.user.email,
        "phone_number": request.user.phone_number,
        "full_name": request.user.full_name,
        "date_of_birth": request.user.date_of_birth.isoformat() if request.user.date_of_birth else None,
        "location": request.user.location,
        "title": request.user.title,
        "occupation": request.user.occupation,
        "language": request.user.language,
        "linkedin": request.user.linkedin,
        "avatar": request.user.avatar.url if request.user.avatar else None,
        "is_company_admin": request.user.is_company_admin,
    }
    return render(request, "pages/profile.html", {"user_data": json.dumps(user_data)})
@login_required
def admin_profile(request):
    if request.method == "POST":
        user = request.user
        user.username = request.POST.get("username", user.username)
        user.email = request.POST.get("email", user.email)
        user.phone_number = request.POST.get("phoneNumber", user.phone_number)
        user.full_name = request.POST.get("fullName", user.full_name)
        
        # Handle empty date_of_birth
        date_of_birth = request.POST.get("dateOfBirth")
        user.date_of_birth = date_of_birth if date_of_birth else None
        
        user.location = request.POST.get("location", user.location)
        user.title = request.POST.get("title", user.title)
        user.company_name = request.POST.get("company_name", user.company_name)
        user.language = request.POST.get("language", user.language)
        user.linkedin = request.POST.get("linkedin", user.linkedin)
        # Handle avatar upload
        if "avatar" in request.FILES:
            user.avatar = request.FILES["avatar"]
        user.save()  # Save all changes to the database
        return redirect("admin_profile")    # Pass serialized user data to the template
    user_data = {
        "username": request.user.username,
        "email": request.user.email,
        "phone_number": request.user.phone_number,
        "full_name": request.user.full_name,
        "date_of_birth": request.user.date_of_birth.isoformat() if request.user.date_of_birth else None,
        "location": request.user.location,
        "title": request.user.title,
        "company_name": request.user.company_name,
        "language": request.user.language,
        "linkedin": request.user.linkedin,
        "avatar": request.user.avatar.url if request.user.avatar else None,
        "is_company_admin": request.user.is_company_admin,
    }
    return render(request, "pages/AProfile.html", {"user_data": json.dumps(user_data)})
@login_required
def delete_account(request):
    if request.method == "POST":
        request.user.delete()
        return redirect("home")

@csrf_exempt
def custom_login_view(request):  # Renamed from login_view
    if request.method == 'GET':
        # Show login page
        return render(request, 'pages/login.html')
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            # Find user by email first
            try:
                user_obj = User.objects.get(email=email)
                # Then authenticate with username and password
                user = authenticate(request, username=user_obj.username, password=password)
                
                if user is not None:
                    auth_login(request, user)
                    
                    return JsonResponse({
                        'success': True,
                        'isAdmin': user.is_company_admin
                    })
                else:
                    return JsonResponse({'error': 'Invalid credentials'}, status=400)
            
            except User.DoesNotExist:
                return JsonResponse({'error': 'Email not found'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

def login_page_view(request):  # Renamed from login
    if request.method == 'GET':
        return render(request, 'pages/login.html')

def get_user_data(request):
    if request.user.is_authenticated:
        date_of_birth = getattr(request.user, "date_of_birth", None)
        return {
            "username": request.user.username,
            "email": request.user.email,
            "phone_number": getattr(request.user, "phone_number", ""),
            "full_name": getattr(request.user, "full_name", ""),
            "date_of_birth": date_of_birth.isoformat() if date_of_birth else None,
            "location": getattr(request.user, "location", ""),
            "title": getattr(request.user, "title", ""),
            "occupation": getattr(request.user, "occupation", ""),
            "company_name": getattr(request.user, "company_name", ""),
            "language": getattr(request.user, "language", ""),
            "linkedin": getattr(request.user, "linkedin", ""),
            "avatar": request.user.avatar.url if getattr(request.user, "avatar", None) else None,
            "is_company_admin": getattr(request.user, "is_company_admin", False),
            # Add more fields as needed
        }
    else:
        return {}

def job_details(request, job_id):
    # ...fetch job logic...
    user_data = get_user_data(request) or {}
    return render(request, 'pages/job_details.html', {
        "user_data": json.dumps(user_data)
    })

@csrf_exempt
def get_job_details(request, job_id):
    try:
        job = Jobs.objects.get(pk=job_id)
        return JsonResponse(job.as_json())
    except Jobs.DoesNotExist:
        return JsonResponse({"error": "Job not found"}, status=404)

@csrf_exempt
def apply_to_job(request):
    if request.method == "POST":
        job_id = request.POST.get("job_id")
        name = request.POST.get("name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        resume = request.FILES.get("resume")
        cover_letter = request.POST.get("cover")

        try:
            job = Jobs.objects.get(pk=job_id)
            applicant = request.user

            # Check if the user has already applied
            if JobApplication.objects.filter(job=job, applicant=applicant).exists():
                return JsonResponse({"error": "You have already applied for this job."}, status=400)

            # Create a new job application
            application = JobApplication.objects.create(
                job=job,
                applicant=applicant,
                resume=resume,
                cover_letter=cover_letter
            )
            applicant.applied_jobs.add(job)
            return JsonResponse({"message": "Application submitted successfully."})

        except Jobs.DoesNotExist:
            return JsonResponse({"error": "Job not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid HTTP method."}, status=405)

@login_required
def get_applied_jobs(request):
    if request.method == "GET":
        user = request.user
        applied_jobs = user.applied_jobs.all()
        jobs_data = [
            {
                "title": job.title,
                "company": job.added_by.company_name,
                "post_date": job.post_date,
            }
            for job in applied_jobs
        ]
        return JsonResponse(jobs_data, safe=False)
    return JsonResponse({"error": "Invalid HTTP method."}, status=405)


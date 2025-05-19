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

def login_page(request):
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

########
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model, login as auth_login
import json
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

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
####
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login as auth_login
from django.http import JsonResponse
import json

@csrf_exempt
def login_view(request):
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

# If you want a simple view to just render the login page without JSON:
def login(request):
    if request.method == 'GET':
        return render(request, 'pages/login.html')

from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model, login, authenticate, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

User = get_user_model()

def home_view(request):
    return render(request, 'index.html')

def signup_view(request):
    # If user is already logged in, redirect to profile
    if request.user.is_authenticated:
        return redirect('core:profile')
    
    if request.method == "POST":
        try:
            # Handle both JSON and form data
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.POST
            
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            confirm_password = data.get("confirm_password")
            is_admin = data.get("is_company_admin") == "True"
            company_name = data.get("company_name", "")

            # Validation
            if not all([username, email, password, confirm_password]):
                return JsonResponse({"error": "All fields are required"}, status=400)

            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match"}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already registered"}, status=400)

            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                is_company_admin=is_admin,
                company_name=company_name if is_admin else ""
            )

            # Authenticate and login
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return JsonResponse({
                    "redirect_url": "/profile/"
                })
            return JsonResponse({"error": "Authentication failed"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return render(request, "pages/signup.html")

def login_view(request):
    # If user is already logged in, redirect to profile
    if request.user.is_authenticated:
        return redirect('core:profile')
        
    if request.method == "POST":
        try:
            # Handle both JSON and form data
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                email = data.get("email")
                password = data.get("password")
            else:
                email = request.POST.get("email")
                password = request.POST.get("password")

            if not email or not password:
                return JsonResponse({"error": "Email and password are required"}, status=400)

            # Try to find user by email
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({"error": "Invalid email or password"}, status=400)

            # Authenticate with username (since Django uses username for auth)
            user = authenticate(request, username=user.username, password=password)
            
            if user is not None:
                login(request, user)
                # Redirect to profile page
                return JsonResponse({
                    "redirect_url": "/profile/"
                })
            return JsonResponse({"error": "Invalid email or password"}, status=400)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return render(request, "pages/login.html")

def logout_view(request):
    logout(request)
    return redirect('core:login')

def profile_view(request):
    if not request.user.is_authenticated:
        return redirect('core:login')
    
    # Get user data from our User model
    user = request.user
    user_data = {
        'username': user.username,
        'email': user.email,
        'is_company_admin': user.is_company_admin,
        'company_name': user.company_name if user.is_company_admin else '',
        'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
        'phone_number': user.phone_number,
        'location': user.location,
        'date_of_birth': user.date_of_birth,
        'title': user.title,
        'occupation': user.occupation,
        'linkedin': user.linkedin,
        'language': user.languages,
        'skills': user.skills or [],
        'profile_picture': user.profile_image_url if user.profile_image_url else user.profile_image.url if user.profile_image else None,
    }
    
    template = "pages/AProfile.html" if user.is_company_admin else "pages/profile.html"
    return render(request, template, {'user_data': user_data})

def jobs_view(request):
    return render(request, "pages/jobs.html")

def jobs_add_view(request):
    if not request.user.is_authenticated or not request.user.is_company_admin:
        return redirect('core:login')
    return render(request, "pages/add_job.html")

def contact_view(request):
    return render(request, "pages/contact.html")

def api_user_profile(request):
    """API endpoint to get user profile data"""
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    
    try:
        user = request.user
        user_data = {
            'username': user.username,
            'email': user.email,
            'is_company_admin': user.is_company_admin,
            'company_name': user.company_name if user.is_company_admin else '',
            'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
            'phone_number': user.phone_number,
            'location': user.location,
            'date_of_birth': user.date_of_birth.strftime('%Y-%m-%d') if user.date_of_birth else None,
            'title': user.title,
            'occupation': user.occupation,
            'linkedin': user.linkedin,
            'language': user.languages,
            'skills': user.skills or [],
            'profile_picture': user.profile_image_url or (user.profile_image.url if user.profile_image else None),
        }
        return JsonResponse(user_data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
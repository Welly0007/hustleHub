import os
import json
from datetime import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings
from core.models import UserProfile

User = get_user_model()

class Command(BaseCommand):
    help = 'Import users from JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Path to JSON file with user data')

    def handle(self, *args, **options):
        json_file = options['json_file']
        
        if not os.path.exists(json_file):
            self.stdout.write(self.style.ERROR(f'File {json_file} does not exist'))
            return
        
        try:
            with open(json_file, 'r') as f:
                users_data = json.load(f)
            
            # Check if the data is an array or an object
            if isinstance(users_data, dict):
                users_data = [users_data]
            
            created_count = 0
            updated_count = 0
            
            for user_data in users_data:
                username = user_data.get('username')
                email = user_data.get('email')
                
                if not username or not email:
                    self.stdout.write(self.style.WARNING(f'Skipping user without username or email'))
                    continue
                
                # Check if user exists
                user, created = User.objects.get_or_create(
                    username=username,
                    defaults={
                        'email': email,
                        'is_company_admin': user_data.get('isAdmin', False),
                        'company_name': user_data.get('companyName', '') if user_data.get('isAdmin', False) else ''
                    }
                )
                
                if created:
                    # Set password for new users
                    user.set_password(user_data.get('password', 'changeme123'))
                    user.save()
                    created_count += 1
                else:
                    updated_count += 1
                
                # Update profile
                profile = user.profile
                
                # Update profile fields
                profile.full_name = user_data.get('fullName', '')
                profile.phone_number = user_data.get('phoneNumber', '')
                profile.location = user_data.get('location', '')
                
                # Convert date of birth if present
                dob_str = user_data.get('dateOfBirth')
                if dob_str:
                    try:
                        profile.date_of_birth = datetime.strptime(dob_str, '%Y-%m-%d').date()
                    except (ValueError, TypeError):
                        self.stdout.write(self.style.WARNING(f'Invalid date format for {username}: {dob_str}'))
                
                profile.title = user_data.get('title', '')
                profile.occupation = user_data.get('occupation', '')
                profile.linkedin = user_data.get('linkedin', '')
                profile.language = user_data.get('language', '')
                profile.skills = user_data.get('skills', [])
                profile.profile_picture = user_data.get('profilePicture', '')
                
                profile.save()
                
                self.stdout.write(
                    self.style.SUCCESS(f'{"Created" if created else "Updated"} user: {username}')
                )
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully imported users: {created_count} created, {updated_count} updated')
            )
            
        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR('Invalid JSON file'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error importing users: {str(e)}')) 
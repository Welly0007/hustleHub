from datetime import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Update Ryan user with specific profile data'

    def handle(self, *args, **options):
        try:
            # Try to get ryan user or create if doesn't exist
            user, created = User.objects.get_or_create(
                username='ryan',
                defaults={
                    'email': 'ryan@example.com',
                    'is_company_admin': False
                }
            )
            
            if created:
                user.set_password('hashed_password_here')
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Created user: {user.username}"))
            else:
                self.stdout.write(self.style.SUCCESS(f"Found existing user: {user.username}"))
            
            # Update specific fields from the image data
            user.phone_number = "+1234567890"
            user.location = "New York, USA"
            user.date_of_birth = datetime.strptime("1990-01-01", '%Y-%m-%d').date()
            user.title = "User"
            user.occupation = "Front-End Developer"
            user.linkedin = "https://linkedin.com/in/ryan"
            user.languages = "English"
            user.skills = ["JavaScript", "Python", "React"]
            user.profile_image_url = "https://example.com/images/ryan-avatar.png"
            
            # Set first and last name
            name_parts = "John Doe".split(" ", 1)
            user.first_name = name_parts[0]
            user.last_name = name_parts[1] if len(name_parts) > 1 else ""
            
            user.save()
            
            self.stdout.write(
                self.style.SUCCESS(f"Successfully updated user profile for {user.username}")
            )
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error updating user: {str(e)}")) 
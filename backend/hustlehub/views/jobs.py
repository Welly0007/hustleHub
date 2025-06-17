from django.shortcuts import render, get_object_or_404
from ..models import Jobs, JobApplication
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .accounts import get_user_data


def jobs(request):
    jobs = Jobs.objects.all()
    jobs_json = json.dumps([job.as_json() for job in jobs])
    user_data = get_user_data(request)
    # print(jobs)
    # for job in jobs:
    #     print(job.description)

    return render(request, "pages/jobs.html", {"jobs_json": jobs_json, "user_data": json.dumps(user_data)})


def job_details(request):
    job_id = request.GET.get("job_id")
    job = Jobs.objects.filter(id=job_id).first()
    description_lines = job.description.split("\n")
    user_data = get_user_data(request)

    return render(
        request,
        "pages/job_details.html",
        {
            "job": job,
            "description_lines": description_lines,
            "user_data": json.dumps(user_data),
        },
    )


def job_detail_api(request, job_id):
    if request.method == "GET":
        job = get_object_or_404(Jobs, pk=job_id)
        return JsonResponse({
            'id': job.pk,
            'title': job.title,
            'company': job.added_by.company_name if job.added_by.company_name else '',
            'salary': str(job.salary),
            'status': 'Open' if job.status else 'Closed',
            'experience': job.experience,
            'created_by': job.added_by.username,
            'job_type': job.job_type.job_type if job.job_type else '',
            'workplace': job.workplace.workplace if job.workplace else '',
            'career_level': job.career_level.level if job.career_level else '',            'category': job.category.category if job.category else '',
            'description': job.description,
            'logo': job.logo.url if job.logo else None,
            'country': [country.country for country in job.countries.all()],
            'countries': [country.country for country in job.countries.all()],
            'tags': [tag.tag for tag in job.job_tags.all()]
        })


@csrf_exempt
def edit_job_api(request, job_id):
    if request.method == "POST":
        try:
            from ..models import (
                Categories,
                JobType,
                Workplace,
                Career_level,
                Countries,
                Tags,
            )

            # Use request.POST for text data, request.FILES for files
            if request.content_type.startswith("multipart/form-data"):
                data = request.POST
                files = request.FILES
            else:
                data = json.loads(request.body)
                files = None

            job = get_object_or_404(Jobs, pk=job_id)
            job.title = data.get("title", job.title)
            job.salary = data.get("salary", job.salary)
            job.status = data.get("status", job.status) == "Open"
            job.experience = data.get("experience", job.experience)
            job.description = data.get("description", job.description)
            
            if files and "logo" in files:
                job.logo = files["logo"]
            
            if "category" in data:
                category, created = Categories.objects.get_or_create(category=data["category"])
                job.category = category
            if "job_type" in data:
                job_type, created = JobType.objects.get_or_create(job_type=data["job_type"])
                job.job_type = job_type
            if "workplace" in data:
                workplace, created = Workplace.objects.get_or_create(workplace=data["workplace"])
                job.workplace = workplace
            if "career_level" in data:
                career_level, created = Career_level.objects.get_or_create(level=data["career_level"])
                job.career_level = career_level
            if "country" in data:
                import json as pyjson

                countries = (
                    pyjson.loads(data["country"])
                    if isinstance(data["country"], str)
                    else data["country"]
                )
                job.countries.set(Countries.objects.filter(country__in=countries))
            if "tags" in data:
                import json as pyjson

                tags = (
                    pyjson.loads(data["tags"])
                    if isinstance(data["tags"], str)
                    else data["tags"]
                )
                job.job_tags.all().delete()
                for tag in tags:
                    Tags.objects.create(job=job, tag=tag)
            job.save()
            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid method"}, status=405)


def check_application_status(request):
    if not request.user.is_authenticated:
        return JsonResponse({'has_applied': False})
    
    job_id = request.GET.get('job_id')
    if not job_id:
        return JsonResponse({'error': 'Job ID is required'}, status=400)
    
    has_applied = JobApplication.objects.filter(
        job_id=job_id,
        applicant=request.user
    ).exists()
    
    return JsonResponse({'has_applied': has_applied})

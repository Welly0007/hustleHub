from django.shortcuts import render, get_object_or_404
from ..models import Jobs
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def jobs(request):
    jobs = Jobs.objects.all()
    jobs_json = json.dumps([job.as_json() for job in jobs])
    # print(jobs)
    for job in jobs:
        print(job.description)

    return render(request, "pages/jobs.html", {"jobs_json": jobs_json})


def job_details(request):
    job_id = request.GET.get("job_id")
    job = Jobs.objects.filter(id=job_id).first()
    description_lines = job.description.split("\n")

    return render(
        request,
        "pages/job_details.html",
        {
            "job": job,
            "description_lines": description_lines,
        },
    )


def job_detail_api(request, job_id):
    if request.method == "GET":
        job = get_object_or_404(Jobs, pk=job_id)
        return JsonResponse(job.as_json())


@csrf_exempt
def edit_job_api(request, job_id):
    if request.method == "POST":
        from ..models import (
            Categories,
            JobType,
            Workplace,
            Career_level,
            Countries,
            Tags,
        )

        data = json.loads(request.body)
        job = get_object_or_404(Jobs, pk=job_id)
        job.title = data.get("title", job.title)
        job.salary = data.get("salary", job.salary)
        job.status = data.get("status", job.status) == "Open"
        job.experience = data.get("experience", job.experience)
        job.description = data.get("description", job.description)
        if "category" in data:
            job.category = Categories.objects.get(category=data["category"])
        if "job_type" in data:
            job.job_type = JobType.objects.get(job_type=data["job_type"])
        if "workplace" in data:
            job.workplace = Workplace.objects.get(workplace=data["workplace"])
        if "career_level" in data:
            job.career_level = Career_level.objects.get(level=data["career_level"])
        if "country" in data:
            job.countries.set(Countries.objects.filter(country__in=data["country"]))
        if "tags" in data:
            job.job_tags.all().delete()
            for tag in data["tags"]:
                Tags.objects.create(job=job, tag=tag)
        job.save()
        return JsonResponse({"success": True})
    return JsonResponse({"error": "Invalid method"}, status=405)

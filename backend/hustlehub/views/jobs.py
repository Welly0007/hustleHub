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
        data = json.loads(request.body)
        job = get_object_or_404(Jobs, pk=job_id)
        job.title = data.get("title", job.title)
        job.salary = data.get("salary", job.salary)
        job.status = data.get("status", job.status) == "Open"
        job.experience = data.get("experience", job.experience)
        job.description = data.get("description", job.description)
        # Update related fields (category, job_type, workplace, career_level, countries, tags) as needed
        job.save()
        return JsonResponse({"success": True})
    return JsonResponse({"error": "Invalid method"}, status=405)

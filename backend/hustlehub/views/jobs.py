from django.shortcuts import render
from ..models import Jobs
import json 

def jobs(request):
    jobs = Jobs.objects.all()
    jobs_json = json.dumps([job.as_json() for job in jobs])
    # print(jobs)
    # for job in jobs:
    #     print(job.description)

    return render(request, 'pages/jobs.html', {
        "jobs_json": jobs_json
    })

def job_details(request):
    job_id = request.GET.get('job_id')
    job = Jobs.objects.filter(id=job_id).first()
    description_lines = job.description.split('\n')

    return render(request, 'pages/job_details.html', {
        "job": job, 
        'description_lines': description_lines,
    })
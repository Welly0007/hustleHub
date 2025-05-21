from django.shortcuts import render, get_object_or_404
from ..models import Jobs, Countries, JobType, Workplace, Career_level

# View to render the edit job page with all dynamic fields


def edit_job(request, job_id):
    job = get_object_or_404(Jobs, pk=job_id)
    countries = Countries.objects.all()
    job_types = JobType.objects.all()
    workplaces = Workplace.objects.all()
    experience_levels = Career_level.objects.all()
    job_status = ["Open", "Closed"]

    return render(
        request,
        "pages/edit_job.html",
        {
            "job": job,
            "countries": countries,
            "job_types": job_types,
            "workplaces": workplaces,
            "experience_levels": experience_levels,
            "job_status": job_status,
        },
    )

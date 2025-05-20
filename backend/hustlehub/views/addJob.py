from django.shortcuts import render
from ..models import Jobs, CustomUser

def addJob(request):
    return render(request, 'pages/add_job.html')
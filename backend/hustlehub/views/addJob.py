from django.shortcuts import render, redirect
from ..models import Jobs, CustomUser, Countries, Categories, Workplace, Career_level, Tags, JobType
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def addJob(request):
    errors = {}
    if (request.method == 'GET'):
        countriesQuery = Countries.objects.all()
        countries = []
        for query in countriesQuery:
            countries.append(query.country)
        
        jobTypes = []
        jobTypesQuery = JobType.objects.all()
        for query in jobTypesQuery:
            jobTypes.append(query.job_type)

        workplace = []
        workplaceQuery = Workplace.objects.all()
        for query in workplaceQuery:
            workplace.append(query.workplace)

        career_level = []
        career_levelQuery = Career_level.objects.all()
        for query in career_levelQuery:
            career_level.append(query.level)
        
        return render(request, 'pages/add_job.html', {
            'countries': countries,
            'jobTypes': jobTypes,
            'workplace': workplace,
            'career_level': career_level,
            'errors': errors
        })
    
    # Request was submitted via post
    
    print(request.POST)
    print(request.POST.get('type'))
    title = request.POST.get('title', '').strip().capitalize()
    is_valid = True
    if not title:
        is_valid = False
        errors['title'] = "Title is required"
    country = request.POST.getlist('country')

    job_type_name = request.POST.get('type')
    job_type_obj = JobType.objects.filter(job_type=job_type_name).first()
    if not job_type_obj:
        is_valid = False
        errors['type'] = "Job type is required"

    workplace_name = request.POST.get('workplace')
    workplace_obj = Workplace.objects.filter(workplace=workplace_name).first()
    if not workplace_name:
        is_valid = False
        errors['workplace'] = "Work mode is required"

    level_name = request.POST.get('level')
    level_obj = Career_level.objects.filter(level=level_name).first()
    if not level_obj:
        is_valid = False
        errors['level'] = "Experience level is required"
    try:
        exp = int(request.POST.get('experience'))
    except (ValueError, TypeError):
        is_valid = False
        errors['experience'] = "Minimum years of experience is required (integers only)"

    try:
        salary = float(request.POST.get('salary'))
    except (ValueError, TypeError):
        is_valid = False
        errors['salary'] = "Salary is required (numeric only)"

    category = request.POST.get('category').strip().capitalize()
    if not category:
        is_valid = False
        errors['category'] = "Job category is required"
    category_obj, created = Categories.objects.get_or_create(category=category)

    temp = request.POST.get('tags')
    tags = [tag.strip() for tag in temp.split(',')]

    description = request.POST.get('description').strip().capitalize()
    if not description:
        is_valid = False
        errors['description'] = "Job description is required"

    if not is_valid:
        return render(request, 'pages/add_job.html', {
            'countries': countries,
            'jobTypes': jobTypes,
            'workplace': workplace,
            'career_level': career_level,
            'errors': errors
        })
    
    # Preparing data to save
    # job_type = JobType.objects.get(job_type=job_type)
    # location = Workplace.objects.get(workplace=location)
    # level = Career_level.objects.get(level=level)
    countries_pk = []
    for c in country:
        temp = Countries.objects.filter(country=c).first()
        countries_pk.append(temp)
    # Saving the job to the database
    try:
        img = request.FILES.get('img')
        newJob = Jobs.objects.create(
            title=title,
            added_by=request.user,
            salary= salary,
            job_type=job_type_obj,
            experience=exp,
            workplace=workplace_obj,
            category=category_obj,
            logo=img,
            career_level=level_obj,
            description=description
        )
        newJob.save()
        newJob.countries.set(countries_pk)
        if tags:
            for tag in tags:
                Tags.objects.create(
                    job=newJob,
                    tag=tag
                )
        job_id = newJob.pk
        newJob.description = f"pages/job_details.html?job_id={job_id}"
        newJob.save()
        return redirect('jobs')



    except Exception as e:
        print(e)
        errors['save'] = "Error saving the job"
        return render(request, 'pages/add_job.html', {
        'countries': countries,
        'jobTypes': jobTypes,
        'workplace': workplace,
        'career_level': career_level,
        'errors': errors
    })

    
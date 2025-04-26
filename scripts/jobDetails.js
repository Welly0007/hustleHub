document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('job_id');

    if (!jobId) {
        console.error("Job ID is missing in the URL");
        return;
    }

    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    const job = jobs.find(job => job.id === parseInt(jobId));

    if (!job) {
        console.error("Job not found!");
        return;
    }

    document.getElementById("jobTitle").textContent = job.title;
    document.getElementById("jobLogo").src = job.logo || "assets/default-logo.png";
    document.getElementById("jobCompany").textContent = job.company;
    document.getElementById("jobPosted").textContent = job.posted;
    document.getElementById("jobType").textContent = job.job_type;
    document.getElementById("jobWorkplace").textContent = job.workplace;
    document.getElementById("jobCareerLevel").textContent = job.career_level;
    document.getElementById("jobExperience").textContent = job.experience;
    document.getElementById("jobSalary").textContent = job.salary;
    document.getElementById("jobStatus").textContent = job.status;
    document.getElementById("jobCreatedBy").textContent = job.created_by;
    document.getElementById("jobDescription").textContent = job.description;

    const jobTags = document.getElementById("jobTags");
    jobTags.innerHTML = "<strong>Tags:</strong>";


    job.tags.forEach(tag => {
        const tagElement = document.createElement("span");
        tagElement.textContent = tag;
        jobTags.appendChild(tagElement);
    });
});

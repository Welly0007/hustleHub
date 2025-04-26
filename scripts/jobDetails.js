document.addEventListener("DOMContentLoaded", function () {
    const url = new URLSearchParams(window.location.search);
    const jobId = url.get('job_id');

    const editBtn = document.querySelector('a[href^="pages/edit_job.html"]');
    const applyBtn = document.querySelector('a[href^="pages/apply.html"]'); // Add reference to the Apply button

    if (editBtn && jobId) {
        editBtn.href = `pages/edit_job.html?job_id=${jobId}`;
    }

    if (applyBtn && jobId) {
        applyBtn.href = `pages/apply.html?job_id=${jobId}`; // Add job_id to the Apply button URL
    }

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
    const jobLogo = document.getElementById("jobLogo");
    jobLogo.src = (job.logo && job.logo !== "null") ? job.logo : "assets/img_missing.jpg"; // Fallback to missing image
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

    const tags = document.getElementById("jobTags");
    tags.innerHTML = "<strong>Tags:</strong>";

    job.tags.forEach(tag => {
        const tagElement = document.createElement("span");
        tagElement.textContent = tag;
        tags.appendChild(tagElement);
    });
});

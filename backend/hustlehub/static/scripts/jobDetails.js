document.addEventListener("DOMContentLoaded", function () {
    const url = new URLSearchParams(window.location.search);
    const jobId = url.get('job_id');

    if (!jobId) {
        console.error("Job ID is missing in the URL");
        return;
    }

    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const job = jobs.find(job => job.id === parseInt(jobId));
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    const isAdmin = loggedInUser.isAdmin || false;

    if (!job) {
        console.error("Job not found!");
        return;
    }

    // Set job details (your existing code)
    document.getElementById("jobTitle").textContent = job.title;
    const jobLogo = document.getElementById("jobLogo");
    jobLogo.src = (job.logo && job.logo !== "null") ? job.logo : "assets/img_missing.jpg";
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

    const applyBtn = document.querySelector('a[href^="pages/apply.html"]');
    const editBtn = document.querySelector('a[href^="pages/edit_job.html"]');

    if (applyBtn) applyBtn.href = `pages/apply.html?job_id=${jobId}`;
    if (editBtn) editBtn.href = `pages/edit_job.html?job_id=${jobId}`;

    if (applyBtn) applyBtn.style.display = 'none';
    if (editBtn) editBtn.style.display = 'none';

    if (!isAdmin && applyBtn) {
        applyBtn.style.display = 'inline-block';
    }
    else if (isAdmin && editBtn) {
        if (job.created_by === loggedInUser.username) {
            editBtn.style.display = 'inline-block';
        }

    }

    const applyNowBtn = document.getElementById("applyNowBtn");
    applyNowBtn.addEventListener("click", function (e) {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!loggedInUser) {
            e.preventDefault(); // Prevent navigation to the apply page
            alert("You need to sign in to apply for this job.");
            window.location.href = "../pages/login.html"; // Redirect to sign-in page
        } else if (loggedInUser.appliedJobs && loggedInUser.appliedJobs.includes(parseInt(jobId))) {
            e.preventDefault();
            alert("You have already applied for this job.");
        }
    });
});
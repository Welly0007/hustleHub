document.addEventListener("DOMContentLoaded", function () {
    const url = new URLSearchParams(window.location.search);
    const jobId = url.get('job_id');

    if (!jobId) {
        console.error("Job ID is missing in the URL");
        return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    const isAdmin = loggedInUser.isAdmin || false;

    const applyBtn = document.querySelector('a[href^="pages/apply.html"]');
    const editBtn = document.querySelector('a[href^="pages/edit_job.html"]');

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
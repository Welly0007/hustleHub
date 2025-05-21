document.addEventListener("DOMContentLoaded", function () {
    const url = new URLSearchParams(window.location.search);
    const jobId = url.get('job_id');

    if (!jobId) {
        console.error("Job ID is missing in the URL");
        return;
    }

    // Get logged-in user from preloaded data (like profileScript.js)
    let loggedInUser = {};
    const preload = document.getElementById("preload");
    if (preload && preload.textContent.trim()) {
        try {
            loggedInUser = JSON.parse(preload.textContent);
        } catch (err) {
            loggedInUser = {};
        }
    }
    const isAdmin = loggedInUser.is_company_admin || false;

    const applyBtn = document.querySelector('a[href^="pages/apply.html"]');
    const editBtn = document.querySelector('a[href^="pages/edit_job.html"]');

    if (applyBtn) applyBtn.style.display = 'none';
    if (editBtn) editBtn.style.display = 'none';

    if (!isAdmin && applyBtn) {
        applyBtn.style.display = 'inline-block';
    }
    else if (isAdmin && editBtn) {
        if (typeof job !== "undefined" && job.created_by === loggedInUser.username) {
            editBtn.style.display = 'inline-block';
        }
    }

    const applyNowBtn = document.getElementById("applyNowBtn");
    if (applyNowBtn) {
        applyNowBtn.addEventListener("click", function (e) {
            if (!loggedInUser || !loggedInUser.username) {
                e.preventDefault(); // Prevent navigation to the apply page
                alert("You need to sign in to apply for this job.");
                window.location.href = "../pages/login.html"; // Redirect to sign-in page
            } else if (loggedInUser.appliedJobs && loggedInUser.appliedJobs.includes(parseInt(jobId))) {
                e.preventDefault();
                alert("You have already applied for this job.");
            }
        });
    }
});
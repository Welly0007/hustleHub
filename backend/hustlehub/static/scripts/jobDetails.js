document.addEventListener("DOMContentLoaded", async function () {
    const url = new URLSearchParams(window.location.search);
    const jobId = url.get('job_id');

    if (!jobId) {
        console.error("Job ID is missing in the URL");
        return;
    }

    // Fetch logged-in user from preloaded JSON
    let loggedInUser = {};
    try {
        const preload = document.getElementById('preload');
        if (preload && preload.textContent.trim()) {
            loggedInUser = JSON.parse(preload.textContent || '{}');
            console.log("User data retrieved from preload:", loggedInUser);
        } else {
            console.warn("Preload element is empty or missing");
        }
    } catch (err) {
        console.error("Failed to parse user data from preload", err);
    }

    // Select buttons
    const applyBtn = document.getElementById("applyNowBtn");

    // Ensure the apply button is always visible
    if (applyBtn) {
        applyBtn.style.display = 'inline-block';

        // Add click handler for apply button
        applyBtn.addEventListener("click", function (e) {
            if (loggedInUser.appliedJobs && loggedInUser.appliedJobs.includes(parseInt(jobId))) {
                e.preventDefault();
                alert("You have already applied for this job.");
            }
        });
    }
});
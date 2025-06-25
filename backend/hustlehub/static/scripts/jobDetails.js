document.addEventListener("DOMContentLoaded", function () {
    const url = new URLSearchParams(window.location.search);
    const jobId = url.get('job_id');
    const userDataElement = document.getElementById("user-data");
    let user = {};

    try {
        const userDataText = userDataElement?.textContent || '{}';
        user = JSON.parse(userDataText);
    } catch (err) {
        console.error("Failed to parse user data:", err);
    }

    const isAdmin = user.is_company_admin || false;
    const userCompany = user.company_name || "";
    const appliedJobs = user.appliedJobs || [];

    const applyBtn = document.getElementById("applyNowBtn");
    const editBtn = document.querySelector('a[href^="/pages/edit_job.html"]');
    const jobCompanyName = document.getElementById("jobCompany")?.textContent?.trim();

    // === Apply Button Logic ===
    if (applyBtn) {
        applyBtn.addEventListener("click", function (e) {
            if (isAdmin) {
                e.preventDefault();
                alert("Admins cannot apply for jobs.");
            } else if (appliedJobs.includes(parseInt(jobId))) {
                e.preventDefault();
                alert("You have already applied for this job.");
            }
        });
    }

    // === Edit Button Logic ===
    if (editBtn) {
        editBtn.addEventListener("click", function (e) {
            if (!isAdmin) {
                e.preventDefault();
                alert("Only company admins can edit jobs.");
            } else if (!jobCompanyName || userCompany !== jobCompanyName) {
                e.preventDefault();
                alert("You can only edit jobs from your own company.");
            }
        });
    }
});

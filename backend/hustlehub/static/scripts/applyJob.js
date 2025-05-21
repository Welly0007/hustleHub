document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get("job_id");

    if (!jobId) {
        alert("Job ID is missing. Redirecting to jobs page.");
        window.location.href = "/pages/jobs.html";
        return;
    }

    // Fetch job details from the backend
    try {
        const response = await fetch(`/api/jobs/${jobId}/`);
        if (response.ok) {
            const job = await response.json();
            document.getElementById("jobPosition").textContent = job.title || "Unknown Job Title";
            document.getElementById("jobCompany").textContent = job.company || "Unknown Company";
        } else {
            console.error("Failed to fetch job details. Response status:", response.status);
            alert("Failed to load job details. Please try again later.");
        }
    } catch (error) {
        console.error("Error fetching job details:", error);
        alert("An error occurred while loading job details. Please try again later.");
    }

    // Handle file upload display
    const resumeUpload = document.getElementById("resumeUpload");
    const fileNameDisplay = document.getElementById("file-name");

    resumeUpload.addEventListener("change", function () {
        const fileName = resumeUpload.files[0]?.name || "No file selected";
        fileNameDisplay.textContent = fileName;
    });

    // Handle form submission
    const applyForm = document.getElementById("applyForm");
    applyForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(applyForm);
        formData.append("job_id", jobId);

        try {
            const response = await fetch(`/api/apply/`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Application submitted successfully!");
                window.location.href = "/pages/submitted_successfully.html";
            } else {
                const errorData = await response.json();
                alert(`Failed to submit application: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("An error occurred while submitting your application.");
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const url = new URLSearchParams(window.location.search);
    const jobId = url.get('job_id');

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

    document.getElementById("jobPosition").textContent = `Position: ${job.title}`;
    document.getElementById("jobCompany").textContent = `At: ${job.company}`;
});

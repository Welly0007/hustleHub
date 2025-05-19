document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("jobForm");
    const imgInput = document.getElementById("jobImg");
    const imgN = document.getElementById("file-name");

    const params = new URLSearchParams(window.location.search);
    const jobId = parseInt(params.get("job_id"));
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const editedJob = jobs.find(job => job.id === jobId);

    if (!editedJob) {
        alert("Job not found.");
        window.location.href = "jobs.html";
        return;
    }


    document.getElementById("title").value = editedJob.title;
    document.getElementById("salary").value = editedJob.salary;
    document.getElementById("category").value = editedJob.category;
    document.getElementById("workplace").value = editedJob.workplace;
    document.getElementById("level").value = editedJob.career_level;
    document.getElementById("status").value = editedJob.status;
    document.getElementById("experience").value = editedJob.experience;
    document.getElementById("job_type").value = editedJob.job_type;
    document.getElementById("tags").value = editedJob.tags.join(", ");
    document.getElementById("description").value = editedJob.description;


    const countryCheckboxes = document.querySelectorAll('.country-container input[type="checkbox"]');
    countryCheckboxes.forEach(cb => {
        if (editedJob.country.includes(cb.value)) {
            cb.checked = true;
        }
    });

    // if logo exists set file name
    if (editedJob.logo && editedJob.logo !== "assets/img_missing.jpg") {
        imgN.textContent = "Existing image loaded";
    }

    imgInput.addEventListener("change", function () {
        imgN.textContent = imgInput.files[0]?.name || "No file selected";
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const salary = document.getElementById("salary").value;
        const category = document.getElementById("category").value;
        const title = document.getElementById("title").value;
        const workplace = document.getElementById("workplace").value;
        const career_level = document.getElementById("level").value;
        const status = document.getElementById("status").value;
        const description = document.getElementById("description").value;
        const experience = document.getElementById("experience").value;
        const tags = document.getElementById("tags").value.split(",").map(tag => tag.trim());
        const countries = Array.from(countryCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const job_type = document.getElementById("job_type").value;
        const file = imgInput.files[0];

        const updatedJobData = {
            ...editedJob,
            title,
            company: loggedInUser.companyName,
            country: countries,
            posted: editedJob.posted,
            salary,
            status,
            experience,
            created_by: loggedInUser.username,
            job_type,
            workplace,
            tags,
            category,
            career_level,
            description
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                updatedJobData.logo = reader.result;
                updateJobInLocalStorage(updatedJobData);
            };
            reader.readAsDataURL(file);
        } else {
            updateJobInLocalStorage(updatedJobData);
        }
    });

    function updateJobInLocalStorage(updatedJob) {
        const index = jobs.findIndex(job => job.id === jobId);
        if (index !== -1) {
            jobs[index] = {
                ...updatedJob,
                details_link: `pages/job_details.html?job_id=${jobId}`,
                logo: updatedJob.logo || editedJob.logo || "assets/img_missing.jpg"
            };
            localStorage.setItem("jobs", JSON.stringify(jobs));
        }
        window.location.href = "pages/jobs.html";
    }
});

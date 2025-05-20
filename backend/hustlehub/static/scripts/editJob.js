document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("jobForm");
    const imgInput = document.getElementById("jobImg");
    const imgN = document.getElementById("file-name");

    const params = new URLSearchParams(window.location.search);
    const jobId = parseInt(params.get("job_id"));

    // Fetch job data from API
    fetch(`/api/jobs/${jobId}/`)
        .then(res => res.json())
        .then(editedJob => {
            document.getElementById("title").value = editedJob.title;
            document.getElementById("salary").value = editedJob.salary;
            document.getElementById("category").value = editedJob.category;
            document.getElementById("workplace").value = editedJob.workplace;
            document.getElementById("level").value = editedJob.career_level;
            document.getElementById("status").value = editedJob.status ? "Open" : "Closed";
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

            if (editedJob.logo && editedJob.logo !== "assets/img_missing.jpg") {
                imgN.textContent = "Existing image loaded";
            }
        });

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
        const countries = Array.from(document.querySelectorAll('.country-container input[type="checkbox"]'))
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        const job_type = document.getElementById("job_type").value;

        const updatedJobData = {
            title,
            country: countries,
            salary,
            status,
            experience,
            job_type,
            workplace,
            tags,
            category,
            career_level,
            description
        };

        fetch(`/api/jobs/${jobId}/edit/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedJobData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = "/pages/jobs.html";
            } else {
                alert(data.error || "Failed to update job.");
            }
        });
    });
});

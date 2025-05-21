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

        const formData = new FormData(form);
        formData.set("career_level", document.getElementById("level").value);

        // Collect countries
        const countries = Array.from(document.querySelectorAll('.country-container input[type="checkbox"]'))
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        formData.set("country", JSON.stringify(countries));

        // Collect tags 
        const tags = document.getElementById("tags").value.split(",").map(tag => tag.trim());
        formData.set("tags", JSON.stringify(tags));

        fetch(`/api/jobs/${jobId}/edit/`, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "/pages/jobs.html";
                } else {
                    alert(data.error || "Failed to update job.");
                }
            })
            .catch(err => {
                alert("An error occurred: " + err);
            });
    });
});

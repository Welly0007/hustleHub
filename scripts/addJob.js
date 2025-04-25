document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("jobForm");
    const imgInput = document.getElementById("jobImg");
    const imgName = document.getElementById("file-name");

    // Update img name
    imgInput.addEventListener("change", function () {
        imgName.textContent = imgInput.files[0]?.name || "No file selected";
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // get values from the form
        const salary = document.getElementById("salary").value;
        const category = document.getElementById("category").value;
        const title = document.getElementById("title").value;
        const country = document.getElementById("country").value;
        const workplace = document.getElementById("workplace").value;
        const career_level = document.getElementById("level").value;
        const experience = document.getElementById("experience").value;
        const tags = document.getElementById("tags").value.split(",").map(tag => tag.trim());
        //const description = document.getElementById("description").value;
        const job_type = document.getElementById("job_type").value;
        const file = imgInput.files[0];
        const currentDate = new Date();
        const egyptianTime = new Date(currentDate.getTime() + (3 * 60 * 60 * 1000));

        const jobData = {
            title,
            company: "HustleHub",
            country,
            posted: egyptianTime.toISOString(),
            salary,
            status: "Open",
            experience,
            created_by: "user",
            job_type,
            workplace,
            tags,
            category,
            career_level,
            logo: null // will be updated if image exists
        };
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                jobData.logo = reader.result;
                saveJobToLocalStorage(jobData);
                window.location.href = "pages/jobs.html";
            };
            reader.readAsDataURL(file);
        } else {
            saveJobToLocalStorage(jobData);
            window.location.href = "pages/jobs.html";
        }
    });

    function saveJobToLocalStorage(jobData) {
        let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
        const newId = Date.now();

        const job = {
            id: newId,
            ...jobData,
            logo: jobData.logo || "assets/default-logo.png",
            details_link: `pages/job_details${newId}.html`
        };

        jobs.push(job);
        localStorage.setItem("jobs", JSON.stringify(jobs));
    }
});

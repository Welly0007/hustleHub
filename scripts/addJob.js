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
        const title = document.getElementById("title").value;
        const location = document.getElementById("location").value;
        const mode = document.getElementById("mode").value;
        const level = document.getElementById("level").value;
        const experience = document.getElementById("experience").value;
        const tags = document.getElementById("tags").value.split(",").map(tag => tag.trim());
        const description = document.getElementById("description").value;
        const typeCheckboxes = document.querySelectorAll(".checkbox-group input[type='checkbox']:checked");
        const jobTypes = Array.from(typeCheckboxes).map(checkBox => checkBox.value);
        const file = imgInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                const imageData = reader.result;

                // Convert the current date to Egyptian time (UTC+2)
                const currentDate = new Date();
                const egyptianTime = new Date(currentDate.getTime() + (3 * 60 * 60 * 1000));

                saveJobToLocalStorage({
                    title,
                    location,
                    mode,
                    level,
                    experience,
                    tags,
                    description,
                    jobTypes,
                    image: imageData,
                    dateAdded: egyptianTime.toISOString()
                });

                window.location.href = "pages/jobs.html";
            };
            reader.readAsDataURL(file);
        } else {
            const currentDate = new Date();
            const egyptianTime = new Date(currentDate.getTime() + (3 * 60 * 60 * 1000));
            saveJobToLocalStorage({
                title,
                location,
                mode,
                level,
                experience,
                tags,
                description,
                jobTypes,
                image: null,
                dateAdded: egyptianTime.toISOString()
            });

            window.location.href = "pages/jobs.html";
        }
    });

    function saveJobToLocalStorage(job) {
        let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
        jobs.push(job);
        localStorage.setItem("jobs", JSON.stringify(jobs));
    }
});

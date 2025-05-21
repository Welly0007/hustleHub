document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("jobForm");
    const imgInput = document.getElementById("jobImg");
    const imgName = document.getElementById("file-name");

    // Update img name
    imgInput.addEventListener("change", function () {
        imgName.textContent = imgInput.files[0]?.name || "No file selected";
    });

    form.addEventListener("submit", function (e) {
        // e.preventDefault();

        // get values from the form
        const salary = document.getElementById("salary").value;
        const category = document.getElementById("category").value;
        const title = document.getElementById("title").value;
        const workplace = document.getElementById("workplace").value;
        const career_level = document.getElementById("level").value;
        const description = document.getElementById("description").value;
        const experience = document.getElementById("experience").value;
        const tags = document.getElementById("tags").value.split(",").map(tag => tag.trim());
        const countryCheckboxes = document.querySelectorAll('.country-container input[type="checkbox"]');
        const selectedCountries = Array.from(countryCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const job_type = document.getElementById("job_type").value;
        const file = imgInput.files[0];
        //const egyptianTime = new Date().toLocaleString("en-GB", { timeZone: "Africa/Cairo" });

        const jobData = {
            title,
            company: loggedInUser.companyName,
            country: selectedCountries,
            posted: new Date().toLocaleString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "Africa/Cairo",
            }),
            salary,
            status: "Open",
            experience,
            created_by: "user",
            job_type,
            workplace,
            created_by: loggedInUser.username,
            tags,
            category,
            career_level,
            logo: null, // will be updated if image exists
            description,
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
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const newId = Date.now();
    
        const job = {
            id: newId,
            ...jobData,
            logo: jobData.logo || "assets/default-logo.png",
            details_link: `pages/job_details.html?job_id=${newId}`,
            created_by: loggedInUser.username 
        };
    
        jobs.push(job);
        
       
        if (loggedInUser) {
            loggedInUser.addedJobs = loggedInUser.addedJobs || [];
            loggedInUser.addedJobs.push(newId);
            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
            
           
            users = users.map(user => 
                user.email === loggedInUser.email 
                    ? { ...user, addedJobs: [...(user.addedJobs || []), newId] }
                    : user
            );
            localStorage.setItem("users", JSON.stringify(users));
        }
    
        localStorage.setItem("jobs", JSON.stringify(jobs));
    }
});

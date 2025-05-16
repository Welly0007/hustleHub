document.addEventListener("DOMContentLoaded", function () {
    const url = new URLSearchParams(window.location.search);
    const jobId = url.get('job_id');
    const applyForm = document.querySelector(".apply-form");

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

    const fileInput = document.getElementById("resumeUpload"); // Updated id
    const fileName = document.getElementById("file-name");
    
    fileInput.addEventListener("change", function() {
        fileName.textContent = fileInput.files[0]?.name || "No file selected";
    });

    applyForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const allUsers = JSON.parse(localStorage.getItem("users")) || [];
        
        if (loggedInUser) {
            loggedInUser.appliedJobs = loggedInUser.appliedJobs || [];
            
            // Check if already applied to prevent duplicates
            if (!loggedInUser.appliedJobs.includes(parseInt(jobId))) {
                loggedInUser.appliedJobs.push(parseInt(jobId));
                
                // Update in allUsers array
                const updatedUsers = allUsers.map(user => 
                    user.email === loggedInUser.email 
                        ? { ...user, appliedJobs: [...(user.appliedJobs || []), parseInt(jobId)] }
                        : user
                );
                
                localStorage.setItem("users", JSON.stringify(updatedUsers));
                localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
            }
        }
        
        // Here you would typically also save the application details
        // For now, we'll just redirect back to profile
        window.location.href = "../pages/profile.html";
    });

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        // Pre-fill form fields with user data
        const nameInput = document.querySelector("input[name='name']");
        const emailInput = document.querySelector("input[name='email']");
        const phoneInput = document.querySelector("input[name='phone']");

        nameInput.value = loggedInUser.fullName || "";
        emailInput.value = loggedInUser.email || "";
        phoneInput.value = loggedInUser.phoneNumber || "";
    }
});
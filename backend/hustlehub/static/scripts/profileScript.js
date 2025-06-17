document.addEventListener("DOMContentLoaded", () => {
    const avatarPreview = document.getElementById("avatarPreview");
    const avatarInput = document.querySelector(".profile-avatar-input");
    const form = document.querySelector("form");
    const deleteBtn = document.querySelector(".delete-account-btn");    const profileName = document.querySelector(".profile-info h1");
    const profileEmailRole = document.querySelector(".profile-info p");
      // Load preloaded user data
    function loadUserProfile() {
        console.log("loadUserProfile function called");
        console.log("DOM elements at time of call:");
        console.log("- user-data element:", document.getElementById("user-data"));
        console.log("- All script elements:", document.querySelectorAll("script"));
        
        try {
            const userDataElement = document.getElementById("user-data");
            if (!userDataElement) {
                console.error("User data element not found");
                console.log("Available elements with IDs:", Array.from(document.querySelectorAll('[id]')).map(el => el.id));
                return;
            }
            
            const userDataText = userDataElement.textContent;
            if (!userDataText || userDataText.trim() === '') {
                console.error("User data is empty");
                return;
            }
            
            console.log("Raw user data:", userDataText);
            const user = JSON.parse(userDataText);
            console.log("Parsed user data:", user);

            // Populate form fields
            form.querySelector('input[name="username"]').value = user.username || "";
            form.querySelector('input[name="email"]').value = user.email || "";
            form.querySelector('input[name="phoneNumber"]').value = user.phone_number || "";
            form.querySelector('input[name="password"]').value = ""; // Leave password blank
            form.querySelector('input[name="fullName"]').value = user.full_name || "";
            form.querySelector('input[name="dateOfBirth"]').value = user.date_of_birth || "";
            form.querySelector('input[name="location"]').value = user.location || "";
            form.querySelector('input[name="title"]').value = user.title || "";            if (user.is_company_admin) {
                form.querySelector('input[name="companyName"]').value = user.company_name || "";
            } else {
                form.querySelector('input[name="occupation"]').value = user.occupation || "";
            }
            form.querySelector('select[name="language"]').value = user.language || "English";
            form.querySelector('input[name="linkedin"]').value = user.linkedin || "";
            
            // Update avatar and profile info
            avatarPreview.src = user.avatar || "/static/assets/anon5.webp";
            profileName.textContent = user.full_name || "User";
            profileEmailRole.innerHTML = `${user.email} - <span>${user.is_company_admin ? "Administrator" : "User"}</span>`;        } catch (error) {
            console.error("Error loading profile data:", error);
            console.error("Error details:", error.message);
            alert("Failed to load profile data. Check console for details.");
        }
    }

    // Avatar upload
    avatarInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                avatarPreview.src = event.target.result; // Update avatar preview
            };
            reader.readAsDataURL(file);
        }
    });

    // Save profile changes
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        form.submit(); // Submit the form to the server
    });

    // Delete account
    deleteBtn.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete your account?")) {
            const form = document.createElement("form");
            form.method = "POST";
            form.action = "/profile/delete/";
            const csrfInput = document.createElement("input");
            csrfInput.type = "hidden";
            csrfInput.name = "csrfmiddlewaretoken";
            csrfInput.value = document.querySelector('[name=csrfmiddlewaretoken]').value;
            form.appendChild(csrfInput);
            document.body.appendChild(form);
            form.submit();
        }
    });    async function loadAppliedJobs() {
        try {
            // Check if this is an admin profile - admins don't have applied jobs
            const userDataElement = document.getElementById("user-data");
            if (userDataElement) {
                const userData = JSON.parse(userDataElement.textContent);
                if (userData.is_company_admin) {
                    console.log("Admin profile - skipping applied jobs");
                    return;
                }
            }
            
            const response = await fetch('/api/user/applied_jobs/');
            if (response.ok) {
                const jobs = await response.json();
                const appliedJobsList = document.getElementById('appliedJobsList');
                if (appliedJobsList) {
                    appliedJobsList.innerHTML = '';
                    jobs.forEach(job => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${job.title} at ${job.company}`;
                        appliedJobsList.appendChild(listItem);
                    });
                } else {
                    console.log("No applied jobs list element found");
                }
            } else {
                console.error('Failed to fetch applied jobs:', response.status);
            }        } catch (error) {
            console.error('Error fetching applied jobs:', error);
        }
    }

    // Load profile data and applied jobs when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                loadUserProfile();
                loadAppliedJobs();
            }, 100);
        });
    } else {
        // DOM is already loaded
        setTimeout(() => {
            loadUserProfile();
            loadAppliedJobs();
        }, 100);
    }
});
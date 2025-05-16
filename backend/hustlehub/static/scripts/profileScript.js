document.addEventListener("DOMContentLoaded", () => {
    const avatarPreview = document.getElementById("avatarPreview");
    const avatarInput = document.querySelector(".profile-avatar-input");
    const form = document.querySelector("form");
    const deleteBtn = document.querySelector(".delete-account-btn");
  
    const profileName = document.querySelector(".profile-info h1");
    const profileEmailRole = document.querySelector(".profile-info p");
  
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    let allUsers = JSON.parse(localStorage.getItem("users")) || [];
    isAdmin = loggedInUser.isAdmin || false;
    // Form fields
    const fields = {
      username: form.querySelector('input[type="text"]'),
      email: form.querySelector('input[type="email"]'),
      phoneNumber: form.querySelector('input[type="tel"]'),
      password: form.querySelector('input[type="password"]'),
      fullName: form.querySelectorAll('input[type="text"]')[1],
      dateOfBirth: form.querySelector('input[type="date"]'),
      location: form.querySelectorAll('input[type="text"]')[2],
      title: form.querySelectorAll('input[type="text"]')[3],
      companyName: form.querySelectorAll('input[type="text"]')[4],
      occupation: form.querySelectorAll('input[type="text"]')[4],
      language: form.querySelector('select'),
      linkedin: form.querySelector('input[type="url"]'),
    };
  
    // Load user data
    if (loggedInUser) {
      fields.username.value = loggedInUser.username || "";
      fields.email.value = loggedInUser.email || "";
      fields.phoneNumber.value = loggedInUser.phoneNumber || "";
      fields.password.value = loggedInUser.password || "";
      fields.fullName.value = loggedInUser.fullName || "";
      fields.dateOfBirth.value = loggedInUser.dateOfBirth || "";
      fields.location.value = loggedInUser.location || "";
      fields.title.value = loggedInUser.title || "";
      fields.occupation.value = loggedInUser.occupation || "";
      fields.companyName.value = loggedInUser.companyName || "";
      fields.language.value = loggedInUser.language || "English";
      fields.linkedin.value = loggedInUser.linkedin || "";
      loggedInUser.addedJobs = loggedInUser.addedJobs || [];
      loggedInUser.appliedJobs = loggedInUser.appliedJobs || [];
  
      if (loggedInUser.avatar) {
        avatarPreview.src = loggedInUser.avatar;
      }
  
      // Update header
      profileName.textContent = loggedInUser.fullName || (isAdmin? "Admin" : "User");
      profileEmailRole.innerHTML = `${loggedInUser.email} - <span>${(isAdmin? "Admin" : "User")}</span>`;
    }
  
    // Avatar upload
    avatarInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const base64Image = event.target.result;
          avatarPreview.src = base64Image;
  
          loggedInUser.avatar = base64Image;
          allUsers = allUsers.map(user =>
            user.email === loggedInUser.email ? { ...user, avatar: base64Image } : user
          );
          localStorage.setItem("users", JSON.stringify(allUsers));
          localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Save profile changes
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const updatedUser = {
        ...loggedInUser,
        username: fields.username.value,
        email: fields.email.value,
        phoneNumber: fields.phoneNumber.value,
        password: fields.password.value,
        fullName: fields.fullName.value,
        dateOfBirth: fields.dateOfBirth.value,
        location: fields.location.value,
        title: fields.title.value,
        occupation: fields.occupation.value,
        companyName: fields.companyName.value,
        language: fields.language.value,
        linkedin: fields.linkedin.value,
        avatar: loggedInUser.avatar || "",
      };
  
      // Update local torage
      loggedInUser = updatedUser;
      allUsers = allUsers.map(user =>
        user.email === loggedInUser.email ? updatedUser : user
      );
      localStorage.setItem("users", JSON.stringify(allUsers));
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  
      // Update UI
      profileName.textContent = updatedUser.fullName;
      profileEmailRole.innerHTML = `${updatedUser.email} - <span>${isAdmin?"Adminstrator":"User"}</span>`;
  
      alert("Changes saved successfully!");
    });
  
    // Delete account
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete your account?")) {
        allUsers = allUsers.filter(user => user.email !== loggedInUser.email);
        localStorage.setItem("users", JSON.stringify(allUsers));
        localStorage.removeItem("loggedInUser");
        alert("account deleted.");
        window.location.href = "../index.html";
      }
    });
    if (loggedInUser && loggedInUser.addedJobs&&isAdmin) {
      const jobsList = document.querySelector(".profile-jobs ul");
      jobsList.innerHTML = ""; // Clear existing items
      
      const allJobs = JSON.parse(localStorage.getItem("jobs")) || [];
      const userJobs = allJobs.filter(job => 
          loggedInUser.addedJobs.includes(job.id)
      );

      if (userJobs.length > 0) {
          userJobs.forEach(job => {
              const li = document.createElement("li");
              li.textContent = `✅ ${job.title} at ${job.company}`;
              jobsList.appendChild(li);
          });
      } else {
          jobsList.innerHTML = "<li>No jobs added yet</li>";
      }
  }
  if (loggedInUser && loggedInUser.addedJobs&&!isAdmin) {
    const jobsList = document.querySelector(".profile-jobs ul");
    jobsList.innerHTML = ""; // Clear existing items
    
    const allJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const userJobs = allJobs.filter(job => 
        loggedInUser.appliedJobs.includes(job.id)
    );

    if (userJobs.length > 0) {
        userJobs.forEach(job => {
            const li = document.createElement("li");
            li.textContent = `✅ ${job.title} at ${job.company}`;
            jobsList.appendChild(li);
        });
    } else {
        jobsList.innerHTML = "<li>No jobs added yet</li>";
    }
}

  });
  
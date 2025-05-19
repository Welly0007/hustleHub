document.addEventListener("DOMContentLoaded", function() {
    // Get the logged in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    const isAdmin = loggedInUser.isAdmin || false;
    
    // Get both buttons
    const addJobBtn = document.querySelector('a[href="pages/add_job.html"]');
    const findJobBtn = document.querySelector('a[href="pages/jobs.html"]');
    
    // Modify the Find Job button behavior (always goes to jobs page)
    findJobBtn.addEventListener("click", function(e) {
        // Default behavior is fine, no need to prevent
    });
    
    // Modify the Add Job button behavior based on admin status
    addJobBtn.addEventListener("click", function(e) {
        if (!isAdmin) {
            e.preventDefault(); // Stop the navigation
            alert("You need to be logged in as an admin to add jobs.");
            window.location.href = "../pages/login.html"; // Redirect to login page
        }
        // If isAdmin, let the default behavior proceed
    });
});

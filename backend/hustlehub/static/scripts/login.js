document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const errorField = document.getElementById("login-email-error"); 

   
    const toggleButton = document.querySelector(".password-wrapper button");
    toggleButton.addEventListener("click", () => {
        const input = toggleButton.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
    });

    function showError(message) {
        if (errorField) {
            errorField.textContent = message;
        } else {
            alert(message); 
        }
    }

    function clearError() {
        if (errorField) {
            errorField.textContent = "";
        }
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        clearError();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const userExists = users.find(user => user.email === email && user.password === password);

        if (userExists) {
            localStorage.setItem("loggedInUser", JSON.stringify(userExists));
            window.location.href = userExists.isAdmin ? "pages/AProfile.html" : "pages/profile.html";
        } else {
            const errorField = document.getElementById("login-email-error");
            errorField.textContent = "Invalid email or password.";
            
        }
    });
});
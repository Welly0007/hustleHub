// login.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const errorField = document.getElementById("login-email-error");

    // Toggle password visibility
    const toggleButton = document.querySelector(".password-wrapper button");
    toggleButton.addEventListener("click", () => {
        const input = toggleButton.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
    });

    function showError(message) {
        errorField.textContent = message;
    }

    function clearError() {
        errorField.textContent = "";
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        clearError();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Get users from localStorage (simulate DB)
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Check for match
        const userExists = users.find(user => user.email === email && user.password === password);

        if (userExists) {
            // Successful login - redirect
            window.location.href = "profile.html";
        } else {
            // Invalid credentials
            showError("Invalid email or password.");
        }
    });
});
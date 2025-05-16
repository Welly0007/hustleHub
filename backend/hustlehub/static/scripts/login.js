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

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearError();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        try {
            const response = await fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                showError(data.error || "Invalid email or password.");
                return;
            }

            // Redirect based on user type - using relative paths for Django
            window.location.href = data.isAdmin ? "/pages/AProfile.html" : "/pages/profile.html";
            
        } catch (error) {
            console.error("Login error:", error);
            showError("An error occurred during login. Please try again later.");
        }
    });
});
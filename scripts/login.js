// login.js
import {
    isValidEmail,
    isStrongPassword
} from './authValidation.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");

    const errorFields = {
        email: document.getElementById("login-email-error"),
        password: document.getElementById("login-password-error")
    };

    function clearErrors() {
        errorFields.email.textContent = "";
        errorFields.password.textContent = "";
    }

    
    function validateEmail() {
        errorFields.email.textContent = isValidEmail(emailInput.value)
            ? ""
            : "Please enter a valid email.";
    }

    function validatePassword() {
        errorFields.password.textContent = isStrongPassword(passwordInput.value)
            ? ""
            : "Password must include uppercase, lowercase, number, and symbol.";
    }

    // Real-time validation
    emailInput.addEventListener("blur", validateEmail);
    passwordInput.addEventListener("blur", validatePassword);
    

    
    const toggleButton = document.querySelector(".password-wrapper button");
    toggleButton.addEventListener("click", () => {
        const input = toggleButton.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
    });

    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        clearErrors();
        validateEmail();
        validatePassword();

        const hasError = Object.values(errorFields).some(div => div.textContent !== "");
        if (!hasError) {
            form.submit();
        }
    });
});
// forgotPassword.js
import { isValidEmail } from './authValidation.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("recover-email");
    const errorField = document.getElementById("recover-email-error");
    const resendBtn = document.getElementById("resend-email");

    function validateEmailExists() {
        const value = emailInput.value.trim();

        if (value === "") {
            errorField.textContent = "Email is required.";
            return false;
        }

        if (!isValidEmail(value)) {
            errorField.textContent = "Please enter a valid email address.";
            return false;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = users.some(user => user.email === value);

        if (!userExists) {
            errorField.textContent = "This email is not registered.";
            return false;
        }

        errorField.textContent = "";
        return true;
    }

    emailInput.addEventListener("blur", validateEmailExists);
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateEmailExists()) {
            form.submit(); 
        }
    });

    resendBtn.addEventListener("click", () => {
        if (!validateEmailExists()) return;

        resendBtn.disabled = true;
        resendBtn.textContent = "Resending...";

        const msg = document.createElement("p");
        msg.textContent = "Resend request sent! (simulated)";
        msg.style.color = "#28a745";
        msg.style.marginTop = "1rem";
        resendBtn.insertAdjacentElement("afterend", msg);

        setTimeout(() => {
            resendBtn.disabled = false;
            resendBtn.textContent = "Resend Email";
            msg.remove();
        }, 3000);
    });
});
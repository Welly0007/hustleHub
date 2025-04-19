// forgotPassword.js
import { isValidEmail } from './authValidation.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("recover-email");
    const errorField = document.getElementById("recover-email-error");
    const resendBtn = document.getElementById("resend-email");

    function validateEmail() {
        const value = emailInput.value.trim();

        if (value === "") {
            errorField.textContent = "Email is required.";
        } else if (!isValidEmail(value)) {
            errorField.textContent = "Please enter a valid email address.";
        } else {
            errorField.textContent = "";
        }
    }

    // Real-time validation
    emailInput.addEventListener("blur", validateEmail);
    


    form.addEventListener("submit", (e) => {
        e.preventDefault();
        validateEmail();

        if (errorField.textContent === "") {
            form.submit();
        }
    });

   
    resendBtn.addEventListener("click", () => {
        const value = emailInput.value.trim();

        if (!isValidEmail(value)) {
            errorField.textContent = "Enter a valid email before resending.";
            return;
        }

        errorField.textContent = "";

        
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
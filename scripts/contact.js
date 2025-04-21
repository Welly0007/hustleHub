//conact.js
import { isValidEmail } from "../scripts/authValidation.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form");
    const emailInput = document.getElementById("contact-email");
    const emailError = document.getElementById("contact-email-error");

    emailInput.addEventListener("blur", () => {
        if (!isValidEmail(emailInput.value)) {
            emailError.textContent = "Please enter a valid email address.";
        } else {
            emailError.textContent = "";
        }
    });

    emailInput.addEventListener("input", () => {
        emailError.textContent = "";
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!isValidEmail(emailInput.value)) {
            emailError.textContent = "Please enter a valid email address.";
        } else {
            emailError.textContent = "";
            window.location.href = "pages/submitted_successfully.html";
        }
    });
});
// authValidation.js

export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

export function isStrongPassword(password) {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
}


export function doPasswordsMatch(password, confirmPassword) {
    return password === confirmPassword;
}


export function isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(username.trim());
}


export function isNotEmpty(value) {
    return value.trim().length > 0;
}


export function isCompanyNameValid(companyName, isAdmin) {
    return !isAdmin || isNotEmpty(companyName);
}
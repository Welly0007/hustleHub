// dynamically set the base URL
// const base = document.createElement('base');
// base.href = window.location.hostname === 'welly0007.github.io'
//     ? 'https://welly0007.github.io/hustleHub/'
//     : '/';
// document.head.prepend(base);

// fetching Header and rendering to page (skip for login, signup, and forgotPassword pages)
const excludedPages = ["login.html", "signup.html", "forgotPassword.html"];
if (!excludedPages.some(page => window.location.pathname.endsWith(page))) {
    document.addEventListener("DOMContentLoaded", () => {
        const headerContainer = document.querySelector(".headcontainer");
        fetch("/static/header.html")
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;
            })
            .catch(error => console.error("Error loading header:", error));
    });
}

// Fetching Footer
fetch('/static/footer.html')
    .then(res => res.text())
    .then(data => {
        document.querySelector('footer').innerHTML = data;
    });
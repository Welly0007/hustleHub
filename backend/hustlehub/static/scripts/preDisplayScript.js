// dynamically set the base URL
// const base = document.createElement('base');
// base.href = window.location.hostname === 'welly0007.github.io'
//     ? 'https://welly0007.github.io/hustleHub/'
//     : '/';
// document.head.prepend(base);

// fetching Header and rendering to page (skip for login, signup, and forgotPassword pages)
const excludedPages = ["login.html", "signup.html", "forgotPassword.html"];
if (!excludedPages.some(page => window.location.pathname.endsWith(page))) {
    fetch('/static/header.html')
        .then(res => res.text())
        .then(data => {
            document.querySelector('.headcontainer').innerHTML = data;

            // highlight the current page link
            const currentPage = window.location.pathname.split('/').pop();
            const navLinks = document.querySelectorAll('nav a');

            navLinks.forEach(link => {
                const linkPath = link.getAttribute('href').split('/').pop();
                if (linkPath === currentPage) {
                    link.classList.add('active');
                }
            });

            // dynamic header logic
            const navLinksContainer = document.querySelector("nav");
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

            if (loggedInUser) {
                // User is logged in
                const profileLink = document.createElement("a");
                profileLink.textContent = "Profile";
                profileLink.href = loggedInUser.isAdmin ? "/pages/AProfile.html" : "/pages/profile.html";

                const logoutLink = document.createElement("a");
                logoutLink.textContent = "Logout";
                logoutLink.href = "#";
                logoutLink.addEventListener("click", function (e) {
                    e.preventDefault();
                    if (confirm("Are you sure you want to log out?")) {
                        localStorage.removeItem("loggedInUser");
                        window.location.href = "/"; // Redirect to home page
                    }
                });

                // remove "Sign In" link and add "Profile" and "Logout"
                navLinksContainer.innerHTML = `
                    <a href="/">Home</a>
                    <a href="/pages/jobs.html">Jobs</a>
                    <a href="/pages/contact.html">Contact us</a>
                `;
                navLinksContainer.appendChild(profileLink);
                navLinksContainer.appendChild(logoutLink);
            } else {
                // User is not logged in
                const signInLink = document.createElement("a");
                signInLink.textContent = "Sign In";
                signInLink.href = "/pages/login.html";

                // Remove "Profile" and "Logout" links and add "Sign In"
                navLinksContainer.innerHTML = `
                    <a href="/">Home</a>
                    <a href="/pages/jobs.html">Jobs</a>
                    <a href="/pages/contact.html">Contact us</a>
                `;
                navLinksContainer.appendChild(signInLink);
            }
        });
}

fetch('/static/footer.html')
    .then(res => res.text())
    .then(data => {
        document.querySelector('footer').innerHTML = data;
    });
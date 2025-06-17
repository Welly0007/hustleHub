// dynamically set the base URL
// const base = document.createElement('base');
// base.href = window.location.hostname === 'welly0007.github.io'
//     ? 'https://welly0007.github.io/hustleHub/'
//     : '/';
// document.head.prepend(base);

// Function to render authentication links based on user status
function renderAuthLinks(userData) {
    const authLinksContainer = document.getElementById('auth-links');
    if (!authLinksContainer) return;

    if (userData && userData.username) {
        // User is logged in
        const profileLink = userData.is_company_admin ? 
            '<a href="/pages/AProfile.html">Profile</a>' : 
            '<a href="/pages/profile.html">Profile</a>';
        
        authLinksContainer.innerHTML = `
            ${profileLink}
            <a href="#" id="logout-btn">Logout</a>
        `;
        
        // Add logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    const response = await fetch('/api/logout/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': getCookie('csrftoken')
                        }
                    });
                    
                    if (response.ok) {
                        window.location.href = '/';
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                }
            });
        }
    } else {
        // User is not logged in
        authLinksContainer.innerHTML = '<a href="/pages/login.html">Sign In</a>';
    }
}

// Function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// fetching Header and rendering to page (skip for login, signup, and forgotPassword pages)
const excludedPages = ["login.html", "signup.html", "forgotPassword.html"];
if (!excludedPages.some(page => window.location.pathname.endsWith(page))) {
    document.addEventListener("DOMContentLoaded", () => {
        const headerContainer = document.querySelector(".headcontainer");
        fetch("/static/header.html")
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;                // Get user data from the page (if available)
                let userData = {};
                const userDataScript = document.getElementById('user-data');
                if (userDataScript) {
                    try {
                        userData = JSON.parse(userDataScript.textContent);
                    } catch (e) {
                        console.log('No user data available');
                    }
                }
                
                // Render auth links after header is loaded
                renderAuthLinks(userData);
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
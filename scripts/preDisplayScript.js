// Dynamically set the base URL
const base = document.createElement('base');
base.href = window.location.hostname === 'welly0007.github.io' 
    ? 'https://welly0007.github.io/hustleHub/' 
    : '/';
document.head.prepend(base);

// Fetching Header and rendering to page
fetch('pages/header.html')
    .then(res => res.text())
    .then(data => {
        document.querySelector('.headcontainer').innerHTML = data;
    });
// Fetching Footer
fetch('pages/footer.html')
    .then(res => res.text())
    .then(data => {
        document.querySelector('footer').innerHTML = data;
    });
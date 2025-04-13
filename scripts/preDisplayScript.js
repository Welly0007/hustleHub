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
// comment
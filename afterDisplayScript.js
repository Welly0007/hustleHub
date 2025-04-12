document.querySelectorAll('.filter-group h3').forEach((header) => {
    header.addEventListener('click', () => {
        const filterGroup = header.parentElement;
        filterGroup.classList.toggle('active'); // Toggle the active class
    });
});
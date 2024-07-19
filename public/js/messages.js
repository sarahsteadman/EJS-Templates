document.addEventListener('DOMContentLoaded', () => {
    console.log("Dom Loaded");
    const rows = document.querySelectorAll('.clickable-row');

    rows.forEach(row => {
        console.log("loop occured");
        row.addEventListener('click', () => {
            console.log("Row clicked");
            window.location.href = row.getAttribute('data-href');
        });
    });
});
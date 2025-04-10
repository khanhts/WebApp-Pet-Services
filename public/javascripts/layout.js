function loadHTMLComponents() {
    // Load the header
    fetch('../shared/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });

    // Load the footer
    fetch('../shared/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
}

window.onload = loadHTMLComponents;

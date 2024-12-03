document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        authButtons.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickInsideBtn = mobileMenuBtn.contains(event.target);
        const isMenuOpen = navLinks.classList.contains('active');

        if (!isClickInsideNav && !isClickInsideBtn && isMenuOpen) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            authButtons.classList.remove('active');
        }
    });

    // Close menu when clicking on a link
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            authButtons.classList.remove('active');
        });
    });
});

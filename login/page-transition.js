document.addEventListener('DOMContentLoaded', () => {
    // Add click event listeners to all links that should trigger the transition
    const transitionLinks = document.querySelectorAll('a[href*="login"], a[href*="createAccount"]');
    
    transitionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = link.href;
            
            // Add exit animation class
            document.querySelector('.container').classList.add('page-exit');
            
            // Wait for animation to complete before navigating
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 600); // Match this with the CSS animation duration
        });
    });
});

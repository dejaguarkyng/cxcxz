// Function to show/hide password
function showPas() {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("hide");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    }
}

// Function to show message
function showMessage(message, isError = false) {
    const messageDiv = document.getElementById("message");
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.style.color = isError ? "#ff4d4d" : "#4CAF50";
    }
}

// Function to validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Check if user is already logged in
function checkExistingLogin() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        // Verify token with backend
        fetch('http://localhost:5000/api/patients/verify-token', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '../patient homepage/homPage.html';
            } else {
                // Clear invalid session
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
            }
        })
        .catch(error => {
            console.error('Token verification error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
        });
    }
}

// Function to handle login
async function handleLogin(event) {
    if (event) event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Clear previous messages
    showMessage("");

    // Basic validation
    if (!email || !password) {
        showMessage("Please fill in all fields", true);
        return;
    }

    if (!validateEmail(email)) {
        showMessage("Please enter a valid email address", true);
        return;
    }

    // Show loading modal with initial message
    window.loadingModal.show('Signing in to your account...', {
        showProgress: true,
        progressDuration: 2000
    });

    try {
        // Simulate loading steps
        await simulateSteps([
            ['Verifying your credentials...', 25],
            ['Checking account status...', 50],
            ['Loading medical profile...', 75],
            ['Preparing your dashboard...', 90]
        ]);

        const response = await fetch('http://localhost:5000/api/patients/patient-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store tokens and user data securely
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            // Show success message and redirect
            window.loadingModal.showSuccess('Login successful! Redirecting...', 1500);
            setTimeout(() => {
                window.location.href = '../patient homepage/homPage.html';
            }, 1500);
        } else {
            window.loadingModal.hide();
            showMessage(data.message || 'Login failed. Please check your credentials.', true);
        }
    } catch (error) {
        console.error('Login error:', error);
        window.loadingModal.hide();
        showMessage('Network error. Please try again later.', true);
    }
}

// Simulated loading steps
async function simulateSteps(steps) {
    for (const [message, progress] of steps) {
        window.loadingModal.updateProgress(progress, message);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Check for existing login first
    checkExistingLogin();

    const loginButton = document.getElementById("loginButton");
    const loginForm = document.getElementById("login-form");

    if (loginButton && loginForm) {
        loginButton.addEventListener("click", handleLogin);
        loginForm.addEventListener("submit", handleLogin);
    }

    const emailInput = document.getElementById("email");
    if (emailInput) {
        emailInput.addEventListener("input", () => {
            const isValid = validateEmail(emailInput.value);
            emailInput.style.borderColor = isValid ? 
                "var(--success-color)" : 
                emailInput.value ? "var(--error-color)" : "";
        });
    }

    // Make showPas function available globally
    window.showPas = showPas;
});

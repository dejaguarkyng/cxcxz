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

// Function to display messages
function showMessage(message, isError = false) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.style.color = isError ? "var(--error-color)" : "var(--success-color)";
    messageDiv.style.marginBottom = "1rem";
}

// Function to validate admin credentials
function validateAdminId(adminId) {
    // Add your validation logic here
    return /^[A-Za-z0-9]{6,}$/.test(adminId);
}

// Function to handle login
async function handleLogin(event) {
    event.preventDefault();
    
    // Show loading modal
    window.loadingModal.show('Logging in...');
    
    const adminId = document.getElementById("adminId").value;
    const password = document.getElementById("password").value;
    const loginButton = document.getElementById("loginButton");

    // Clear previous messages
    showMessage("");

    // Basic validation
    if (!adminId || !password) {
        showMessage("Please fill in all fields", true);
        window.loadingModal.hide();
        return;
    }

    if (!validateAdminId(adminId)) {
        showMessage("Invalid Admin ID format. Use letters and numbers (min 6 characters).", true);
        window.loadingModal.hide();
        return;
    }

    try {
        await simulateSteps([
            ['Verifying admin credentials...', 20],
            ['Checking security clearance...', 40],
            ['Loading admin privileges...', 60],
            ['Preparing system access...', 80],
            ['Setting up admin dashboard...', 100]
        ]);

        const response = await fetch('http://localhost:5000/api/admin/admin-login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adminId,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminId', adminId);
            
            // Show success message before redirecting
            showMessage("Login successful!", false);
            
            setTimeout(() => {
                window.location.href = '../admin dashboard/admin.dashboard.html';
            }, 500);
        } else {
            window.loadingModal.hide();
            showMessage(data.message || 'Login failed. Please check your credentials.', true);
        }
    } catch (error) {
        window.loadingModal.hide();
        console.error('Login error:', error);
        showMessage('An error occurred. Please try again later.', true);
    } finally {
        window.loadingModal.hide();
    }
}

async function simulateSteps(steps) {
    for (const [message, progress] of steps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        window.loadingModal.updateProgress(progress, message);
    }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const adminForm = document.getElementById("admin-form");
    const adminIdInput = document.getElementById("adminId");

    if (loginButton && adminForm) {
        loginButton.addEventListener("click", handleLogin);
        adminForm.addEventListener("submit", handleLogin);
    }

    // Add input validation
    if (adminIdInput) {
        adminIdInput.addEventListener("input", () => {
            const isValid = validateAdminId(adminIdInput.value);
            adminIdInput.style.borderColor = isValid ? 
                "var(--success-color)" : 
                adminIdInput.value ? "var(--error-color)" : "";
        });
    }

    // Make showPas function available globally
    window.showPas = showPas;
});

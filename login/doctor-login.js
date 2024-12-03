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

// Function to validate Doctor ID format
function validateDoctorId(doctorId) {
    // At least 6 characters, alphanumeric, uppercase
    return /^[A-Z0-9]{6,}$/.test(doctorId);
}

// Function to handle login
async function handleLogin(event) {
    event.preventDefault();
    
    // Show loading modal
    window.loadingModal.show('Logging in...');
    
    const doctorId = document.getElementById("doctorId").value;
    const password = document.getElementById("password").value;
    const loginButton = document.getElementById("loginButton");

    // Clear previous messages
    showMessage("");

    // Basic validation
    if (!doctorId || !password) {
        showMessage("Please fill in all fields", true);
        window.loadingModal.hide();
        return;
    }

    if (!validateDoctorId(doctorId)) {
        showMessage("Invalid Doctor ID format. Use uppercase letters and numbers (min 6 characters).", true);
        window.loadingModal.hide();
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/doctors/doctor-login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                doctorId,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('doctorToken', data.token);
            localStorage.setItem('doctorId', doctorId);
            
            // Show success message before redirecting
            showMessage("Login successful!", false);
            
            // Add a small delay to show the success message
            setTimeout(() => {
                window.location.href = '../doc homepage/doctor.homepage.html';
            }, 500);
        } else {
            showMessage(data.message || 'Login failed. Please check your credentials.', true);
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('An error occurred. Please try again later.', true);
    } finally {
        window.loadingModal.hide();
    }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const doctorForm = document.getElementById("doctor-form");
    const doctorIdInput = document.getElementById("doctorId");

    if (loginButton && doctorForm) {
        loginButton.addEventListener("click", handleLogin);
        doctorForm.addEventListener("submit", handleLogin);
    }

    // Add input validation
    if (doctorIdInput) {
        doctorIdInput.addEventListener("input", () => {
            const isValid = validateDoctorId(doctorIdInput.value);
            doctorIdInput.style.borderColor = isValid ? 
                "var(--success-color)" : 
                doctorIdInput.value ? "var(--error-color)" : "";
        });
    }

    // Make showPas function available globally
    window.showPas = showPas;
});

const form = document.getElementById('login-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    window.loadingModal.show('Signing in to your account...');

    const doctorId = document.getElementById('doctorId').value;
    const password = document.getElementById('password').value;

    try {
        await simulateSteps([
            ['Verifying credentials...', 30],
            ['Checking account status...', 60],
            ['Loading your profile...', 90],
            ['Redirecting to dashboard...', 100]
        ]);

        const response = await fetch('http://localhost:5000/api/doctors/doctor-login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ doctorId, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('doctorToken', data.token);
            localStorage.setItem('doctorId', doctorId);
            window.location.href = '../doc homepage/doctor.homepage.html';
        } else {
            window.loadingModal.hide();
            showMessage(data.message || 'Login failed. Please try again.', true);
        }
    } catch (error) {
        window.loadingModal.hide();
        showMessage('An error occurred. Please try again.', true);
    }
});

async function simulateSteps(steps) {
    for (const [message, progress] of steps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        window.loadingModal.updateProgress(progress, message);
    }
}

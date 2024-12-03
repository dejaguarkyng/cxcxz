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

function showMessage(message, isError = false) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.style.color = isError ? "#ff3333" : "#4CAF50";
    messageDiv.style.marginBottom = "10px";
    messageDiv.style.textAlign = "center";
}

function validateDoctorId(doctorId) {
    return /^[A-Z0-9]{6,}$/.test(doctorId);
}

async function handleLogin(event) {
    event.preventDefault();
    
    const doctorId = document.getElementById("doctorId").value;
    const password = document.getElementById("password").value;

    showMessage("");

    if (!doctorId || !password) {
        showMessage("Please fill in all fields", true);
        return;
    }

    if (!validateDoctorId(doctorId)) {
        showMessage("Invalid Doctor ID format", true);
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/doctor/doctor-login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctorId, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            showMessage("Login successful!");
            localStorage.setItem('token', data.token);
            localStorage.setItem('doctorId', data._id);
            
            setTimeout(() => {
                window.location.href = '../doctor homepage/doctor.homepage.html';
            }, 500);
        } else {
            showMessage(data.message || 'Login failed. Please check your credentials.', true);
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Network error. Please try again later.', true);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const doctorForm = document.getElementById("user-form");

    if (loginButton && doctorForm) {
        loginButton.addEventListener("click", handleLogin);
        doctorForm.addEventListener("submit", handleLogin);
    }

    window.showPas = showPas;

    const doctorIdInput = document.getElementById("doctorId");
    if (doctorIdInput) {
        doctorIdInput.addEventListener("input", () => {
            if (!validateDoctorId(doctorIdInput.value)) {
                doctorIdInput.style.borderColor = "#ff3333";
            } else {
                doctorIdInput.style.borderColor = "#4CAF50";
            }
        });
    }
});

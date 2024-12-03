document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signup-form');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const submitButton = document.getElementById('submitButton');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const errorMessage = document.getElementById('error-message');
    const loadingModal = document.getElementById('loading-modal');

    let currentStep = 0;

    // Password visibility toggle
    togglePassword.addEventListener('click', () => togglePasswordVisibility(passwordInput, togglePassword));
    toggleConfirmPassword.addEventListener('click', () => togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword));

    function togglePasswordVisibility(input, icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    }

    // Navigation buttons
    prevButton.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateFormSteps();
        }
    });

    nextButton.addEventListener('click', () => {
        if (validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateFormSteps();
            }
        }
    });

    // Form submission
    document.getElementById('signup-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        window.loadingModal.show('Creating your account...');

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        try {
            await simulateSteps([
                ['Validating your information...', 20],
                ['Creating your profile...', 40],
                ['Setting up your account...', 60],
                ['Configuring preferences...', 80],
                ['Finalizing registration...', 100]
            ]);

            const response = await fetch('http://localhost:5000/api/patients/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                window.loadingModal.updateProgress(100, 'Account created successfully!');
                setTimeout(() => {
                    window.location.href = '../login/patient-login.html';
                }, 1000);
            } else {
                window.loadingModal.hide();
                showError(result.message || 'Failed to create account. Please try again.');
            }
        } catch (error) {
            window.loadingModal.hide();
            showError('An error occurred. Please try again.');
        }
    });

    async function simulateSteps(steps) {
        for (const [message, progress] of steps) {
            await new Promise(resolve => setTimeout(resolve, 500));
            window.loadingModal.updateProgress(progress, message);
        }
    }

    function showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    function updateFormSteps() {
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
        });

        stepIndicators.forEach((indicator, index) => {
            if (index === currentStep) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else if (index < currentStep) {
                indicator.classList.remove('active');
                indicator.classList.add('completed');
            } else {
                indicator.classList.remove('active', 'completed');
            }
        });

        // Update button visibility
        prevButton.style.display = currentStep === 0 ? 'none' : 'block';
        nextButton.style.display = currentStep === steps.length - 1 ? 'none' : 'block';
        submitButton.style.display = currentStep === steps.length - 1 ? 'block' : 'none';
    }

    function validateCurrentStep() {
        const currentStepElement = steps[currentStep];
        const inputs = currentStepElement.querySelectorAll('input, select, textarea');
        let isValid = true;
        errorMessage.textContent = '';

        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value) {
                isValid = false;
                errorMessage.textContent = 'Please fill in all required fields.';
            }
        });

        if (currentStep === 2) { // Password validation on the last step
            if (passwordInput.value !== confirmPasswordInput.value) {
                isValid = false;
                errorMessage.textContent = 'Passwords do not match.';
            } else if (passwordInput.value.length < 8) {
                isValid = false;
                errorMessage.textContent = 'Password must be at least 8 characters long.';
            }
        }

        return isValid;
    }

    // Initialize form
    updateFormSteps();
});

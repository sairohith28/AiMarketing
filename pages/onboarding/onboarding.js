/**
 * Onboarding Module - JavaScript
 * Handles hospital onboarding form functionality
 */

// Initialize Onboarding
function initializeOnboarding() {
    console.log('Initializing Onboarding...');
    setupOnboardingForm();
    setupMapPlaceholder();
    setupServiceSelection();
}

// Setup Onboarding Form
function setupOnboardingForm() {
    const onboardingForm = document.getElementById('onboardingForm');
    if (onboardingForm) {
        onboardingForm.addEventListener('submit', handleOnboardingSubmit);
        
        // Add form validation
        setupFormValidation(onboardingForm);
    }
    
    // Setup file upload preview
    setupFileUpload();
}

// Handle Form Submission
function handleOnboardingSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateOnboardingForm()) {
        return;
    }
    
    // Mock form processing
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showAlert('Hospital profile saved successfully! 🎉', 'success');
        
        // Optional: Navigate to dashboard or next step
        setTimeout(() => {
            if (typeof showSection === 'function') {
                showSection('dashboard');
            }
        }, 2000);
        
    }, 2000);
}

// Form Validation
function setupFormValidation(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('is-invalid');
    
    // Basic validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    // URL validation
    if (field.type === 'url' && value && !isValidURL(value)) {
        showFieldError(field, 'Please enter a valid website URL');
        return false;
    }
    
    // Clear any errors
    clearFieldError(field);
    return true;
}

function clearFieldError(field) {
    if (typeof field === 'object' && field.target) {
        field = field.target;
    }
    
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function validateOnboardingForm() {
    const form = document.getElementById('onboardingForm');
    let isValid = true;
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    // Check if at least one service is selected
    const serviceCheckboxes = form.querySelectorAll('input[type="checkbox"]');
    const hasSelectedService = Array.from(serviceCheckboxes).some(cb => cb.checked);
    
    if (!hasSelectedService) {
        showAlert('Please select at least one primary service', 'warning');
        isValid = false;
    }
    
    return isValid;
}

// Validation Helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// File Upload Preview
function setupFileUpload() {
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        showAlert('Please select a valid image file (JPEG, PNG, GIF, or WebP)', 'error');
        e.target.value = '';
        return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        showAlert('File size must be less than 5MB', 'error');
        e.target.value = '';
        return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        showImagePreview(e.target.result, file.name);
    };
    reader.readAsDataURL(file);
}

function showImagePreview(src, filename) {
    // Remove existing preview
    const existingPreview = document.querySelector('.logo-preview');
    if (existingPreview) {
        existingPreview.remove();
    }
    
    // Create preview
    const preview = document.createElement('div');
    preview.className = 'logo-preview mt-2 p-3 border rounded';
    preview.innerHTML = `
        <div class="d-flex align-items-center">
            <img src="${src}" alt="Logo Preview" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" class="me-3">
            <div>
                <strong>Selected Logo:</strong><br>
                <small class="text-muted">${filename}</small>
            </div>
        </div>
    `;
    
    const fileInput = document.querySelector('input[type="file"]');
    fileInput.parentNode.appendChild(preview);
}

// Service Selection Enhancement
function setupServiceSelection() {
    const serviceCheckboxes = document.querySelectorAll('.services-selection input[type="checkbox"]');
    
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateServiceSelection();
        });
    });
}

function updateServiceSelection() {
    const selectedServices = document.querySelectorAll('.services-selection input[type="checkbox"]:checked');
    const serviceLabels = Array.from(selectedServices).map(cb => 
        cb.nextElementSibling.textContent
    );
    
    // Optional: Show selected services count
    const selectionContainer = document.querySelector('.services-selection');
    let counter = selectionContainer.querySelector('.selection-counter');
    
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'selection-counter mt-2 text-muted small';
        selectionContainer.appendChild(counter);
    }
    
    if (serviceLabels.length > 0) {
        counter.innerHTML = `<i class="fas fa-check text-success me-1"></i>Selected: ${serviceLabels.join(', ')}`;
    } else {
        counter.innerHTML = '<i class="fas fa-info-circle text-warning me-1"></i>Please select at least one service';
    }
}

// Map Placeholder Enhancement
function setupMapPlaceholder() {
    const testLocationBtn = document.querySelector('.map-placeholder .btn');
    if (testLocationBtn) {
        testLocationBtn.addEventListener('click', handleTestLocation);
    }
}

function handleTestLocation() {
    const btn = event.target;
    const originalText = btn.textContent;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Testing...';
    btn.disabled = true;
    
    // Simulate location test
    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        
        // Mock location result
        const mapPlaceholder = btn.closest('.map-placeholder');
        mapPlaceholder.innerHTML = `
            <i class="fas fa-map-marker-alt fa-3x text-success mb-2"></i>
            <p class="text-success"><strong>Location Found!</strong></p>
            <small class="text-muted">123 Hospital Street, Medical District<br>City, State 12345</small>
            <button class="btn btn-outline-primary btn-sm mt-2" onclick="setupMapPlaceholder()">
                <i class="fas fa-edit me-1"></i>Edit Location
            </button>
        `;
    }, 1500);
}

// Utility function for alerts (fallback if main showAlert doesn't exist)
function showAlert(message, type = 'info') {
    if (window.showAlert && typeof window.showAlert === 'function') {
        return window.showAlert(message, type);
    }
    
    // Fallback alert
    console.log(`Alert [${type}]: ${message}`);
    
    // Create simple toast notification
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// Export functions for global access
window.initializeOnboarding = initializeOnboarding;
window.handleOnboardingSubmit = handleOnboardingSubmit;
window.setupMapPlaceholder = setupMapPlaceholder;
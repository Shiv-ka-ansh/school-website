// Admissions Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initAdmissionsPage();
});

function initAdmissionsPage() {
    const admissionForm = document.getElementById('admission-form');
    
    if (admissionForm) {
        initFormHandling();
        initFormValidation();
        initGradeBasedLogic();
        initFormProgress();
    }
    
    initSmoothScrolling();
    initFeeCalculator();
    initDocumentChecklist();
}

// Form handling and submission
function initFormHandling() {
    const admissionForm = document.getElementById('admission-form');
    
    admissionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

// Form validation
function initFormValidation() {
    const form = document.getElementById('admission-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error state when user starts typing
            clearFieldError(this);
        });
    });
    
    // Special validation for specific fields
    const dateOfBirth = document.getElementById('dateOfBirth');
    const gradeApplying = document.getElementById('gradeApplying');
    
    if (dateOfBirth && gradeApplying) {
        dateOfBirth.addEventListener('change', function() {
            checkAgeEligibility(this.value, gradeApplying.value);
        });
        
        gradeApplying.addEventListener('change', function() {
            if (dateOfBirth.value) {
                checkAgeEligibility(dateOfBirth.value, this.value);
            }
        });
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('parentPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
    
    // Email validation
    const emailInput = document.getElementById('parentEmail');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this);
        });
    }
    
    // Pincode validation
    const pincodeInput = document.getElementById('pincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 6);
        });
    }
}

// Grade-based logic
function initGradeBasedLogic() {
    const gradeSelect = document.getElementById('gradeApplying');
    
    if (gradeSelect) {
        gradeSelect.addEventListener('change', function() {
            updateFormBasedOnGrade(this.value);
            showGradeRequirements(this.value);
        });
    }
}

// Form progress indicator
function initFormProgress() {
    const form = document.getElementById('admission-form');
    const sections = form.querySelectorAll('.form-section');
    
    // Create progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.className = 'form-progress';
    progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
        </div>
        <div class="progress-text" id="progress-text">0% Complete</div>
    `;
    
    form.insertBefore(progressContainer, form.firstChild);
    
    // Update progress on input
    const allInputs = form.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('admission-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Check terms and conditions
    const termsCheckbox = document.getElementById('termsAccepted');
    if (!termsCheckbox.checked) {
        showFieldError(termsCheckbox, 'You must accept the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear existing errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    }
    
    // Type-specific validation
    if (value && isValid) {
        switch (fieldType) {
            case 'email':
                if (!isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
                
            case 'tel':
                if (!isValidPhone(value)) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                }
                break;
                
            case 'date':
                if (fieldName === 'dateOfBirth' && !isValidAge(value)) {
                    errorMessage = 'Student must be between 3 and 18 years old';
                    isValid = false;
                }
                break;
        }
        
        // Name validation
        if ((fieldName.includes('Name') || fieldName.includes('name')) && value) {
            if (!/^[a-zA-Z\s]+$/.test(value)) {
                errorMessage = 'Name should contain only letters and spaces';
                isValid = false;
            }
        }
        
        // Pincode validation
        if (fieldName === 'pincode' && value) {
            if (!/^\d{6}$/.test(value)) {
                errorMessage = 'Pincode should be 6 digits';
                isValid = false;
            }
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Update form based on selected grade
function updateFormBasedOnGrade(grade) {
    const previousSchoolField = document.getElementById('previousSchool');
    const previousSchoolGroup = previousSchoolField.closest('.form-group');
    
    // Make previous school required for higher grades
    if (['class2', 'class3', 'class4', 'class5', 'class6', 'class7', 'class8', 'class9', 'class10', 'class11', 'class12'].includes(grade)) {
        previousSchoolField.setAttribute('required', '');
        previousSchoolGroup.querySelector('label').textContent = 'Previous School *';
    } else {
        previousSchoolField.removeAttribute('required');
        previousSchoolGroup.querySelector('label').textContent = 'Previous School (if any)';
    }
}

// Show grade-specific requirements
function showGradeRequirements(grade) {
    // Remove existing requirements display
    const existingReq = document.querySelector('.grade-requirements');
    if (existingReq) {
        existingReq.remove();
    }
    
    const requirements = getGradeRequirements(grade);
    if (requirements.length > 0) {
        const reqDiv = document.createElement('div');
        reqDiv.className = 'grade-requirements';
        reqDiv.innerHTML = `
            <h4>Additional Requirements for ${getGradeName(grade)}:</h4>
            <ul>
                ${requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
        `;
        
        const gradeSelect = document.getElementById('gradeApplying');
        gradeSelect.closest('.form-group').appendChild(reqDiv);
    }
}

// Get grade-specific requirements
function getGradeRequirements(grade) {
    const requirements = {
        'nursery': [],
        'lkg': [],
        'ukg': [],
        'class1': [],
        'class2': ['Previous school report card'],
        'class3': ['Previous school report card'],
        'class4': ['Previous school report card'],
        'class5': ['Previous school report card'],
        'class6': ['Previous school report card', 'Entrance assessment'],
        'class7': ['Previous school report card', 'Entrance assessment'],
        'class8': ['Previous school report card', 'Entrance assessment'],
        'class9': ['Class 8 board results', 'Entrance test', 'Interview'],
        'class10': ['Class 9 results', 'Entrance test', 'Interview'],
        'class11': ['Class 10 board results', 'Stream selection', 'Entrance test'],
        'class12': ['Class 11 results', 'Stream continuation', 'Performance review']
    };
    
    return requirements[grade] || [];
}

// Get grade display name
function getGradeName(grade) {
    const names = {
        'nursery': 'Nursery',
        'lkg': 'LKG',
        'ukg': 'UKG',
        'class1': 'Class I',
        'class2': 'Class II',
        'class3': 'Class III',
        'class4': 'Class IV',
        'class5': 'Class V',
        'class6': 'Class VI',
        'class7': 'Class VII',
        'class8': 'Class VIII',
        'class9': 'Class IX',
        'class10': 'Class X',
        'class11': 'Class XI',
        'class12': 'Class XII'
    };
    
    return names[grade] || grade;
}

// Check age eligibility
function checkAgeEligibility(birthDate, grade) {
    if (!birthDate || !grade) return;
    
    const age = calculateAge(birthDate);
    const ageRanges = {
        'nursery': [3, 4],
        'lkg': [4, 5],
        'ukg': [5, 6],
        'class1': [6, 7],
        'class2': [7, 8],
        'class3': [8, 9],
        'class4': [9, 10],
        'class5': [10, 11],
        'class6': [11, 12],
        'class7': [12, 13],
        'class8': [13, 14],
        'class9': [14, 15],
        'class10': [15, 16],
        'class11': [16, 17],
        'class12': [17, 18]
    };
    
    const range = ageRanges[grade];
    if (range && (age < range[0] || age > range[1])) {
        const dobField = document.getElementById('dateOfBirth');
        const message = `Age should be between ${range[0]} and ${range[1]} years for ${getGradeName(grade)}`;
        showFieldError(dobField, message);
        
        // Show suggestion
        showAgeWarning(age, grade);
    }
}

// Show age warning with suggestions
function showAgeWarning(age, selectedGrade) {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'age-warning';
    warningDiv.innerHTML = `
        <div class="warning-content">
            <h4>Age Notice</h4>
            <p>Based on the age (${age} years), we recommend considering a different grade:</p>
            <div class="grade-suggestions">
                ${getSuggestedGrades(age).map(g => 
                    `<button type="button" class="grade-suggestion" data-grade="${g}">${getGradeName(g)}</button>`
                ).join('')}
            </div>
        </div>
    `;
    
    const gradeGroup = document.getElementById('gradeApplying').closest('.form-group');
    gradeGroup.appendChild(warningDiv);
    
    // Add click handlers for suggestions
    warningDiv.querySelectorAll('.grade-suggestion').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('gradeApplying').value = this.dataset.grade;
            warningDiv.remove();
            updateFormBasedOnGrade(this.dataset.grade);
        });
    });
}

// Get suggested grades based on age
function getSuggestedGrades(age) {
    const gradesByAge = {
        3: ['nursery'],
        4: ['nursery', 'lkg'],
        5: ['lkg', 'ukg'],
        6: ['ukg', 'class1'],
        7: ['class1', 'class2'],
        8: ['class2', 'class3'],
        9: ['class3', 'class4'],
        10: ['class4', 'class5'],
        11: ['class5', 'class6'],
        12: ['class6', 'class7'],
        13: ['class7', 'class8'],
        14: ['class8', 'class9'],
        15: ['class9', 'class10'],
        16: ['class10', 'class11'],
        17: ['class11', 'class12'],
        18: ['class12']
    };
    
    return gradesByAge[age] || [];
}

// Calculate age from birth date
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// Format phone number
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    
    input.value = value;
}

// Validation helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

function isValidAge(birthDate) {
    const age = calculateAge(birthDate);
    return age >= 3 && age <= 18;
}

// Update form progress
function updateProgress() {
    const form = document.getElementById('admission-form');
    const allInputs = form.querySelectorAll('input, select, textarea');
    const filledInputs = Array.from(allInputs).filter(input => {
        if (input.type === 'checkbox') {
            return input.checked;
        }
        return input.value.trim() !== '';
    });
    
    const progress = Math.round((filledInputs.length / allInputs.length) * 100);
    
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill && progressText) {
        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '% Complete';
    }
}

// Form submission
function submitForm() {
    const form = document.getElementById('admission-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.innerHTML = '<div class="loading-spinner"></div> Submitting Application...';
    submitBtn.disabled = true;
    form.classList.add('form-loading');
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        updateProgress();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.classList.remove('form-loading');
        
        // Scroll to success message
        document.querySelector('.success-banner').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
    }, 3000);
}

// Show success message
function showSuccessMessage() {
    const successHTML = `
        <div class="success-banner">
            <h3>🎉 Application Submitted Successfully!</h3>
            <p>Thank you for your interest in SMPS Jhansi. We have received your application and will contact you within 24 hours to schedule an interaction session.</p>
            <p><strong>Reference ID:</strong> SMPS${Date.now()}</p>
            <p>Please keep this reference ID for future correspondence.</p>
        </div>
    `;
    
    const form = document.getElementById('admission-form');
    form.insertAdjacentHTML('beforebegin', successHTML);
}

// Fee calculator
function initFeeCalculator() {
    // Simple fee calculator functionality
    const gradeCards = document.querySelectorAll('.grade-card');
    
    gradeCards.forEach(card => {
        card.addEventListener('click', function() {
            const grade = this.querySelector('h3').textContent;
            highlightSelectedGrade(this);
            showFeeBreakdown(grade);
        });
    });
}

function highlightSelectedGrade(selectedCard) {
    document.querySelectorAll('.grade-card').forEach(card => {
        card.classList.remove('selected');
    });
    selectedCard.classList.add('selected');
}

function showFeeBreakdown(grade) {
    // This would show detailed fee breakdown
    console.log('Showing fee breakdown for:', grade);
}

// Document checklist
function initDocumentChecklist() {
    const documentItems = document.querySelectorAll('.document-list li');
    
    documentItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('checked');
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Export utility functions
window.AdmissionsUtils = {
    calculateAge,
    isValidEmail,
    isValidPhone,
    formatPhoneNumber,
    validateField,
    getGradeName
};

// Add CSS for dynamic elements
const style = document.createElement('style');
style.textContent = `
    .form-progress {
        margin-bottom: var(--spacing-6);
        padding: var(--spacing-4);
        background-color: var(--school-white);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background-color: #e5e7eb;
        border-radius: var(--radius-md);
        overflow: hidden;
        margin-bottom: var(--spacing-2);
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--school-sky), var(--school-coral));
        transition: width 0.3s ease;
        width: 0%;
    }
    
    .progress-text {
        text-align: center;
        font-size: var(--font-size-sm);
        color: var(--school-navy);
        font-weight: 500;
    }
    
    .grade-requirements {
        margin-top: var(--spacing-3);
        padding: var(--spacing-3);
        background-color: #fffbeb;
        border: 1px solid #fbbf24;
        border-radius: var(--radius-md);
    }
    
    .grade-requirements h4 {
        color: var(--school-navy);
        margin-bottom: var(--spacing-2);
        font-size: var(--font-size-sm);
    }
    
    .grade-requirements ul {
        list-style: none;
        margin: 0;
    }
    
    .grade-requirements li {
        padding: var(--spacing-1) 0;
        font-size: var(--font-size-xs);
        color: #92400e;
        position: relative;
        padding-left: var(--spacing-4);
    }
    
    .grade-requirements li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: #f59e0b;
    }
    
    .age-warning {
        margin-top: var(--spacing-3);
        padding: var(--spacing-4);
        background-color: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: var(--radius-lg);
    }
    
    .warning-content h4 {
        color: var(--school-navy);
        margin-bottom: var(--spacing-2);
    }
    
    .grade-suggestions {
        display: flex;
        gap: var(--spacing-2);
        flex-wrap: wrap;
        margin-top: var(--spacing-3);
    }
    
    .grade-suggestion {
        padding: var(--spacing-1) var(--spacing-3);
        background-color: var(--school-white);
        border: 1px solid var(--school-sky);
        border-radius: var(--radius-md);
        color: var(--school-sky);
        font-size: var(--font-size-xs);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .grade-suggestion:hover {
        background-color: var(--school-sky);
        color: var(--school-white);
    }
    
    .grade-card.selected {
        border-color: var(--school-coral);
        box-shadow: 0 0 0 2px rgba(240, 84, 97, 0.2);
    }
    
    .document-list li.checked {
        opacity: 0.7;
        text-decoration: line-through;
    }
    
    .document-list li.checked .doc-icon::after {
        content: '✓';
        position: absolute;
        right: -10px;
        top: 0;
        color: var(--school-sky);
        font-weight: bold;
    }
`;
document.head.appendChild(style);
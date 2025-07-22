// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form
    initContactForm();
    
    // Initialize FAQ accordion
    initFAQAccordion();
    
    // Set minimum date for consultation scheduling
    setMinimumDate();
    
    // Initialize map lazy loading
    initMapLazyLoading();
});

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                submitContactForm();
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function validateContactForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && value === '') {
        errorMessage = 'This field is required';
        isValid = false;
    } else if (value !== '') {
        // Specific field validations
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
        }
        
        // Name validation
        if ((fieldName === 'firstName' || fieldName === 'lastName') && value.length < 2) {
            errorMessage = 'Name must be at least 2 characters long';
            isValid = false;
        }
        
        // Subject validation
        if (fieldName === 'subject' && value.length < 5) {
            errorMessage = 'Subject must be at least 5 characters long';
            isValid = false;
        }
        
        // Message validation
        if (fieldName === 'message' && value.length < 10) {
            errorMessage = 'Message must be at least 10 characters long';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        field.classList.add('valid');
    }
    
    return isValid;
}

function submitContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Collect form data
    const formData = new FormData(form);
    const contactData = {};
    
    for (let [key, value] of formData.entries()) {
        contactData[key] = value;
    }
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Show success message
        showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
        
        // Reset form
        form.reset();
        clearAllFieldErrors();
        
        // Log contact data (in real implementation, send to server)
        console.log('Contact form submitted:', contactData);
        
        // Send confirmation email notification
        if (contactData.newsletter === 'on') {
            showNotification('You have been subscribed to our newsletter!', 'info');
        }
    }, 2000);
}

// FAQ Accordion Functionality
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle i');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
                otherItem.querySelector('.faq-toggle i').classList.remove('fa-minus');
                otherItem.querySelector('.faq-toggle i').classList.add('fa-plus');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggle.classList.remove('fa-plus');
                toggle.classList.add('fa-minus');
            }
        });
    });
}

// Schedule Modal Functionality
function openScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Schedule Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const scheduleForm = document.getElementById('scheduleForm');
    
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateScheduleForm()) {
                submitScheduleForm();
            }
        });
    }
});

function validateScheduleForm() {
    const form = document.getElementById('scheduleForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateScheduleField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateScheduleField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    clearFieldError(field);
    
    if (field.hasAttribute('required') && value === '') {
        errorMessage = 'This field is required';
        isValid = false;
    } else if (value !== '') {
        // Date validation
        if (field.type === 'date') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                errorMessage = 'Please select a future date';
                isValid = false;
            }
            
            // Check if it's a weekend
            const dayOfWeek = selectedDate.getDay();
            if (dayOfWeek === 0) { // Sunday
                errorMessage = 'We are closed on Sundays. Please select a weekday or Saturday.';
                isValid = false;
            }
        }
        
        // Email validation
        if (field.type === 'email' && !isValidEmail(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Phone validation
        if (field.type === 'tel' && !isValidPhone(value)) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function submitScheduleForm() {
    const form = document.getElementById('scheduleForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Scheduling...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const scheduleData = {};
    
    for (let [key, value] of formData.entries()) {
        scheduleData[key] = value;
    }
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Consultation scheduled successfully! We will send you a confirmation email shortly.', 'success');
        
        // Reset form and close modal
        form.reset();
        clearAllFieldErrors();
        closeScheduleModal();
        
        // Log schedule data
        console.log('Consultation scheduled:', scheduleData);
    }, 2000);
}

// Set minimum date for date inputs
function setMinimumDate() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const minDate = tomorrow.toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        input.min = minDate;
    });
}

// Map lazy loading
function initMapLazyLoading() {
    const mapWrapper = document.querySelector('.map-wrapper');
    const mapIframe = document.querySelector('.contact-map');
    
    if (mapWrapper && mapIframe) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Map is visible, ensure it's loaded
                    mapIframe.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(mapWrapper);
    }
}

// Utility Functions
function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('valid');
    
    // Remove existing error
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentElement.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function clearAllFieldErrors() {
    const errors = document.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error', 'valid');
    });
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidPhone(phone) {
    const regex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return regex.test(phone);
}

// Modal close events
window.addEventListener('click', function(event) {
    const modal = document.getElementById('scheduleModal');
    if (event.target === modal) {
        closeScheduleModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeScheduleModal();
    }
});

// Contact card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add floating WhatsApp button with context-aware messages
function addContactWhatsApp() {
    const whatsappBtn = document.createElement('div');
    whatsappBtn.className = 'whatsapp-float contact-whatsapp';
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappBtn.onclick = function() {
        const message = "Hello! I visited your contact page and would like to get in touch about your services.";
        openWhatsApp(message);
    };
    whatsappBtn.title = 'Contact us on WhatsApp';
    
    document.body.appendChild(whatsappBtn);
}

// Initialize contact WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    addContactWhatsApp();
});

// Form analytics (in real implementation, integrate with analytics service)
function trackFormInteraction(eventType, formName, fieldName = null) {
    console.log(`Form Analytics: ${eventType} on ${formName}`, fieldName);
    
    // Example: Google Analytics event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventType, {
            'event_category': 'Form',
            'event_label': formName,
            'custom_parameter': fieldName
        });
    }
}

// Track form interactions
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const formName = form.id || 'unknown-form';
        
        // Track form start (first interaction)
        let formStarted = false;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                if (!formStarted) {
                    trackFormInteraction('form_start', formName);
                    formStarted = true;
                }
                trackFormInteraction('field_focus', formName, this.name);
            });
        });
        
        // Track form submission
        form.addEventListener('submit', function() {
            trackFormInteraction('form_submit', formName);
        });
    });
});

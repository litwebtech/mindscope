// AJAX Forms Handler for Mindscope Services
$(document).ready(function() {
    
    // Newsletter Form Handler (Footer and other locations)
    $(document).on('submit', '[id$="NewsletterForm"]', function(e) {
        e.preventDefault();
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        const originalBtnContent = submitBtn.html();
        
        // Show loading state
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i>').prop('disabled', true);
        
        $.ajax({
            url: 'ajax/newsletter.php',
            type: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('success', 'Subscribed!', response.message);
                    form[0].reset();
                } else {
                    showAlert('error', 'Failed', response.message);
                }
            },
            error: function() {
                showAlert('error', 'Error', 'Something went wrong. Please try again.');
            },
            complete: function() {
                submitBtn.html(originalBtnContent).prop('disabled', false);
            }
        });
    });

    // Contact Form Handler
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        if (!validateContactForm()) {
            return;
        }
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        
        // Show loading state
        submitBtn.addClass('loading').prop('disabled', true);
        
        // Collect form data and format it for our backend
        const formData = {
            name: $('#firstName').val() + ' ' + $('#lastName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            subject: $('#subject').val(),
            message: $('#message').val(),
            service_type: $('#serviceType').val(),
            newsletter: $('#newsletter').is(':checked') ? 1 : 0
        };
        
        $.ajax({
            url: 'ajax/contact.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('success', 'Message Sent!', response.message);
                    form[0].reset();
                } else {
                    showAlert('error', 'Failed', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Contact form error:', error);
                showAlert('error', 'Error', 'Something went wrong. Please try again.');
            },
            complete: function() {
                submitBtn.removeClass('loading').prop('disabled', false);
            }
        });
    });

    // Catering Quote Form Handler
    $('#cateringQuoteForm').on('submit', function(e) {
        e.preventDefault();
        
        if (!validateCateringForm()) {
            return;
        }
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        const originalBtnContent = submitBtn.html();
        
        // Show loading state
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Processing...').prop('disabled', true);
        
        // Prepare form data
        const formData = form.serialize() + '&form_type=catering';
        
        $.ajax({
            url: 'ajax/quote.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('success', 'Quote Request Sent!', response.message);
                    form[0].reset();
                    // Close modal if it exists
                    if (typeof closeQuoteModal === 'function') {
                        closeQuoteModal();
                    }
                } else {
                    showAlert('error', 'Request Failed', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Catering form error:', error);
                showAlert('error', 'Error', 'Something went wrong. Please try again.');
            },
            complete: function() {
                submitBtn.html(originalBtnContent).prop('disabled', false);
            }
        });
    });

    // Events Quote Form Handler
    $('#eventsQuoteForm').on('submit', function(e) {
        e.preventDefault();
        
        if (!validateEventsForm()) {
            return;
        }
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        const originalBtnContent = submitBtn.html();
        
        // Show loading state
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Processing...').prop('disabled', true);
        
        // Prepare form data
        const formData = form.serialize() + '&form_type=events';
        
        $.ajax({
            url: 'ajax/quote.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('success', 'Quote Request Sent!', response.message);
                    form[0].reset();
                    // Close modal if it exists
                    if (typeof closeEventsModal === 'function') {
                        closeEventsModal();
                    }
                } else {
                    showAlert('error', 'Request Failed', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Events form error:', error);
                showAlert('error', 'Error', 'Something went wrong. Please try again.');
            },
            complete: function() {
                submitBtn.html(originalBtnContent).prop('disabled', false);
            }
        });
    });

    // Logistics Quote Form Handler
    $('#logisticsQuoteForm').on('submit', function(e) {
        e.preventDefault();
        
        if (!validateLogisticsForm()) {
            return;
        }
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        const originalBtnContent = submitBtn.html();
        
        // Show loading state
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Processing...').prop('disabled', true);
        
        // Prepare form data
        const formData = form.serialize() + '&form_type=logistics';
        
        $.ajax({
            url: 'ajax/quote.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('success', 'Quote Request Sent!', response.message);
                    form[0].reset();
                } else {
                    showAlert('error', 'Request Failed', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Logistics form error:', error);
                showAlert('error', 'Error', 'Something went wrong. Please try again.');
            },
            complete: function() {
                submitBtn.html(originalBtnContent).prop('disabled', false);
            }
        });
    });

    // Consulting Quote Form Handler
    $('#consultingQuoteForm').on('submit', function(e) {
        e.preventDefault();
        
        if (!validateConsultingForm()) {
            return;
        }
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        const originalBtnContent = submitBtn.html();
        
        // Show loading state
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Processing...').prop('disabled', true);
        
        // Prepare form data
        const formData = form.serialize() + '&form_type=consulting';
        
        $.ajax({
            url: 'ajax/quote.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('success', 'Quote Request Sent!', response.message);
                    form[0].reset();
                } else {
                    showAlert('error', 'Request Failed', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Consulting form error:', error);
                showAlert('error', 'Error', 'Something went wrong. Please try again.');
            },
            complete: function() {
                submitBtn.html(originalBtnContent).prop('disabled', false);
            }
        });
    });

    // Wellness Consultation Form Handler
    $('#wellnessConsultationForm').on('submit', function(e) {
        e.preventDefault();
        
        if (!validateWellnessForm()) {
            return;
        }
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        const originalBtnContent = submitBtn.html();
        
        // Show loading state
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Processing...').prop('disabled', true);
        
        // Prepare form data
        const formData = form.serialize() + '&form_type=wellness';
        
        $.ajax({
            url: 'ajax/wellness.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('success', 'Consultation Scheduled!', response.message);
                    form[0].reset();
                    // Close modal
                    if (typeof closeWellnessModal === 'function') {
                        closeWellnessModal();
                    }
                } else {
                    showAlert('error', 'Request Failed', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Wellness form error:', error);
                showAlert('error', 'Error', 'Something went wrong. Please try again.');
            },
            complete: function() {
                submitBtn.html(originalBtnContent).prop('disabled', false);
            }
        });
    });

    // FAQ Contact Form Handler
    $('#faqContactForm').on('submit', function(e) {
        e.preventDefault();
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        const originalBtnContent = submitBtn.html();
        
        // Show loading state
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Sending...').prop('disabled', true);
        
        $.ajax({
            url: 'ajax/faq-contact.php',
            type: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('success', 'Question Sent!', response.message);
                    form[0].reset();
                } else {
                    showAlert('error', 'Failed', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('FAQ form error:', error);
                showAlert('error', 'Error', 'Network error. Please try again.');
            },
            complete: function() {
                submitBtn.html(originalBtnContent).prop('disabled', false);
            }
        });
    });

    // Newsletter Subscription Form Handler
    $('#newsletterForm, .newsletter-form').on('submit', function(e) {
        e.preventDefault();
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"], input[type="submit"]');
        const originalBtnContent = submitBtn.val() || submitBtn.html();
        
        // Show loading state
        if (submitBtn.is('input')) {
            submitBtn.val('Subscribing...');
        } else {
            submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Subscribing...');
        }
        submitBtn.prop('disabled', true);
        
        // Get email value
        const email = form.find('input[name="email"], input[type="email"]').val();
        const name = form.find('input[name="name"]').val() || '';
        
        if (!email) {
            showAlert('error', 'Error', 'Please enter your email address.');
            submitBtn.prop('disabled', false);
            if (submitBtn.is('input')) {
                submitBtn.val(originalBtnContent);
            } else {
                submitBtn.html(originalBtnContent);
            }
            return;
        }
        
        $.ajax({
            url: 'ajax/newsletter.php',
            type: 'POST',
            data: {
                email: email,
                name: name,
                source: 'website'
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('success', 'Subscribed!', response.message);
                    form[0].reset();
                } else {
                    showAlert('error', 'Subscription Failed', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Newsletter form error:', error);
                showAlert('error', 'Error', 'Something went wrong. Please try again.');
            },
            complete: function() {
                submitBtn.prop('disabled', false);
                if (submitBtn.is('input')) {
                    submitBtn.val(originalBtnContent);
                } else {
                    submitBtn.html(originalBtnContent);
                }
            }
        });
    });
});

// Form Validation Functions
function validateContactForm() {
    let isValid = true;
    
    // Clear previous errors
    $('.form-input').removeClass('error');
    $('.error-message').remove();
    
    // Validate required fields
    const requiredFields = [
        { id: '#firstName', name: 'First Name' },
        { id: '#lastName', name: 'Last Name' },
        { id: '#email', name: 'Email' },
        { id: '#phone', name: 'Phone' },
        { id: '#subject', name: 'Subject' },
        { id: '#message', name: 'Message' },
        { id: '#serviceType', name: 'Service Type' }
    ];
    
    requiredFields.forEach(field => {
        const value = $(field.id).val().trim();
        if (!value) {
            showFieldError(field.id, `${field.name} is required`);
            isValid = false;
        }
    });
    
    // Validate email format
    const email = $('#email').val().trim();
    if (email && !isValidEmail(email)) {
        showFieldError('#email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone format
    const phone = $('#phone').val().trim();
    if (phone && !isValidPhone(phone)) {
        showFieldError('#phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function validateCateringForm() {
    let isValid = true;
    $('.form-input').removeClass('error');
    $('.error-message').remove();
    
    const requiredFields = [
        { id: '#name', name: 'Name' },
        { id: '#email', name: 'Email' },
        { id: '#phone', name: 'Phone' },
        { id: '#eventType', name: 'Event Type' },
        { id: '#eventDate', name: 'Event Date' },
        { id: '#guestCount', name: 'Guest Count' }
    ];
    
    requiredFields.forEach(field => {
        const value = $(field.id).val().trim();
        if (!value) {
            showFieldError(field.id, `${field.name} is required`);
            isValid = false;
        }
    });
    
    // Validate email and phone
    const email = $('#email').val().trim();
    if (email && !isValidEmail(email)) {
        showFieldError('#email', 'Please enter a valid email address');
        isValid = false;
    }
    
    const phone = $('#phone').val().trim();
    if (phone && !isValidPhone(phone)) {
        showFieldError('#phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate event date (must be in the future)
    const eventDate = $('#eventDate').val();
    if (eventDate) {
        const selectedDate = new Date(eventDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showFieldError('#eventDate', 'Event date must be in the future');
            isValid = false;
        }
    }
    
    // Validate guest count
    const guestCount = parseInt($('#guestCount').val());
    if (guestCount && guestCount < 1) {
        showFieldError('#guestCount', 'Guest count must be at least 1');
        isValid = false;
    }
    
    return isValid;
}

function validateEventsForm() {
    return validateCateringForm(); // Similar validation
}

function validateLogisticsForm() {
    let isValid = true;
    $('.form-input').removeClass('error');
    $('.error-message').remove();
    
    const requiredFields = [
        { id: '#clientName', name: 'Name' },
        { id: '#clientEmail', name: 'Email' },
        { id: '#clientPhone', name: 'Phone' },
        { id: '#serviceType', name: 'Service Type' },
        { id: '#originLocation', name: 'Origin Location' },
        { id: '#destinationLocation', name: 'Destination Location' }
    ];
    
    requiredFields.forEach(field => {
        const value = $(field.id).val().trim();
        if (!value) {
            showFieldError(field.id, `${field.name} is required`);
            isValid = false;
        }
    });
    
    // Validate email and phone
    const email = $('#clientEmail').val().trim();
    if (email && !isValidEmail(email)) {
        showFieldError('#clientEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    const phone = $('#clientPhone').val().trim();
    if (phone && !isValidPhone(phone)) {
        showFieldError('#clientPhone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function validateConsultingForm() {
    let isValid = true;
    $('.form-input').removeClass('error');
    $('.error-message').remove();
    
    const requiredFields = [
        { id: '#clientName', name: 'Name' },
        { id: '#clientEmail', name: 'Email' },
        { id: '#clientPhone', name: 'Phone' },
        { id: '#companyName', name: 'Company Name' },
        { id: '#serviceNeeded', name: 'Service Needed' },
        { id: '#projectDescription', name: 'Project Description' }
    ];
    
    requiredFields.forEach(field => {
        const value = $(field.id).val().trim();
        if (!value) {
            showFieldError(field.id, `${field.name} is required`);
            isValid = false;
        }
    });
    
    // Validate email and phone
    const email = $('#clientEmail').val().trim();
    if (email && !isValidEmail(email)) {
        showFieldError('#clientEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    const phone = $('#clientPhone').val().trim();
    if (phone && !isValidPhone(phone)) {
        showFieldError('#clientPhone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function validateWellnessForm() {
    let isValid = true;
    $('.form-input').removeClass('error');
    $('.error-message').remove();
    
    const requiredFields = [
        { id: '#clientName', name: 'Name' },
        { id: '#clientEmail', name: 'Email' },
        { id: '#clientPhone', name: 'Phone' },
        { id: '#programmeType', name: 'Programme Type' },
        { id: '#urgencyLevel', name: 'Urgency Level' },
        { id: '#mainConcerns', name: 'Main Concerns' }
    ];
    
    requiredFields.forEach(field => {
        const value = $(field.id).val().trim();
        if (!value) {
            showFieldError(field.id, `${field.name} is required`);
            isValid = false;
        }
    });
    
    // Validate email and phone
    const email = $('#clientEmail').val().trim();
    if (email && !isValidEmail(email)) {
        showFieldError('#clientEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    const phone = $('#clientPhone').val().trim();
    if (phone && !isValidPhone(phone)) {
        showFieldError('#clientPhone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate privacy consent
    if (!$('#privacyConsent').is(':checked')) {
        showAlert('warning', 'Privacy Consent Required', 'Please agree to the confidentiality and privacy policies');
        isValid = false;
    }
    
    return isValid;
}

// Helper Functions
function showFieldError(fieldId, message) {
    const field = $(fieldId);
    field.addClass('error');
    
    // Remove existing error message
    field.siblings('.error-message').remove();
    
    // Add error message
    const errorDiv = $(`<div class="error-message">${message}</div>`);
    field.closest('.form-group').append(errorDiv);
    
    // Focus on first error field
    if (!$('.form-input.error').first().is(':focus')) {
        $('.form-input.error').first().focus();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Supports various phone formats including Kenyan numbers
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// SweetAlert helper function
function showAlert(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        showConfirmButton: true,
        timer: icon === 'success' ? 4000 : 6000,
        timerProgressBar: true,
        confirmButtonColor: '#4B002E',
        customClass: {
            popup: 'swal-popup',
            title: 'swal-title',
            content: 'swal-content',
            confirmButton: 'swal-confirm-btn'
        }
    });
}

// Global site URL variable
const siteUrl = window.location.origin + '/mindscope';

// AJAX Forms Handler for Mindscope Services
$(document).ready(function() {
    
    // Newsletter Form Handler (Footer)
    $('#footerNewsletterForm').on('submit', function(e) {
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
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        const originalBtnContent = submitBtn.html();
        
        // Show loading state
        submitBtn.html('<span class="btn-loading">Sending...</span>').prop('disabled', true);
        
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
            error: function() {
                showAlert('error', 'Error', 'Something went wrong. Please try again.');
            },
            complete: function() {
                submitBtn.html('<span class="btn-text">Send Message</span>').prop('disabled', false);
            }
        });
    });

    // Catering Quote Form Handler
    $('#cateringQuoteForm').on('submit', function(e) {
        e.preventDefault();
        
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        const originalBtnContent = submitBtn.html();
        
        // Show loading state
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Processing...').prop('disabled', true);
        
        $.ajax({
            url: 'ajax/quote.php',
            type: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('success', 'Quote Request Sent!', response.message);
                    form[0].reset();
                } else {
                    showAlert('error', 'Request Failed', response.message);
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
            error: function() {
                showAlert('error', 'Error', 'Network error. Please try again.');
            },
            complete: function() {
                submitBtn.html(originalBtnContent).prop('disabled', false);
            }
        });
    });
});

// SweetAlert helper function
function showAlert(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        confirmButtonColor: '#4B002E',
        timer: 5000,
        timerProgressBar: true,
        customClass: {
            popup: 'swal-popup',
            title: 'swal-title',
            content: 'swal-content'
        }
    });
}

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showAlert(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        showConfirmButton: true,
        timer: icon === 'success' ? 3000 : 5000,
        timerProgressBar: true,
        customClass: {
            popup: 'swal-popup',
            title: 'swal-title',
            content: 'swal-content'
        }
    });
}

// Global site URL variable
const siteUrl = window.location.origin + '/mindscope';

// FAQ Contact Form Handler
$(document).ready(function() {
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
            error: function() {
                showAlert('error', 'Error', 'Network error. Please try again.');
            },
            complete: function() {
                submitBtn.html(originalBtnContent).prop('disabled', false);
            }
        });
    });
});

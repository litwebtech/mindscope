/**
 * Consulting Page JavaScript
 * Handles quote modal functionality and consulting-specific interactions
 */

// Quote Modal Functionality
function openQuoteModal() {
    const modal = document.getElementById('quoteModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animate modal in
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('quoteModal');
    if (event.target === modal) {
        closeQuoteModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeQuoteModal();
    }
});

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('consultingQuoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                clientName: formData.get('clientName'),
                clientEmail: formData.get('clientEmail'),
                clientPhone: formData.get('clientPhone'),
                companyName: formData.get('companyName'),
                serviceType: formData.get('serviceType'),
                businessStage: formData.get('businessStage'),
                additionalInfo: formData.get('additionalInfo'),
                service: 'consulting'
            };
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Submit form via AJAX
            fetch('../ajax/quote.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'Consultation Request Sent!',
                        html: `
                            <p><strong>Thank you for your interest in our consulting services!</strong></p>
                            <p>We've received your consultation request and will analyze your business challenges and requirements.</p>
                            <p><strong>What happens next:</strong></p>
                            <ul style="text-align: left; margin: 20px 0;">
                                <li>Our consulting team will review your requirements within 24 hours</li>
                                <li>We'll prepare a customized proposal based on your specific needs</li>
                                <li>You'll receive a detailed quote within 2-3 business days</li>
                                <li>We'll schedule a consultation call to discuss the proposal</li>
                            </ul>
                            <p>For urgent consulting needs, please call us at <strong>+254 700 000 000</strong></p>
                        `,
                        confirmButtonColor: '#E7682E',
                        confirmButtonText: 'Great!'
                    }).then(() => {
                        closeQuoteModal();
                        this.reset();
                    });
                } else {
                    throw new Error(data.message || 'Failed to send consultation request');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please try again or contact us directly.',
                    confirmButtonColor: '#E7682E'
                });
            })
            .finally(() => {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
        });
    }
});

// WhatsApp Quick Contact for Consulting
function contactConsultingWhatsApp() {
    const message = "Hello! I'm interested in your business consulting services. Could you please provide more information about strategic planning and business growth solutions?";
    if (typeof openWhatsApp === 'function') {
        openWhatsApp(message);
    } else {
        const phoneNumber = '254700000000';
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    }
}

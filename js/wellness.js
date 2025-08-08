// Wellness Services Page JavaScript

// Wellness Modal Functionality
function openWellnessModal() {
    const modal = document.getElementById('wellnessModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animate modal in
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeWellnessModal() {
    const modal = document.getElementById('wellnessModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('wellnessModal');
    if (event.target === modal) {
        closeWellnessModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeWellnessModal();
    }
});

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const wellnessForm = document.getElementById('wellnessConsultationForm');
    
    if (wellnessForm) {
        wellnessForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                clientName: formData.get('clientName'),
                clientEmail: formData.get('clientEmail'),
                clientPhone: formData.get('clientPhone'),
                clientAge: formData.get('clientAge'),
                programmeType: formData.get('programmeType'),
                urgencyLevel: formData.get('urgencyLevel'),
                preferredTime: formData.get('preferredTime'),
                previousTherapy: formData.get('previousTherapy'),
                mainConcerns: formData.get('mainConcerns'),
                additionalInfo: formData.get('additionalInfo'),
                privacyConsent: formData.get('privacyConsent'),
                serviceType: 'wellness',
                source: 'wellness_consultation_page'
            };
            
            // Validate required fields
            if (!data.clientName || !data.clientEmail || !data.clientPhone || 
                !data.programmeType || !data.urgencyLevel || !data.mainConcerns || 
                !data.privacyConsent) {
                Swal.fire({
                    icon: 'error',
                    title: 'Required Fields Missing',
                    text: 'Please fill in all required fields before submitting.',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-primary'
                    }
                });
                return;
            }
            
            // Check for crisis level urgency
            if (data.urgencyLevel === 'crisis') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Crisis Support Available Now',
                    html: `
                        <p><strong>We understand you need immediate support.</strong></p>
                        <p>Please call our crisis line immediately:</p>
                        <p style="font-size: 24px; color: #d32f2f; font-weight: bold;">+254 700 000 000</p>
                        <p>Our trained crisis counselors are available 24/7.</p>
                        <p><strong>If you are in immediate danger, please call emergency services at 999 or 112.</strong></p>
                        <hr style="margin: 20px 0;">
                        <p><small>You can also choose to continue with your consultation request, which we will prioritize and respond to within 2 hours.</small></p>
                    `,
                    confirmButtonText: 'Call Crisis Line Now',
                    showCancelButton: true,
                    cancelButtonText: 'Continue with Form',
                    customClass: {
                        confirmButton: 'btn btn-urgent',
                        cancelButton: 'btn btn-secondary'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = 'tel:+254722888385';
                    } else {
                        submitWellnessForm(data);
                    }
                });
                return;
            }
            
            submitWellnessForm(data);
        });
    }
    
    // Initialize wellness page features
    initWellnessFeatures();
});

function submitWellnessForm(data) {
    // Show loading state
    const submitBtn = document.querySelector('#wellnessConsultationForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scheduling...';
    
    // Submit to backend
    fetch('../ajax/wellness-consultation.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            // Close modal
            closeWellnessModal();
            
            // Show success message
            const urgencyMessage = data.urgencyLevel === 'urgent' 
                ? 'Due to the urgent nature of your request, we will contact you within 2 hours.'
                : 'We will contact you within 24 hours to schedule your consultation.';
            
            Swal.fire({
                icon: 'success',
                title: 'Consultation Request Submitted!',
                html: `
                    <div style="text-align: left;">
                        <p><strong>Thank you for taking the first step towards wellness, ${data.clientName}.</strong></p>
                        <p>We've received your consultation request and appreciate your trust in our services.</p>
                        <br>
                        <p><strong>What happens next:</strong></p>
                        <ul style="margin: 15px 0; padding-left: 20px;">
                            <li>${urgencyMessage}</li>
                            <li>We'll discuss your needs and match you with the right practitioner</li>
                            <li>Your first consultation is completely confidential</li>
                            <li>We'll provide you with a personalized wellness plan</li>
                        </ul>
                        <br>
                        <p><strong>Important:</strong> Your journey to wellness is important, and we're here to support you every step of the way.</p>
                        <br>
                        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 8px;">
                            <strong>Need immediate support?</strong><br>
                            Crisis Line: <strong>+254 700 000 000</strong> (24/7)<br>
                            Email: <strong>wellness@mindscope.co.ke</strong>
                        </p>
                    </div>
                `,
                confirmButtonText: 'Thank You',
                customClass: {
                    confirmButton: 'btn btn-primary'
                }
            });
            
            // Reset form
            document.getElementById('wellnessConsultationForm').reset();
            
            // Send WhatsApp message option
            setTimeout(() => {
                contactWellnessWhatsApp(data);
            }, 2000);
            
        } else {
            throw new Error(result.message || 'Failed to submit consultation request');
        }
    })
    .catch(error => {
        console.error('Wellness consultation submission error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            html: `
                <p>We're sorry, but there was an error submitting your consultation request.</p>
                <br>
                <p><strong>Please try one of these alternatives:</strong></p>
                <ul style="text-align: left; margin: 15px 0; padding-left: 20px;">
                    <li>Call us directly at <strong>+254 700 000 000</strong></li>
                    <li>Email us at <strong>wellness@mindscope.co.ke</strong></li>
                    <li>Try submitting the form again in a few minutes</li>
                </ul>
                <br>
                <p style="background-color: #ffebee; padding: 15px; border-radius: 8px; color: #c62828;">
                    <strong>For crisis support, please call immediately: +254 700 000 000</strong>
                </p>
            `,
            confirmButtonText: 'Understood',
            customClass: {
                confirmButton: 'btn btn-primary'
            }
        });
    })
    .finally(() => {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

function contactWellnessWhatsApp(data) {
    const message = `Hello! I just submitted a wellness consultation request through your website.

*My Details:*
Name: ${data.clientName}
Email: ${data.clientEmail}
Phone: ${data.clientPhone}
Programme Interest: ${data.programmeType}
Urgency: ${data.urgencyLevel}
Preferred Time: ${data.preferredTime || 'Not specified'}

*Main Concerns:*
${data.mainConcerns}

${data.additionalInfo ? `*Additional Information:*\n${data.additionalInfo}\n\n` : ''}Please confirm receipt of my consultation request. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/254722888385?text=${encodedMessage}`;
    
    Swal.fire({
        title: 'Quick Contact via WhatsApp',
        html: `
            <p>Would you like to send a quick message via WhatsApp as well?</p>
            <p><small>This will help us get back to you even faster and confirm we received your consultation request.</small></p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Send WhatsApp Message',
        cancelButtonText: 'No, Thanks',
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-secondary'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            window.open(whatsappUrl, '_blank');
        }
    });
}

// Initialize wellness page functionality
function initWellnessFeatures() {
    // Tab functionality for programmes
    setupProgrammeTabs();
    
    // Wellness specific animations
    setupWellnessAnimations();
}

/**
 * Setup Programme Tabs
 */
function setupProgrammeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panels
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(targetTab + '-tab');
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

/**
 * Setup Wellness-specific Animations
 */
function setupWellnessAnimations() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Additional wellness-specific interactions can be added here
}
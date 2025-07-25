/**
 * Consulting Page JavaScript
 * Handles quote modal functionality and consulting-specific interactions
 */

// Global functions for modal control (called from HTML)
function openQuoteModal() {
    showConsultingQuoteModal('Business Consulting');
}

function closeQuoteModal() {
    // Close any open SweetAlert modals
    Swal.close();
}

/**
 * Show Consulting Quote Modal (Global function)
 */
function showConsultingQuoteModal(serviceType) {
    Swal.fire({
        title: 'Request Consulting Quote',
        html: `
            <form id="consultingQuoteForm" class="quote-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="fullName">Full Name *</label>
                        <input type="text" id="fullName" name="fullName" required class="form-input">
                    </div>
                    <div class="form-group">
                        <label for="company">Company/Organization *</label>
                        <input type="text" id="company" name="company" required class="form-input">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" required class="form-input">
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" required class="form-input">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="consultingService">Consulting Service *</label>
                    <select id="consultingService" name="consultingService" required class="form-select">
                        <option value="">Select a service</option>
                        <option value="Strategic Planning" ${serviceType === 'Strategic Planning' ? 'selected' : ''}>Strategic Planning</option>
                        <option value="Operations Management" ${serviceType === 'Operations Management' ? 'selected' : ''}>Operations Management</option>
                        <option value="Financial Advisory" ${serviceType === 'Financial Advisory' ? 'selected' : ''}>Financial Advisory</option>
                        <option value="Human Resources" ${serviceType === 'Human Resources' ? 'selected' : ''}>Human Resources</option>
                        <option value="Digital Transformation" ${serviceType === 'Digital Transformation' ? 'selected' : ''}>Digital Transformation</option>
                        <option value="Risk Management" ${serviceType === 'Risk Management' ? 'selected' : ''}>Risk Management</option>
                        <option value="Other" ${serviceType === 'Other' ? 'selected' : ''}>Other (Please specify)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="companySize">Company Size</label>
                    <select id="companySize" name="companySize" class="form-select">
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="500+">500+ employees</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="industry">Industry</label>
                    <select id="industry" name="industry" class="form-select">
                        <option value="">Select your industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Retail">Retail</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Education">Education</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="projectTimeline">Project Timeline</label>
                    <select id="projectTimeline" name="projectTimeline" class="form-select">
                        <option value="">Select timeline</option>
                        <option value="Immediate">Immediate (Within 1 week)</option>
                        <option value="Short-term">Short-term (1-4 weeks)</option>
                        <option value="Medium-term">Medium-term (1-3 months)</option>
                        <option value="Long-term">Long-term (3+ months)</option>
                        <option value="Ongoing">Ongoing consultation</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="budget">Estimated Budget (Optional)</label>
                    <select id="budget" name="budget" class="form-select">
                        <option value="">Select budget range</option>
                        <option value="Under KES 50,000">Under KES 50,000</option>
                        <option value="KES 50,000 - 200,000">KES 50,000 - 200,000</option>
                        <option value="KES 200,000 - 500,000">KES 200,000 - 500,000</option>
                        <option value="KES 500,000 - 1,000,000">KES 500,000 - 1,000,000</option>
                        <option value="Over KES 1,000,000">Over KES 1,000,000</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="challenges">Current Business Challenges *</label>
                    <textarea id="challenges" name="challenges" required class="form-textarea" rows="3" 
                            placeholder="Describe the main challenges your business is facing..."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="objectives">Desired Outcomes *</label>
                    <textarea id="objectives" name="objectives" required class="form-textarea" rows="3" 
                            placeholder="What specific outcomes do you hope to achieve through consulting?"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="additionalDetails">Additional Details</label>
                    <textarea id="additionalDetails" name="additionalDetails" class="form-textarea" rows="3" 
                            placeholder="Any additional information about your consulting needs..."></textarea>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Request Quote',
        cancelButtonText: 'Cancel',
        width: '800px',
        customClass: {
            container: 'quote-modal-container',
            popup: 'quote-modal-popup',
            title: 'quote-modal-title',
            htmlContainer: 'quote-modal-content',
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-secondary'
        },
        preConfirm: () => {
            const form = document.getElementById('consultingQuoteForm');
            if (form.checkValidity()) {
                return new FormData(form);
            } else {
                form.reportValidity();
                return false;
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            handleConsultingQuoteSubmission(result.value);
        }
    });
}

/**
 * Handle Consulting Quote Form Submission
 */
function handleConsultingQuoteSubmission(formData) {
    // Show loading state
    Swal.fire({
        title: 'Submitting Quote Request',
        text: 'Please wait while we process your consulting quote request...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Convert FormData to object if needed
    const data = formData instanceof FormData ? Object.fromEntries(formData) : formData;
    
    // Add service type for processing
    data.serviceType = 'consulting';
    data.source = 'consulting_page';
    
    // Submit via AJAX
    $.ajax({
        url: '../ajax/quote.php',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Quote Request Submitted!',
                    html: `
                        <p><strong>Thank you for your interest in our consulting services!</strong></p>
                        <p>We've received your quote request and will analyze your business challenges and requirements.</p>
                        <p><strong>What happens next:</strong></p>
                        <ul style="text-align: left; margin: 20px 0;">
                            <li>Our consulting team will review your requirements within 24 hours</li>
                            <li>We'll prepare a customized proposal based on your specific needs</li>
                            <li>You'll receive a detailed quote within 2-3 business days</li>
                            <li>We'll schedule a consultation call to discuss the proposal</li>
                        </ul>
                        <p>For urgent consulting needs, please call us at <strong>+254 700 000 000</strong></p>
                    `,
                    confirmButtonText: 'Got it!',
                    customClass: {
                        confirmButton: 'btn btn-primary'
                    }
                });
            } else {
                throw new Error(response.message || 'Failed to submit quote request');
            }
        },
        error: function(xhr, status, error) {
            console.error('Quote submission error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                html: `
                    <p>We're sorry, but there was an error submitting your quote request.</p>
                    <p><strong>Please try one of these alternatives:</strong></p>
                    <ul style="text-align: left; margin: 20px 0;">
                        <li>Call us directly at <strong>+254 700 000 000</strong></li>
                        <li>Email us at <strong>info@mindscope.co.ke</strong></li>
                        <li>Try submitting the form again in a few minutes</li>
                    </ul>
                `,
                confirmButtonText: 'Understood',
                customClass: {
                    confirmButton: 'btn btn-primary'
                }
            });
        }
    });
}

$(document).ready(function() {
    
    // Initialize consulting page functionality
    initConsultingFeatures();
    
    function initConsultingFeatures() {
        // Quote Modal Event Listeners
        setupQuoteModal();
        
        // Consulting specific animations
        setupConsultingAnimations();
        
        // Service cards interactions
        setupServiceCardHovers();
    }
    
    /**
     * Setup Quote Modal for Consulting Services
     */
    function setupQuoteModal() {
        // Get Quote button click handler
        $(document).on('click', '.quote-btn, .get-quote-btn', function(e) {
            e.preventDefault();
            
            // Get service type if specified
            const serviceType = $(this).data('service') || 'Business Consulting';
            
            // Show quote modal with consulting-specific content
            showConsultingQuoteModal(serviceType);
        });
        
        // Quote form submission
        $(document).on('submit', '#consultingQuoteForm', function(e) {
            e.preventDefault();
            handleConsultingQuoteSubmission(this);
        });
    }
    
    /**
     * Setup Consulting-specific Animations
     */
    function setupConsultingAnimations() {
        // Add scroll-triggered animations for consulting elements
        $(window).scroll(function() {
            const scrollTop = $(window).scrollTop();
            const windowHeight = $(window).height();
            
            // Animate service cards
            $('.service-card').each(function() {
                const elementTop = $(this).offset().top;
                if (scrollTop + windowHeight > elementTop + 100) {
                    $(this).addClass('animate-in');
                }
            });
            
            // Animate consultation process steps
            $('.process-step').each(function() {
                const elementTop = $(this).offset().top;
                if (scrollTop + windowHeight > elementTop + 100) {
                    $(this).addClass('step-visible');
                }
            });
        });
    }
    
    /**
     * Setup Service Card Hover Effects
     */
    function setupServiceCardHovers() {
        $('.service-card').hover(
            function() {
                $(this).addClass('card-hover');
            },
            function() {
                $(this).removeClass('card-hover');
            }
        );
    }
    
});

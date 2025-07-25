/**
 * Events Page JavaScript
 * Handles quote modal functionality and events-specific interactions
 */

$(document).ready(function() {
    
    // Initialize events page functionality
    initEventsFeatures();
    
    function initEventsFeatures() {
        // Quote Modal Event Listeners
        setupQuoteModal();
        
        // Events specific animations
        setupEventsAnimations();
        
        // Service cards interactions
        setupServiceCardHovers();
    }
    
    /**
     * Setup Quote Modal for Event Services
     */
    function setupQuoteModal() {
        // Get Quote button click handler
        $(document).on('click', '.quote-btn, .get-quote-btn', function(e) {
            e.preventDefault();
            
            // Get event type if specified
            const eventType = $(this).data('event') || 'Corporate Event';
            
            // Show quote modal with events-specific content
            showEventsQuoteModal(eventType);
        });
        
        // Quote form submission
        $(document).on('submit', '#eventsQuoteForm', function(e) {
            e.preventDefault();
            handleEventsQuoteSubmission(this);
        });
    }
    
    /**
     * Show Events Quote Modal
     */
    function showEventsQuoteModal(eventType) {
        Swal.fire({
            title: 'Request Event Quote',
            html: `
                <form id="eventsQuoteForm" class="quote-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="fullName">Full Name *</label>
                            <input type="text" id="fullName" name="fullName" required class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="organization">Organization/Company</label>
                            <input type="text" id="organization" name="organization" class="form-input">
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
                        <label for="eventType">Event Type *</label>
                        <select id="eventType" name="eventType" required class="form-select">
                            <option value="">Select event type</option>
                            <option value="Corporate Event" ${eventType === 'Corporate Event' ? 'selected' : ''}>Corporate Event</option>
                            <option value="Wedding" ${eventType === 'Wedding' ? 'selected' : ''}>Wedding</option>
                            <option value="Social Event" ${eventType === 'Social Event' ? 'selected' : ''}>Social Event</option>
                            <option value="Conference" ${eventType === 'Conference' ? 'selected' : ''}>Conference/Summit</option>
                            <option value="Product Launch" ${eventType === 'Product Launch' ? 'selected' : ''}>Product Launch</option>
                            <option value="Other" ${eventType === 'Other' ? 'selected' : ''}>Other (Please specify)</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="eventDate">Preferred Event Date *</label>
                            <input type="date" id="eventDate" name="eventDate" required class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="guestCount">Expected Guests *</label>
                            <input type="number" id="guestCount" name="guestCount" required class="form-input" min="1">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="venue">Preferred Venue</label>
                        <input type="text" id="venue" name="venue" class="form-input" placeholder="Leave blank if you need venue recommendations">
                    </div>
                    
                    <div class="form-group">
                        <label for="budget">Estimated Budget</label>
                        <select id="budget" name="budget" class="form-select">
                            <option value="">Select budget range</option>
                            <option value="Under KES 100,000">Under KES 100,000</option>
                            <option value="KES 100,000 - 500,000">KES 100,000 - 500,000</option>
                            <option value="KES 500,000 - 1,000,000">KES 500,000 - 1,000,000</option>
                            <option value="KES 1,000,000 - 2,000,000">KES 1,000,000 - 2,000,000</option>
                            <option value="Over KES 2,000,000">Over KES 2,000,000</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="services">Required Services</label>
                        <div class="checkbox-group">
                            <label class="checkbox-item">
                                <input type="checkbox" name="services[]" value="Venue Selection"> Venue Selection
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" name="services[]" value="Catering"> Catering Services
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" name="services[]" value="Audio Visual"> Audio Visual Setup
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" name="services[]" value="Photography"> Photography/Videography
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" name="services[]" value="Entertainment"> Entertainment
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" name="services[]" value="Decoration"> Decoration & Theming
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" name="services[]" value="Transportation"> Transportation
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" name="services[]" value="Security"> Security Services
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="eventDetails">Event Details & Special Requirements *</label>
                        <textarea id="eventDetails" name="eventDetails" required class="form-textarea" rows="4" 
                                placeholder="Please describe your event vision, theme, special requirements, and any other important details..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="additionalInfo">Additional Information</label>
                        <textarea id="additionalInfo" name="additionalInfo" class="form-textarea" rows="3" 
                                placeholder="Any other information you'd like us to know..."></textarea>
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
                const form = document.getElementById('eventsQuoteForm');
                if (form.checkValidity()) {
                    return new FormData(form);
                } else {
                    form.reportValidity();
                    return false;
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleEventsQuoteSubmission(result.value);
            }
        });
    }
    
    /**
     * Handle Events Quote Form Submission
     */
    function handleEventsQuoteSubmission(formData) {
        // Show loading state
        Swal.fire({
            title: 'Submitting Quote Request',
            text: 'Please wait while we process your event quote request...',
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
        data.serviceType = 'events';
        data.source = 'events_page';
        
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
                            <p><strong>Thank you for choosing Mindscope for your event!</strong></p>
                            <p>We've received your event quote request and are excited to help make your vision a reality.</p>
                            <p><strong>What happens next:</strong></p>
                            <ul style="text-align: left; margin: 20px 0;">
                                <li>Our event planning team will review your requirements within 4 hours</li>
                                <li>We'll prepare a detailed proposal with timeline and pricing</li>
                                <li>You'll receive a comprehensive quote within 24 hours</li>
                                <li>We'll schedule a consultation to discuss your event in detail</li>
                            </ul>
                            <p>For urgent event planning needs, please call us at <strong>+254 700 000 000</strong></p>
                        `,
                        confirmButtonText: 'Perfect!',
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
    
    /**
     * Setup Events-specific Animations
     */
    function setupEventsAnimations() {
        // Add scroll-triggered animations for events elements
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
            
            // Animate timeline items
            $('.timeline-item').each(function() {
                const elementTop = $(this).offset().top;
                if (scrollTop + windowHeight > elementTop + 100) {
                    $(this).addClass('timeline-visible');
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
    
    // Global functions for modal (needed for onclick handlers)
    window.openQuoteModal = function() {
        showEventsQuoteModal('Corporate Event');
    };
    
    window.closeQuoteModal = function() {
        $('#quoteModal').hide();
    };
    
});

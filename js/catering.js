// Catering Services Page JavaScript

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

// Gallery Lightbox Functionality
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });
}

function openLightbox(index) {
    const images = document.querySelectorAll('.gallery-item img');
    const lightbox = createLightboxHTML();
    document.body.appendChild(lightbox);
    
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const counter = lightbox.querySelector('.lightbox-counter');
    let currentIndex = index;
    
    function showImage(imgIndex) {
        lightboxImg.src = images[imgIndex].src;
        lightboxImg.alt = images[imgIndex].alt;
        counter.textContent = `${imgIndex + 1} / ${images.length}`;
    }
    
    showImage(currentIndex);
    
    // Navigation
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });
    
    lightbox.querySelector('.lightbox-next').addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });
    
    // Close lightbox
    lightbox.querySelector('.lightbox-close').addEventListener('click', function() {
        closeLightbox(lightbox);
    });
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox(lightbox);
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function handleKeydown(e) {
        switch(e.key) {
            case 'Escape':
                closeLightbox(lightbox);
                break;
            case 'ArrowLeft':
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(currentIndex);
                break;
            case 'ArrowRight':
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
                break;
        }
    });
    
    lightbox.handleKeydown = handleKeydown;
}

function createLightboxHTML() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-image" src="" alt="">
            <div class="lightbox-controls">
                <button class="lightbox-prev">&#10094;</button>
                <button class="lightbox-next">&#10095;</button>
            </div>
            <div class="lightbox-counter"></div>
        </div>
    `;
    return lightbox;
}

function closeLightbox(lightbox) {
    lightbox.classList.remove('show');
    document.removeEventListener('keydown', lightbox.handleKeydown);
    setTimeout(() => {
        if (lightbox.parentNode) {
            lightbox.parentNode.removeChild(lightbox);
        }
    }, 300);
}

// Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('cateringQuoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateQuoteForm()) {
                submitQuoteForm();
            }
        });
    }
    
    // Initialize gallery lightbox
    initGalleryLightbox();
    
    // Add hover effects to service cards
    initServiceCardEffects();
});

function validateQuoteForm() {
    const form = document.getElementById('cateringQuoteForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(input);
            
            // Specific validations
            if (input.type === 'email' && !isValidEmail(input.value)) {
                showFieldError(input, 'Please enter a valid email address');
                isValid = false;
            }
            
            if (input.type === 'tel' && !isValidPhone(input.value)) {
                showFieldError(input, 'Please enter a valid phone number');
                isValid = false;
            }
            
            if (input.type === 'date') {
                const selectedDate = new Date(input.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    showFieldError(input, 'Please select a future date');
                    isValid = false;
                }
            }
            
            if (input.type === 'number' && parseInt(input.value) < 1) {
                showFieldError(input, 'Number of guests must be at least 1');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function submitQuoteForm() {
    const form = document.getElementById('cateringQuoteForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const quoteData = {};
    
    for (let [key, value] of formData.entries()) {
        quoteData[key] = value;
    }
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Thank you! Your catering quote request has been submitted successfully. We will contact you within 24 hours.', 'success');
        
        // Reset form and close modal
        form.reset();
        clearAllFieldErrors();
        closeQuoteModal();
        
        // Log quote data (in real implementation, send to server)
        console.log('Quote request submitted:', quoteData);
    }, 2000);
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');
    
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
    errorFields.forEach(field => field.classList.remove('error'));
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidPhone(phone) {
    const regex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return regex.test(phone);
}

// Service Card Hover Effects
function initServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover-active');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover-active');
        });
    });
}

// Testimonials Auto-rotation
function initTestimonialsRotation() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    if (testimonialCards.length > 1) {
        setInterval(() => {
            testimonialCards[currentTestimonial].classList.remove('active');
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            testimonialCards[currentTestimonial].classList.add('active');
        }, 5000);
        
        // Initialize first testimonial as active
        testimonialCards[0].classList.add('active');
    }
}

// Smooth reveal animations for gallery
function initGalleryAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                entry.target.classList.add('reveal');
            }
        });
    }, {
        threshold: 0.1
    });
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        observer.observe(item);
    });
}

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initTestimonialsRotation();
    initGalleryAnimations();
    
    // Initialize Professional Slideshow
    const slideshowElement = document.querySelector('.professional-slideshow');
    if (slideshowElement && typeof ProfessionalSlideshow !== 'undefined') {
        new ProfessionalSlideshow(slideshowElement, {
            autoPlay: true,
            autoPlayDelay: 6000,
            showProgress: true,
            showDots: true,
            showArrows: true
        });
    }
});

// // Service comparison functionality
// function initServiceComparison() {
//     const compareBtn = document.createElement('button');
//     compareBtn.className = 'btn btn-outline compare-services-btn';
//     compareBtn.textContent = 'Compare Services';
//     compareBtn.onclick = showServiceComparison;
    
//     const serviceSection = document.querySelector('.our-services .container');
//     if (serviceSection) {
//         serviceSection.appendChild(compareBtn);
//     }
// }

function showServiceComparison() {
    const modal = document.createElement('div');
    modal.className = 'modal comparison-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Service Comparison</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Event Catering</th>
                                <th>Packed Meals</th>
                                <th>Weekly Plans</th>
                                <th>Chef Services</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Setup Required</td>
                                <td>✓</td>
                                <td>✗</td>
                                <td>✗</td>
                                <td>✓</td>
                            </tr>
                            <tr>
                                <td>On-site Service</td>
                                <td>✓</td>
                                <td>✗</td>
                                <td>✗</td>
                                <td>✓</td>
                            </tr>
                            <tr>
                                <td>Customizable Menu</td>
                                <td>✓</td>
                                <td>Limited</td>
                                <td>✓</td>
                                <td>✓</td>
                            </tr>
                            <tr>
                                <td>Advance Booking</td>
                                <td>Required</td>
                                <td>1-2 days</td>
                                <td>Weekly</td>
                                <td>Required</td>
                            </tr>
                            <tr>
                                <td>Best For</td>
                                <td>Large Events</td>
                                <td>Meetings</td>
                                <td>Regular Meals</td>
                                <td>Special Events</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Add service comparison on page load
document.addEventListener('DOMContentLoaded', function() {
    initServiceComparison();
});

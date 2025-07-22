// Footer functionality for Mindscope Services
document.addEventListener('DOMContentLoaded', function() {
    // Newsletter subscription functionality
    const newsletterForm = document.querySelector('.newsletter-signup .input-group');
    const emailInput = document.querySelector('.newsletter-signup .form-input');
    const subscribeBtn = document.querySelector('.newsletter-signup .btn');
    
    if (newsletterForm) {
        // Handle newsletter subscription
        function handleNewsletterSubmission(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            // Basic email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            subscribeBtn.disabled = true;
            
            // Simulate API call (replace with actual newsletter service)
            setTimeout(() => {
                // Reset button
                subscribeBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
                subscribeBtn.disabled = false;
                
                // Show success message
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
                
                // You can integrate with actual newsletter services like:
                // - Mailchimp API
                // - SendGrid
                // - EmailJS
                // - Your own backend service
                
            }, 2000);
        }
        
        // Add event listeners
        subscribeBtn.addEventListener('click', handleNewsletterSubmission);
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleNewsletterSubmission(e);
            }
        });
    }
    
    // Social media links tracking
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.classList[1]; // Get the platform class
            console.log(`Social media click: ${platform}`);
            
            // You can add analytics tracking here
            // gtag('event', 'social_click', {
            //     'platform': platform,
            //     'page_location': window.location.href
            // });
        });
    });
    
    // Footer CTA buttons functionality
    const ctaButtons = document.querySelectorAll('.footer-cta-buttons .btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            console.log(`Footer CTA clicked: ${buttonText}`);
            
            // Handle different CTA actions
            if (buttonText.includes('Quote')) {
                // Scroll to contact form or open modal
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    // If not on homepage, redirect to contact page
                    window.location.href = 'contact.html';
                }
            } else if (buttonText.includes('Portfolio')) {
                window.location.href = 'portfolio.html';
            }
        });
    });
    
    // Smooth scrolling for footer links
    const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Contact info click handlers
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Phone number clicked:', this.getAttribute('href'));
        });
    });
    
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Email clicked:', this.getAttribute('href'));
        });
    });
    
    // Footer animations on scroll
    const footerElements = document.querySelectorAll('.footer-section, .footer-about, .contact-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Initialize footer animations
    footerElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        footerObserver.observe(element);
    });
    
    // Payment method icons interaction
    const paymentIcons = document.querySelectorAll('.payment-methods i');
    paymentIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Certificate badges interaction
    const certificateItems = document.querySelectorAll('.certificate-item');
    certificateItems.forEach(item => {
        item.addEventListener('click', function() {
            const certType = this.textContent.trim();
            console.log(`Certificate clicked: ${certType}`);
            
            // You can open modal with certificate details or redirect to verification page
            showCertificateDetails(certType);
        });
    });
});

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 400px;
            }
            
            .notification-success {
                background: #10b981;
                color: white;
            }
            
            .notification-error {
                background: #ef4444;
                color: white;
            }
            
            .notification-info {
                background: #3b82f6;
                color: white;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-left: auto;
                opacity: 0.8;
                padding: 0.25rem;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

function showCertificateDetails(certType) {
    const certificateInfo = {
        'ISO 9001:2015': {
            title: 'ISO 9001:2015 Quality Management',
            description: 'International standard for quality management systems ensuring consistent delivery of products and services.',
            issuer: 'International Organization for Standardization',
            validUntil: '2025-12-31'
        },
        'HACCP Certified': {
            title: 'HACCP Food Safety Certification',
            description: 'Hazard Analysis and Critical Control Points certification for food safety management.',
            issuer: 'Kenya Bureau of Standards',
            validUntil: '2025-06-30'
        },
        'Licensed Caterer': {
            title: 'Licensed Commercial Caterer',
            description: 'Official license to operate as a commercial catering service in Kenya.',
            issuer: 'County Government of Nairobi',
            validUntil: '2024-12-31'
        }
    };
    
    const info = certificateInfo[certType];
    if (info) {
        showNotification(`${info.title} - Valid until ${info.validUntil}`, 'info');
    }
}

// Newsletter service integration helpers
function integrateMailchimp(email) {
    // Example Mailchimp integration
    // Replace with your actual Mailchimp API details
    const MAILCHIMP_API_KEY = 'your-api-key';
    const LIST_ID = 'your-list-id';
    
    // This should be handled by your backend for security
    console.log('Integrating with Mailchimp for email:', email);
}

function integrateEmailJS(email) {
    // Example EmailJS integration
    // Include EmailJS library: https://www.emailjs.com/
    
    const templateParams = {
        user_email: email,
        to_email: 'info@mindscopeservices.com'
    };
    
    // emailjs.send('your_service_id', 'your_template_id', templateParams)
    //     .then(function(response) {
    //         console.log('Newsletter subscription successful', response);
    //     }, function(error) {
    //         console.log('Newsletter subscription failed', error);
    //     });
}

// Export functions for use in other files
window.FooterUtils = {
    showNotification,
    isValidEmail,
    showCertificateDetails
};

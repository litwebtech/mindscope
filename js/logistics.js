// Logistics Services Page JavaScript

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
    const quoteForm = document.getElementById('logisticsQuoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                clientName: formData.get('clientName'),
                clientEmail: formData.get('clientEmail'),
                clientPhone: formData.get('clientPhone'),
                serviceType: formData.get('serviceType'),
                originLocation: formData.get('originLocation'),
                destinationLocation: formData.get('destinationLocation'),
                additionalInfo: formData.get('additionalInfo'),
                service: 'logistics'
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
                        title: 'Quote Request Sent!',
                        text: 'Thank you for your interest in our logistics services. We\'ll get back to you within 24 hours with a detailed quote.',
                        confirmButtonColor: '#E7682E',
                        confirmButtonText: 'Great!'
                    }).then(() => {
                        closeQuoteModal();
                        this.reset();
                    });
                } else {
                    throw new Error(data.message || 'Failed to send quote request');
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

// WhatsApp Quick Contact for Logistics
function contactLogisticsWhatsApp() {
    const message = "Hello! I'm interested in your logistics and transport services. Could you please provide more information?";
    if (typeof openWhatsApp === 'function') {
        openWhatsApp(message);
    } else {
        const phoneNumber = '254700000000';
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    }
}

// Service comparison functionality
function showServiceComparison() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>Logistics Services Comparison</h3>
                <span class="close" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto';">&times;</span>
            </div>
            <div class="modal-body">
                <div class="comparison-table">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Express Delivery</th>
                                <th>Freight Transport</th>
                                <th>Corporate Transport</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Delivery Time</strong></td>
                                <td>Same/Next Day</td>
                                <td>2-5 Days</td>
                                <td>On Schedule</td>
                            </tr>
                            <tr>
                                <td><strong>Package Size</strong></td>
                                <td>Small to Medium</td>
                                <td>Large/Bulk</td>
                                <td>Passengers</td>
                            </tr>
                            <tr>
                                <td><strong>Tracking</strong></td>
                                <td>Real-time GPS</td>
                                <td>GPS + Checkpoints</td>
                                <td>Live Updates</td>
                            </tr>
                            <tr>
                                <td><strong>Best For</strong></td>
                                <td>Urgent Documents</td>
                                <td>Industrial Goods</td>
                                <td>Business Travel</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

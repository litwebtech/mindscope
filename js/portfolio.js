// Portfolio page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize portfolio functionality
    initializePortfolioFilter();
    initializePortfolioModal();
    initializeTestimonialsCarousel();
    initializeStatsCounter();
});

// Portfolio filter functionality
function initializePortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Portfolio modal functionality
function initializePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePortfolioModal();
        }
    });

    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closePortfolioModal();
        }
    });
}

// Open portfolio modal with project details
function openPortfolioModal(projectId) {
    const modal = document.getElementById('portfolioModal');
    const modalContent = document.getElementById('portfolioModalContent');
    
    // Get project data
    const projectData = getProjectData(projectId);
    
    // Populate modal content
    modalContent.innerHTML = `
        <div class="portfolio-modal-header">
            <h2>${projectData.title}</h2>
            <p class="project-category">${projectData.category}</p>
        </div>
        
        <div class="portfolio-modal-gallery">
            <div class="main-image">
                <img src="${projectData.mainImage}" alt="${projectData.title}">
            </div>
            <div class="thumbnail-gallery">
                ${projectData.gallery.map(img => `
                    <img src="${img}" alt="Project gallery" onclick="changeMainImage('${img}')">
                `).join('')}
            </div>
        </div>
        
        <div class="portfolio-modal-details">
            <div class="project-description">
                <h3>Project Overview</h3>
                <p>${projectData.description}</p>
            </div>
            
            <div class="project-info">
                <h3>Project Details</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Client:</strong>
                        <span>${projectData.client}</span>
                    </div>
                    <div class="info-item">
                        <strong>Duration:</strong>
                        <span>${projectData.duration}</span>
                    </div>
                    <div class="info-item">
                        <strong>Team Size:</strong>
                        <span>${projectData.teamSize}</span>
                    </div>
                    <div class="info-item">
                        <strong>Budget:</strong>
                        <span>${projectData.budget}</span>
                    </div>
                </div>
            </div>
            
            <div class="project-results">
                <h3>Results & Impact</h3>
                <ul>
                    ${projectData.results.map(result => `<li>${result}</li>`).join('')}
                </ul>
            </div>
            
            <div class="project-testimonial">
                <blockquote>
                    "${projectData.testimonial.quote}"
                </blockquote>
                <cite>— ${projectData.testimonial.author}, ${projectData.testimonial.position}</cite>
            </div>
        </div>
        
        <div class="portfolio-modal-actions">
            <button class="btn btn-primary" onclick="requestSimilarService('${projectData.category}')">
                Request Similar Service
            </button>
            <button class="btn btn-outline" onclick="shareProject('${projectId}')">
                Share Project
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close portfolio modal
function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Change main image in modal gallery
function changeMainImage(imageSrc) {
    const mainImage = document.querySelector('.main-image img');
    mainImage.src = imageSrc;
}

// Get project data (in a real app, this would come from an API)
function getProjectData(projectId) {
    const projects = {
        'catering-1': {
            title: 'TechHub Annual Conference',
            category: 'Corporate Catering',
            mainImage: 'assets/images/portfolio/catering-1-large.jpg',
            gallery: [
                'assets/images/portfolio/catering-1-1.jpg',
                'assets/images/portfolio/catering-1-2.jpg',
                'assets/images/portfolio/catering-1-3.jpg'
            ],
            description: 'A large-scale corporate catering event for TechHub\'s annual conference, serving over 500 technology professionals over two days. The event featured multiple meal services, networking breaks, and special dietary accommodations.',
            client: 'TechHub Nairobi',
            duration: '2 Days',
            teamSize: '15 Staff Members',
            budget: 'KES 800,000',
            results: [
                '500+ guests served across two days',
                '99% positive feedback on food quality',
                'Zero food safety incidents',
                'Successful accommodation of 50+ special dietary requirements',
                'Client secured repeat booking for next year'
            ],
            testimonial: {
                quote: 'The catering team exceeded our expectations. Professional, delicious, and perfectly coordinated.',
                author: 'Sarah Kimani',
                position: 'CEO, TechHub Nairobi'
            }
        },
        'event-1': {
            title: 'Elegant Garden Wedding',
            category: 'Wedding Event Management',
            mainImage: 'assets/images/portfolio/event-1-large.jpg',
            gallery: [
                'assets/images/portfolio/event-1-1.jpg',
                'assets/images/portfolio/event-1-2.jpg',
                'assets/images/portfolio/event-1-3.jpg'
            ],
            description: 'Complete wedding planning and coordination for an elegant garden ceremony and reception. Services included venue setup, vendor coordination, timeline management, and day-of coordination.',
            client: 'The Johnsons',
            duration: '6 Months Planning + Event Day',
            teamSize: '8 Staff Members',
            budget: 'KES 1,200,000',
            results: [
                '150 guests celebrated seamlessly',
                'Perfect timeline execution with zero delays',
                'Successful coordination of 12 vendors',
                'Beautiful garden venue transformation',
                'Couple\'s dream wedding brought to life'
            ],
            testimonial: {
                quote: 'Our wedding day was absolutely perfect. Every detail was flawlessly executed.',
                author: 'Mary Johnson',
                position: 'Bride'
            }
        },
        'consulting-1': {
            title: 'SME Growth Strategy',
            category: 'Business Consulting',
            mainImage: 'assets/images/portfolio/consulting-1-large.jpg',
            gallery: [
                'assets/images/portfolio/consulting-1-1.jpg',
                'assets/images/portfolio/consulting-1-2.jpg',
                'assets/images/portfolio/consulting-1-3.jpg'
            ],
            description: 'Strategic business consulting for a local SME looking to expand operations. Comprehensive analysis, strategic planning, and implementation support for sustainable growth.',
            client: 'GreenTech Solutions',
            duration: '4 Months',
            teamSize: '3 Consultants',
            budget: 'KES 400,000',
            results: [
                '40% increase in operational efficiency',
                'Successful market expansion into 2 new regions',
                '25% revenue growth within 6 months',
                'Streamlined business processes',
                'Improved team productivity and satisfaction'
            ],
            testimonial: {
                quote: 'The strategic insights transformed our business. We\'re now operating more efficiently than ever.',
                author: 'Peter Mwangi',
                position: 'CEO, GreenTech Solutions'
            }
        },
        'logistics-1': {
            title: 'Corporate Fleet Management',
            category: 'Transport & Logistics',
            mainImage: 'assets/images/portfolio/logistics-1-large.jpg',
            gallery: [
                'assets/images/portfolio/logistics-1-1.jpg',
                'assets/images/portfolio/logistics-1-2.jpg',
                'assets/images/portfolio/logistics-1-3.jpg'
            ],
            description: 'Comprehensive transport solution for a multinational company including fleet management, driver services, route optimization, and maintenance coordination.',
            client: 'Global Dynamics Corp',
            duration: 'Ongoing (2+ Years)',
            teamSize: '20 Staff Members',
            budget: 'KES 2,000,000/month',
            results: [
                '50-vehicle fleet managed daily',
                '30% reduction in transport costs',
                '99.5% on-time performance rate',
                'Zero major safety incidents',
                'Improved employee satisfaction with transport services'
            ],
            testimonial: {
                quote: 'Reliable, professional, and cost-effective. Mindscope has transformed our transport operations.',
                author: 'James Ochieng',
                position: 'Operations Director, Global Dynamics Corp'
            }
        },
        'catering-2': {
            title: 'Weekly Office Meal Program',
            category: 'Corporate Catering',
            mainImage: 'assets/images/portfolio/catering-2-large.jpg',
            gallery: [
                'assets/images/portfolio/catering-2-1.jpg',
                'assets/images/portfolio/catering-2-2.jpg',
                'assets/images/portfolio/catering-2-3.jpg'
            ],
            description: 'Ongoing weekly meal program for a tech company, providing healthy, varied, and delicious meals for employees. Focus on nutrition, variety, and accommodation of dietary preferences.',
            client: 'InnovateTech Hub',
            duration: 'Ongoing (18+ Months)',
            teamSize: '6 Staff Members',
            budget: 'KES 150,000/week',
            results: [
                '80+ employees served weekly',
                '95% employee satisfaction rate',
                'Improved workplace nutrition and wellness',
                'Reduced employee lunch break time',
                'Enhanced team bonding during meal times'
            ],
            testimonial: {
                quote: 'The meal program has significantly improved our workplace culture and employee wellness.',
                author: 'Linda Waweru',
                position: 'HR Director, InnovateTech Hub'
            }
        },
        'event-2': {
            title: 'Tech Product Launch',
            category: 'Corporate Event Management',
            mainImage: 'assets/images/portfolio/event-2-large.jpg',
            gallery: [
                'assets/images/portfolio/event-2-1.jpg',
                'assets/images/portfolio/event-2-2.jpg',
                'assets/images/portfolio/event-2-3.jpg'
            ],
            description: 'High-profile product launch event for a leading tech company. Comprehensive event planning including venue selection, technical setup, media coordination, and attendee management.',
            client: 'TechForward Inc.',
            duration: '3 Months Planning + Event Day',
            teamSize: '12 Staff Members',
            budget: 'KES 1,500,000',
            results: [
                '300+ attendees including media and industry leaders',
                'Flawless technical presentations and demos',
                'Significant media coverage and social media buzz',
                'Successful product positioning in the market',
                'Lead generation exceeding client expectations'
            ],
            testimonial: {
                quote: 'The launch event was a huge success. Professional execution that elevated our brand.',
                author: 'David Kamau',
                position: 'Marketing Director, TechForward Inc.'
            }
        }
    };

    return projects[projectId] || {
        title: 'Project Not Found',
        category: 'Unknown',
        mainImage: 'assets/images/placeholder.jpg',
        gallery: [],
        description: 'Project details not available.',
        client: 'N/A',
        duration: 'N/A',
        teamSize: 'N/A',
        budget: 'N/A',
        results: [],
        testimonial: {
            quote: 'No testimonial available.',
            author: 'Unknown',
            position: 'Unknown'
        }
    };
}

// Request similar service
function requestSimilarService(category) {
    const serviceUrls = {
        'Corporate Catering': 'services/catering.html',
        'Wedding Event Management': 'services/events.html',
        'Business Consulting': 'services/consulting.html',
        'Transport & Logistics': 'services/logistics.html',
        'Corporate Event Management': 'services/events.html'
    };

    const url = serviceUrls[category] || 'contact.html';
    window.location.href = url;
}

// Share project
function shareProject(projectId) {
    const projectData = getProjectData(projectId);
    const shareText = `Check out this amazing project by Mindscope Services Ltd: ${projectData.title}`;
    const shareUrl = `${window.location.origin}${window.location.pathname}#${projectId}`;

    if (navigator.share) {
        navigator.share({
            title: projectData.title,
            text: shareText,
            url: shareUrl
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${shareText} - ${shareUrl}`).then(() => {
            showNotification('Project link copied to clipboard!');
        }).catch(err => {
            console.log('Error copying to clipboard:', err);
        });
    }
}

// Testimonials carousel functionality
function initializeTestimonialsCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });

    // Auto-advance carousel
    setInterval(nextSlide, 8000);
}

// Stats counter animation
function initializeStatsCounter() {
    const counters = document.querySelectorAll('.counter');
    const animationDuration = 2000; // 2 seconds

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });

    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / (animationDuration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

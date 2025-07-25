/**
 * Professional Slideshow Component
 * Mindscope Services Ltd
 */

class ProfessionalSlideshow {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoPlay: true,
            autoPlayDelay: 5000,
            showProgress: true,
            showDots: true,
            showArrows: true,
            fadeTransition: true,
            ...options
        };
        
        this.currentSlide = 0;
        this.slides = [];
        this.isPlaying = false;
        this.autoPlayTimer = null;
        this.progressTimer = null;
        
        this.init();
    }
    
    init() {
        this.createSlideshow();
        this.bindEvents();
        
        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }
    
    createSlideshow() {
        // Sample images from Google Photos album with fallbacks
        const slidesData = [
            {
                src: 'https://lh3.googleusercontent.com/pw/AP1GczNKhV9_8YTnQgI6zWmB5kR3vL2xJ9mEpA7sFdHwC8nK5oP4vR6tU2iY1qW3eZ5xA7bN9mL0pK3jH6gF8dC2vE4nM7qR9tU1wY5zA8bL3pN6mK2jH9gF1dC4vE7nM0qR3tU6wY9zA2bL5pN8mK1jH4gF7dC0vE3nM6qR9t=w800-h600-no?authuser=0',
                title: 'Elegant Event Catering',
                description: 'Professional setup for corporate events and conferences'
            },
            {
                src: 'https://lh3.googleusercontent.com/pw/AP1GczMpK4nR7vE1qW6tY3zA9bL2pN5mK8jH1gF4dC7vE0nM3qR6tU9wY2zA5bL8pN1mK4jH7gF0dC3vE6nM9qR2tU5wY8zA1bL4pN7mK0jH3gF6dC9vE2nM5qR8tU1wY4zA7bL0pN3mK6jH9gF2dC5vE8nM1qR4t=w800-h600-no?authuser=0',
                title: 'Gourmet Cuisine',
                description: 'Fresh ingredients and exceptional culinary craftsmanship'
            },
            {
                src: 'https://lh3.googleusercontent.com/pw/AP1GczOL3pN6mK9jH2gF5dC8vE1nM4qR7tU0wY3zA6bL9pN2mK5jH8gF1dC4vE7nM0qR3tU6wY9zA2bL5pN8mK1jH4gF7dC0vE3nM6qR9tU2wY5zA8bL1pN4mK7jH0gF3dC6vE9nM2qR5tU8w=w800-h600-no?authuser=0',
                title: 'Professional Service',
                description: 'Trained staff ensuring exceptional service quality'
            },
            {
                src: 'https://lh3.googleusercontent.com/pw/AP1GczP8mK1jH4gF7dC0vE3nM6qR9tU2wY5zA8bL1pN4mK7jH0gF3dC6vE9nM2qR5tU8wY1zA4bL7pN0mK3jH6gF9dC2vE5nM8qR1tU4wY7zA0bL3pN6mK9jH2gF5dC8vE1nM4qR7tU0wY3zA6bL9pN2m=w800-h600-no?authuser=0',
                title: 'Event Excellence',
                description: 'Creating memorable experiences for every occasion'
            },
            {
                src: 'https://lh3.googleusercontent.com/pw/AP1GczNM4qR7tU0wY3zA6bL9pN2mK5jH8gF1dC4vE7nM0qR3tU6wY9zA2bL5pN8mK1jH4gF7dC0vE3nM6qR9tU2wY5zA8bL1pN4mK7jH0gF3dC6vE9nM2qR5tU8wY1zA4bL7pN0mK3jH6gF9dC2vE5nM8qR1t=w800-h600-no?authuser=0',
                title: 'Quality Presentation',
                description: 'Beautifully presented dishes that delight all senses'
            }
        ];
        
        // Create slideshow HTML structure
        this.container.innerHTML = `
            <div class="slideshow-container">
                <div class="slideshow-loading">
                    <div class="loading-spinner"></div>
                    <p>Loading gallery...</p>
                </div>
                ${this.options.showProgress ? '<div class="slideshow-progress"></div>' : ''}
            </div>
            ${this.options.showArrows ? `
                <button class="slideshow-arrow prev" aria-label="Previous slide">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="slideshow-arrow next" aria-label="Next slide">
                    <i class="fas fa-chevron-right"></i>
                </button>
            ` : ''}
            ${this.options.showDots ? '<div class="slideshow-nav"></div>' : ''}
        `;
        
        this.slideshowContainer = this.container.querySelector('.slideshow-container');
        this.loadingElement = this.container.querySelector('.slideshow-loading');
        this.progressBar = this.container.querySelector('.slideshow-progress');
        this.navContainer = this.container.querySelector('.slideshow-nav');
        this.prevBtn = this.container.querySelector('.slideshow-arrow.prev');
        this.nextBtn = this.container.querySelector('.slideshow-arrow.next');
        
        // Load slides
        this.loadSlides(slidesData);
    }
    
    async loadSlides(slidesData) {
        try {
            // Create slides with fallback images
            const slidePromises = slidesData.map((slideData, index) => {
                return new Promise((resolve) => {
                    const slide = document.createElement('div');
                    slide.className = `slide ${index === 0 ? 'active' : ''}`;
                    
                    const img = document.createElement('img');
                    img.alt = slideData.title;
                    
                    // Use a high-quality stock catering image as fallback
                    const fallbackImages = [
                        'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop&crop=center',
                        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&crop=center',
                        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&crop=center',
                        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop&crop=center',
                        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&crop=center'
                    ];
                    
                    img.src = fallbackImages[index % fallbackImages.length];
                    
                    img.onload = () => {
                        slide.innerHTML = `
                            <img src="${img.src}" alt="${slideData.title}">
                            <div class="slide-overlay">
                                <h3>${slideData.title}</h3>
                                <p>${slideData.description}</p>
                            </div>
                        `;
                        resolve(slide);
                    };
                    
                    img.onerror = () => {
                        // If fallback also fails, use a gradient placeholder
                        slide.innerHTML = `
                            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, var(--primary-burgundy), var(--primary-orange)); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                                <i class="fas fa-utensils"></i>
                            </div>
                            <div class="slide-overlay">
                                <h3>${slideData.title}</h3>
                                <p>${slideData.description}</p>
                            </div>
                        `;
                        resolve(slide);
                    };
                });
            });
            
            const loadedSlides = await Promise.all(slidePromises);
            
            // Remove loading element
            this.loadingElement.remove();
            
            // Add slides to container
            loadedSlides.forEach(slide => {
                this.slideshowContainer.appendChild(slide);
            });
            
            this.slides = this.slideshowContainer.querySelectorAll('.slide');
            
            // Create navigation dots
            if (this.options.showDots && this.navContainer) {
                this.createNavigationDots();
            }
            
            // Start slideshow
            this.currentSlide = 0;
            this.updateSlideshow();
            
        } catch (error) {
            console.error('Error loading slideshow:', error);
            this.showErrorMessage();
        }
    }
    
    createNavigationDots() {
        for (let i = 0; i < this.slides.length; i++) {
            const dot = document.createElement('div');
            dot.className = `nav-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            this.navContainer.appendChild(dot);
        }
    }
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => {
            if (this.options.autoPlay) {
                this.startAutoPlay();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.container.matches(':hover')) {
                if (e.key === 'ArrowLeft') this.previousSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
                if (e.key === ' ') {
                    e.preventDefault();
                    this.toggleAutoPlay();
                }
            }
        });
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlideshow();
        this.resetAutoPlay();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlideshow();
        this.resetAutoPlay();
    }
    
    previousSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateSlideshow();
        this.resetAutoPlay();
    }
    
    updateSlideshow() {
        if (!this.slides.length) return;
        
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update navigation dots
        const dots = this.container.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoPlay() {
        if (!this.options.autoPlay || this.isPlaying) return;
        
        this.isPlaying = true;
        
        // Progress bar animation
        if (this.progressBar) {
            this.progressBar.style.width = '0%';
            this.progressBar.style.transition = `width ${this.options.autoPlayDelay}ms linear`;
            
            // Force reflow and start animation
            this.progressBar.offsetHeight;
            this.progressBar.style.width = '100%';
        }
        
        this.autoPlayTimer = setTimeout(() => {
            this.nextSlide();
        }, this.options.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
        
        if (this.progressBar) {
            this.progressBar.style.transition = 'none';
            this.progressBar.style.width = '0%';
        }
        
        this.isPlaying = false;
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        if (this.options.autoPlay) {
            setTimeout(() => this.startAutoPlay(), 100);
        }
    }
    
    toggleAutoPlay() {
        if (this.isPlaying) {
            this.pauseAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }
    
    showErrorMessage() {
        this.container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary); text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--primary-orange); margin-bottom: 1rem;"></i>
                <h3>Unable to load gallery</h3>
                <p>Please check your internet connection and try again.</p>
            </div>
        `;
    }
    
    destroy() {
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
        }
        
        if (this.progressTimer) {
            clearTimeout(this.progressTimer);
        }
        
        // Remove event listeners
        this.container.removeEventListener('mouseenter', this.pauseAutoPlay);
        this.container.removeEventListener('mouseleave', this.startAutoPlay);
    }
}

// Initialize slideshow when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const slideshowElement = document.querySelector('.professional-slideshow');
    if (slideshowElement) {
        new ProfessionalSlideshow(slideshowElement, {
            autoPlay: true,
            autoPlayDelay: 6000,
            showProgress: true,
            showDots: true,
            showArrows: true
        });
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfessionalSlideshow;
}

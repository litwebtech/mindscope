// Blog page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog functionality
    initializeBlogFilter();
    initializeNewsletterForms();
    initializePagination();
    initializeSocialSharing();
    initializeSearchFunctionality();
});

// Blog filter functionality
function initializeBlogFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogPosts = document.querySelectorAll('.blog-post');
    const categoryLinks = document.querySelectorAll('.categories-list a');

    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            filterPosts(category, filterButtons, blogPosts);
        });
    });

    // Category sidebar links
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            if (category) {
                filterPosts(category, filterButtons, blogPosts);
                // Update active filter button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                const activeBtn = document.querySelector(`[data-category="${category}"]`);
                if (activeBtn) activeBtn.classList.add('active');
            }
        });
    });
}

// Filter posts by category
function filterPosts(category, filterButtons, blogPosts) {
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    const activeButton = document.querySelector(`[data-category="${category}"]`);
    if (activeButton) activeButton.classList.add('active');

    // Filter posts
    blogPosts.forEach(post => {
        const postCategory = post.getAttribute('data-category');
        
        if (category === 'all' || postCategory === category) {
            post.style.display = 'block';
            post.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            post.style.display = 'none';
        }
    });

    // Update post count
    updatePostCount(category, blogPosts);
}

// Update visible post count
function updatePostCount(category, blogPosts) {
    let visibleCount = 0;
    blogPosts.forEach(post => {
        const postCategory = post.getAttribute('data-category');
        if (category === 'all' || postCategory === category) {
            visibleCount++;
        }
    });

    // Could add a post count display here if needed
    console.log(`Showing ${visibleCount} posts for category: ${category}`);
}

// Newsletter form functionality
function initializeNewsletterForms() {
    const newsletterForms = document.querySelectorAll('#newsletterForm, #mainNewsletterForm');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', handleNewsletterSubmission);
    });
}

// Handle newsletter form submission
function handleNewsletterSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();

    // Validate email
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Show loading state
    const originalButtonContent = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Simulate successful subscription
        showNotification('Successfully subscribed to our newsletter!', 'success');
        emailInput.value = '';
        
        // Reset button
        submitButton.innerHTML = originalButtonContent;
        submitButton.disabled = false;
        
        // Track subscription (would integrate with analytics)
        trackNewsletterSubscription(email);
    }, 1500);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Track newsletter subscription
function trackNewsletterSubscription(email) {
    // Would integrate with Google Analytics or other tracking service
    console.log('Newsletter subscription tracked:', email);
    
    // Could also send to backend API
    // fetch('/api/newsletter/subscribe', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email })
    // });
}

// Pagination functionality
function initializePagination() {
    const pageButtons = document.querySelectorAll('.page-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    pageButtons.forEach(button => {
        if (!button.classList.contains('prev-btn') && !button.classList.contains('next-btn')) {
            button.addEventListener('click', () => {
                const pageNumber = button.textContent.trim();
                if (!isNaN(pageNumber)) {
                    loadPage(parseInt(pageNumber));
                }
            });
        }
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const currentPage = getCurrentPage();
            if (currentPage > 1) {
                loadPage(currentPage - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const currentPage = getCurrentPage();
            const maxPage = getMaxPage();
            if (currentPage < maxPage) {
                loadPage(currentPage + 1);
            }
        });
    }
}

// Get current active page
function getCurrentPage() {
    const activePage = document.querySelector('.page-btn.active');
    return activePage ? parseInt(activePage.textContent) : 1;
}

// Get maximum page number
function getMaxPage() {
    const pageButtons = document.querySelectorAll('.page-btn:not(.prev-btn):not(.next-btn)');
    let maxPage = 1;
    pageButtons.forEach(btn => {
        const pageNum = parseInt(btn.textContent);
        if (!isNaN(pageNum) && pageNum > maxPage) {
            maxPage = pageNum;
        }
    });
    return maxPage;
}

// Load specific page
function loadPage(pageNumber) {
    // Update active page button
    const pageButtons = document.querySelectorAll('.page-btn:not(.prev-btn):not(.next-btn)');
    pageButtons.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.textContent) === pageNumber) {
            btn.classList.add('active');
        }
    });

    // Update prev/next button states
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const maxPage = getMaxPage();

    if (prevBtn) {
        prevBtn.disabled = pageNumber <= 1;
    }
    if (nextBtn) {
        nextBtn.disabled = pageNumber >= maxPage;
    }

    // In a real application, this would load new posts from the server
    console.log(`Loading page ${pageNumber}`);
    
    // Scroll to top of blog content
    const blogContent = document.querySelector('.blog-content');
    if (blogContent) {
        blogContent.scrollIntoView({ behavior: 'smooth' });
    }
}

// Social sharing functionality
function initializeSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.getAttribute('data-platform');
            const url = button.getAttribute('data-url') || window.location.href;
            const title = button.getAttribute('data-title') || document.title;
            
            shareOnPlatform(platform, url, title);
        });
    });
}

// Share on social media platform
function shareOnPlatform(platform, url, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    let shareUrl = '';

    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
            break;
        default:
            console.log('Unsupported platform:', platform);
            return;
    }

    // Open sharing window
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
}

// Search functionality (for future implementation)
function initializeSearchFunctionality() {
    const searchInput = document.querySelector('.blog-search-input');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            // Debounce search to avoid too many requests
            searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    performSearch(query);
                } else {
                    clearSearchResults();
                }
            }, 300);
        });
    }
}

// Perform blog search
function performSearch(query) {
    const blogPosts = document.querySelectorAll('.blog-post');
    let matchingPosts = 0;
    
    blogPosts.forEach(post => {
        const title = post.querySelector('.post-title').textContent.toLowerCase();
        const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
        const searchQuery = query.toLowerCase();
        
        if (title.includes(searchQuery) || excerpt.includes(searchQuery)) {
            post.style.display = 'block';
            highlightSearchTerms(post, query);
            matchingPosts++;
        } else {
            post.style.display = 'none';
        }
    });
    
    // Show search results count
    showSearchResults(query, matchingPosts);
}

// Highlight search terms in posts
function highlightSearchTerms(post, query) {
    // Simple highlighting implementation
    // In production, would use a more sophisticated highlighting library
    const title = post.querySelector('.post-title a');
    const excerpt = post.querySelector('.post-excerpt');
    
    if (title && excerpt) {
        const regex = new RegExp(`(${query})`, 'gi');
        title.innerHTML = title.textContent.replace(regex, '<mark>$1</mark>');
        excerpt.innerHTML = excerpt.textContent.replace(regex, '<mark>$1</mark>');
    }
}

// Show search results
function showSearchResults(query, count) {
    // Could display search results count and query
    console.log(`Found ${count} posts matching "${query}"`);
}

// Clear search results
function clearSearchResults() {
    const blogPosts = document.querySelectorAll('.blog-post');
    blogPosts.forEach(post => {
        post.style.display = 'block';
        
        // Remove highlighting
        const title = post.querySelector('.post-title a');
        const excerpt = post.querySelector('.post-excerpt');
        
        if (title) title.innerHTML = title.textContent;
        if (excerpt) excerpt.innerHTML = excerpt.textContent;
    });
}

// Reading time calculation
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

// Lazy loading for blog images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Show notification function
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Blog post interaction tracking
function trackBlogInteraction(action, postTitle) {
    // Would integrate with analytics service
    console.log(`Blog interaction: ${action} on "${postTitle}"`);
}

// Initialize reading progress indicator (for individual blog posts)
function initializeReadingProgress() {
    const progressBar = document.querySelector('.reading-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    initializeReadingProgress();
});

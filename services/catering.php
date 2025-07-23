<?php
require_once '../includes/config.php';

// Page specific variables
$page_title = 'Catering Services';
$page_description = 'Professional catering services in Kenya for corporate events, weddings, parties, and special occasions. Fresh, delicious meals delivered with excellence.';
$page_keywords = 'catering services Kenya, corporate catering Nairobi, wedding catering, event catering, food delivery';

include '../includes/header.php';
?>

<!-- Catering Hero -->
<section class="page-hero catering-hero">
  <div class="container">
    <div class="hero-content">
      <h1 class="page-title" data-aos="fade-up">Professional Catering Services</h1>
      <p class="page-subtitle" data-aos="fade-up" data-aos-delay="100">
        Exceptional culinary experiences for every occasion. From intimate gatherings to grand celebrations.
      </p>
      <nav class="breadcrumb" data-aos="fade-up" data-aos-delay="200">
        <a href="<?php echo SITE_URL; ?>/">Home</a>
        <span class="separator">/</span>
        <a href="<?php echo SITE_URL; ?>/services">Services</a>
        <span class="separator">/</span>
        <span class="current">Catering</span>
      </nav>
      <div class="hero-actions" data-aos="fade-up" data-aos-delay="300">
        <a href="#quote-form" class="btn btn-primary">
          <i class="fas fa-calculator"></i> Get Quote
        </a>
        <a href="#our-menus" class="btn btn-outline">
          <i class="fas fa-utensils"></i> View Menus
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Service Overview -->
<section class="service-overview">
  <div class="container">
    <div class="overview-grid">
      <div class="overview-content" data-aos="fade-right">
        <h2 class="section-title">Culinary Excellence Delivered</h2>
        <p class="lead">
          At Mindscope Services, we believe that great food brings people together. Our professional
          catering services are designed to make your events memorable with exceptional cuisine,
          impeccable presentation, and outstanding service.
        </p>
        <p>
          Whether you're planning a corporate conference, wedding celebration, birthday party, or
          any special occasion, our experienced culinary team creates customized menus that perfectly
          match your event's style, budget, and dietary requirements.
        </p>

        <div class="service-features">
          <div class="feature-item">
            <div class="feature-icon">
              <i class="fas fa-chef-hat"></i>
            </div>
            <div class="feature-content">
              <h4>Expert Chefs</h4>
              <p>Professionally trained chefs with years of culinary experience</p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <i class="fas fa-leaf"></i>
            </div>
            <div class="feature-content">
              <h4>Fresh Ingredients</h4>
              <p>Only the finest, freshest ingredients sourced from trusted suppliers</p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="feature-content">
              <h4>Timely Service</h4>
              <p>Punctual delivery and setup to ensure your event runs smoothly</p>
            </div>
          </div>
        </div>
      </div>

      <div class="overview-image" data-aos="fade-left">
        <img src="https://via.placeholder.com/600x500/4B002E/FFFFFF?text=Professional+Catering"
          alt="Professional Catering Service" class="img-fluid">
        <div class="service-stats">
          <div class="stat-item">
            <div class="stat-number">1000+</div>
            <div class="stat-label">Events Catered</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">500+</div>
            <div class="stat-label">Happy Clients</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">50+</div>
            <div class="stat-label">Menu Options</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Catering Types -->
<section class="catering-types">
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <h2 class="section-title">Our Catering Services</h2>
      <p class="section-subtitle">Comprehensive catering solutions for every occasion</p>
    </div>

    <div class="types-grid">
      <div class="type-card" data-aos="fade-up" data-aos-delay="100">
        <div class="type-icon">
          <i class="fas fa-building"></i>
        </div>
        <h3>Corporate Catering</h3>
        <p>
          Professional catering for business meetings, conferences, seminars, product launches,
          and corporate events. Impress your clients and colleagues with our executive dining options.
        </p>
        <ul class="type-features">
          <li>Executive lunch boxes</li>
          <li>Conference breakfast & breaks</li>
          <li>Business dinner events</li>
          <li>Office party catering</li>
        </ul>
      </div>

      <div class="type-card" data-aos="fade-up" data-aos-delay="200">
        <div class="type-icon">
          <i class="fas fa-heart"></i>
        </div>
        <h3>Wedding Catering</h3>
        <p>
          Make your special day unforgettable with our elegant wedding catering services.
          From intimate ceremonies to grand receptions, we create magical culinary experiences.
        </p>
        <ul class="type-features">
          <li>Bridal shower catering</li>
          <li>Wedding reception buffets</li>
          <li>Cocktail hour services</li>
          <li>Traditional & modern cuisines</li>
        </ul>
      </div>

      <div class="type-card" data-aos="fade-up" data-aos-delay="300">
        <div class="type-icon">
          <i class="fas fa-birthday-cake"></i>
        </div>
        <h3>Party Catering</h3>
        <p>
          Celebrate life's special moments with our party catering services. Birthday parties,
          anniversaries, graduations - we make every celebration delicious and memorable.
        </p>
        <ul class="type-features">
          <li>Birthday party packages</li>
          <li>Anniversary celebrations</li>
          <li>Graduation parties</li>
          <li>Theme party catering</li>
        </ul>
      </div>

      <div class="type-card" data-aos="fade-up" data-aos-delay="400">
        <div class="type-icon">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <h3>Special Events</h3>
        <p>
          From charity galas to cultural festivals, our special event catering adapts to any
          occasion. We work closely with you to create the perfect dining experience.
        </p>
        <ul class="type-features">
          <li>Charity gala dinners</li>
          <li>Cultural celebrations</li>
          <li>Sports events</li>
          <li>Festival catering</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- Our Menus -->
<section class="our-menus" id="our-menus">
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <h2 class="section-title">Our Delicious Menus</h2>
      <p class="section-subtitle">Diverse culinary options to satisfy every palate</p>
    </div>

    <div class="menu-tabs" data-aos="fade-up" data-aos-delay="100">
      <button class="menu-tab active" data-menu="kenyan">Kenyan Cuisine</button>
      <button class="menu-tab" data-menu="international">International</button>
      <button class="menu-tab" data-menu="appetizers">Appetizers</button>
      <button class="menu-tab" data-menu="desserts">Desserts</button>
      <button class="menu-tab" data-menu="beverages">Beverages</button>
    </div>

    <div class="menu-content">
      <!-- Kenyan Cuisine -->
      <div class="menu-category active" id="kenyan">
        <div class="menu-grid">
          <div class="menu-item" data-aos="fade-up">
            <div class="menu-image">
              <img src="https://via.placeholder.com/300x200/E7682E/FFFFFF?text=Nyama+Choma" alt="Nyama Choma">
            </div>
            <div class="menu-details">
              <h4>Nyama Choma Platter</h4>
              <p>Perfectly grilled beef served with ugali, sukuma wiki, and traditional sauces</p>
              <span class="menu-price">KES 1,500</span>
            </div>
          </div>

          <div class="menu-item" data-aos="fade-up" data-aos-delay="100">
            <div class="menu-image">
              <img src="https://via.placeholder.com/300x200/F4C52B/4B002E?text=Pilau" alt="Pilau">
            </div>
            <div class="menu-details">
              <h4>Coconut Pilau</h4>
              <p>Fragrant rice cooked with coconut milk, spices, and tender meat</p>
              <span class="menu-price">KES 800</span>
            </div>
          </div>

          <div class="menu-item" data-aos="fade-up" data-aos-delay="200">
            <div class="menu-image">
              <img src="https://via.placeholder.com/300x200/4B002E/FFFFFF?text=Fish+Curry" alt="Fish Curry">
            </div>
            <div class="menu-details">
              <h4>Swahili Fish Curry</h4>
              <p>Fresh fish in coconut curry sauce with chapati and rice</p>
              <span class="menu-price">KES 1,200</span>
            </div>
          </div>
        </div>
      </div>

      <!-- International -->
      <div class="menu-category" id="international">
        <div class="menu-grid">
          <div class="menu-item" data-aos="fade-up">
            <div class="menu-image">
              <img src="https://via.placeholder.com/300x200/E7682E/FFFFFF?text=Grilled+Chicken" alt="Grilled Chicken">
            </div>
            <div class="menu-details">
              <h4>Herb Grilled Chicken</h4>
              <p>Succulent chicken breast with roasted vegetables and garlic mashed potatoes</p>
              <span class="menu-price">KES 1,800</span>
            </div>
          </div>

          <div class="menu-item" data-aos="fade-up" data-aos-delay="100">
            <div class="menu-image">
              <img src="https://via.placeholder.com/300x200/F4C52B/4B002E?text=Pasta" alt="Pasta">
            </div>
            <div class="menu-details">
              <h4>Creamy Alfredo Pasta</h4>
              <p>Fresh pasta in rich alfredo sauce with grilled chicken and vegetables</p>
              <span class="menu-price">KES 1,400</span>
            </div>
          </div>

          <div class="menu-item" data-aos="fade-up" data-aos-delay="200">
            <div class="menu-image">
              <img src="https://via.placeholder.com/300x200/4B002E/FFFFFF?text=Beef+Steak" alt="Beef Steak">
            </div>
            <div class="menu-details">
              <h4>Premium Beef Steak</h4>
              <p>Tender beef steak with black pepper sauce and seasonal vegetables</p>
              <span class="menu-price">KES 2,500</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Other menu categories would follow the same pattern -->
      <div class="menu-category" id="appetizers">
        <div class="menu-grid">
          <div class="menu-item" data-aos="fade-up">
            <div class="menu-image">
              <img src="https://via.placeholder.com/300x200/E7682E/FFFFFF?text=Samosas" alt="Samosas">
            </div>
            <div class="menu-details">
              <h4>Chicken Samosas</h4>
              <p>Crispy triangular pastries filled with spiced chicken and vegetables</p>
              <span class="menu-price">KES 300</span>
            </div>
          </div>
        </div>
      </div>

      <div class="menu-category" id="desserts">
        <div class="menu-grid">
          <div class="menu-item" data-aos="fade-up">
            <div class="menu-image">
              <img src="https://via.placeholder.com/300x200/F4C52B/4B002E?text=Chocolate+Cake" alt="Chocolate Cake">
            </div>
            <div class="menu-details">
              <h4>Chocolate Fudge Cake</h4>
              <p>Rich chocolate cake with vanilla ice cream and berry compote</p>
              <span class="menu-price">KES 600</span>
            </div>
          </div>
        </div>
      </div>

      <div class="menu-category" id="beverages">
        <div class="menu-grid">
          <div class="menu-item" data-aos="fade-up">
            <div class="menu-image">
              <img src="https://via.placeholder.com/300x200/4B002E/FFFFFF?text=Fresh+Juice" alt="Fresh Juice">
            </div>
            <div class="menu-details">
              <h4>Fresh Fruit Juices</h4>
              <p>Orange, mango, passion fruit, or mixed tropical fruits</p>
              <span class="menu-price">KES 250</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Why Choose Our Catering -->
<section class="why-choose-catering">
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <h2 class="section-title">Why Choose Our Catering?</h2>
      <p class="section-subtitle">What makes our catering services exceptional</p>
    </div>

    <div class="benefits-grid">
      <div class="benefit-item" data-aos="fade-up" data-aos-delay="100">
        <div class="benefit-icon">
          <i class="fas fa-medal"></i>
        </div>
        <h3>Quality Guaranteed</h3>
        <p>We use only the finest ingredients and maintain the highest standards of food safety and hygiene.</p>
      </div>

      <div class="benefit-item" data-aos="fade-up" data-aos-delay="200">
        <div class="benefit-icon">
          <i class="fas fa-utensils"></i>
        </div>
        <h3>Custom Menus</h3>
        <p>Personalized menus tailored to your preferences, dietary needs, and budget requirements.</p>
      </div>

      <div class="benefit-item" data-aos="fade-up" data-aos-delay="300">
        <div class="benefit-icon">
          <i class="fas fa-users"></i>
        </div>
        <h3>Professional Staff</h3>
        <p>Experienced service staff who ensure your guests receive exceptional hospitality throughout your event.</p>
      </div>

      <div class="benefit-item" data-aos="fade-up" data-aos-delay="400">
        <div class="benefit-icon">
          <i class="fas fa-truck"></i>
        </div>
        <h3>Reliable Delivery</h3>
        <p>Timely setup and delivery with all necessary equipment and professional presentation.</p>
      </div>

      <div class="benefit-item" data-aos="fade-up" data-aos-delay="500">
        <div class="benefit-icon">
          <i class="fas fa-dollar-sign"></i>
        </div>
        <h3>Competitive Pricing</h3>
        <p>Transparent, fair pricing with flexible packages to suit different budgets and event sizes.</p>
      </div>

      <div class="benefit-item" data-aos="fade-up" data-aos-delay="600">
        <div class="benefit-icon">
          <i class="fas fa-headset"></i>
        </div>
        <h3>24/7 Support</h3>
        <p>Round-the-clock customer support to handle any last-minute changes or special requests.</p>
      </div>
    </div>
  </div>
</section>

<!-- Quote Form -->
<section class="quote-section" id="quote-form">
  <div class="container">
    <div class="quote-wrapper">
      <div class="quote-info" data-aos="fade-right">
        <h2>Get Your Catering Quote</h2>
        <p>Tell us about your event and we'll provide you with a detailed quote within 24 hours.</p>

        <div class="quote-benefits">
          <div class="quote-benefit">
            <i class="fas fa-check-circle"></i>
            <span>Free consultation and menu planning</span>
          </div>
          <div class="quote-benefit">
            <i class="fas fa-check-circle"></i>
            <span>Competitive pricing with no hidden costs</span>
          </div>
          <div class="quote-benefit">
            <i class="fas fa-check-circle"></i>
            <span>Flexible packages for any budget</span>
          </div>
          <div class="quote-benefit">
            <i class="fas fa-check-circle"></i>
            <span>Professional service guarantee</span>
          </div>
        </div>

        <div class="contact-info">
          <h4>Need immediate assistance?</h4>
          <p><strong>Call us:</strong> <a href="tel:+254700000000">+254 700 000 000</a></p>
          <p><strong>WhatsApp:</strong> <a href="https://wa.me/254700000000">+254 700 000 000</a></p>
        </div>
      </div>

      <div class="quote-form" data-aos="fade-left">
        <form id="cateringQuoteForm" class="catering-quote-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input type="text" id="name" name="name" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input type="email" id="email" name="email" class="form-input" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="phone">Phone Number *</label>
              <input type="tel" id="phone" name="phone" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="event_type">Event Type *</label>
              <select id="event_type" name="event_type" class="form-select" required>
                <option value="">Select event type...</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Wedding">Wedding</option>
                <option value="Birthday Party">Birthday Party</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Conference">Conference</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="event_date">Event Date *</label>
              <input type="date" id="event_date" name="event_date" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="guest_count">Number of Guests *</label>
              <select id="guest_count" name="guest_count" class="form-select" required>
                <option value="">Select guest count...</option>
                <option value="1-20">1-20 guests</option>
                <option value="21-50">21-50 guests</option>
                <option value="51-100">51-100 guests</option>
                <option value="101-200">101-200 guests</option>
                <option value="201-500">201-500 guests</option>
                <option value="500+">500+ guests</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="event_location">Event Location *</label>
            <input type="text" id="event_location" name="event_location"
              class="form-input" placeholder="Event venue or address" required>
          </div>

          <div class="form-group">
            <label for="budget_range">Budget Range</label>
            <select id="budget_range" name="budget_range" class="form-select">
              <option value="">Select budget range...</option>
              <option value="Under 50K">Under KES 50,000</option>
              <option value="50K-100K">KES 50,000 - 100,000</option>
              <option value="100K-200K">KES 100,000 - 200,000</option>
              <option value="200K-500K">KES 200,000 - 500,000</option>
              <option value="500K+">KES 500,000+</option>
            </select>
          </div>

          <div class="form-group">
            <label for="special_requirements">Special Requirements</label>
            <textarea id="special_requirements" name="special_requirements"
              class="form-textarea" rows="4"
              placeholder="Dietary restrictions, special requests, equipment needs, etc."></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-full">
            <i class="fas fa-calculator"></i> Get My Quote
          </button>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- Testimonials -->
<section class="testimonials-section">
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <h2 class="section-title">What Our Clients Say</h2>
      <p class="section-subtitle">Real feedback from satisfied customers</p>
    </div>

    <div class="testimonials-grid">
      <div class="testimonial-card" data-aos="fade-up" data-aos-delay="100">
        <div class="testimonial-content">
          <div class="stars">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
          </div>
          <p>"Exceptional catering service for our annual corporate event. The food was delicious and the presentation was outstanding. Highly recommended!"</p>
        </div>
        <div class="testimonial-author">
          <div class="author-image">
            <img src="https://via.placeholder.com/60x60/4B002E/FFFFFF?text=DK" alt="David Kimani">
          </div>
          <div class="author-info">
            <h5>David Kimani</h5>
            <p>CEO, Tech Solutions Ltd</p>
          </div>
        </div>
      </div>

      <div class="testimonial-card" data-aos="fade-up" data-aos-delay="200">
        <div class="testimonial-content">
          <div class="stars">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
          </div>
          <p>"Our wedding catering was absolutely perfect! The team was professional and the food received countless compliments from our guests."</p>
        </div>
        <div class="testimonial-author">
          <div class="author-image">
            <img src="https://via.placeholder.com/60x60/E7682E/FFFFFF?text=MW" alt="Mary Wanjiku">
          </div>
          <div class="author-info">
            <h5>Mary Wanjiku</h5>
            <p>Bride, Garden Wedding</p>
          </div>
        </div>
      </div>

      <div class="testimonial-card" data-aos="fade-up" data-aos-delay="300">
        <div class="testimonial-content">
          <div class="stars">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
          </div>
          <p>"Professional service from start to finish. They accommodated all our dietary requirements and delivered exactly what they promised."</p>
        </div>
        <div class="testimonial-author">
          <div class="author-image">
            <img src="https://via.placeholder.com/60x60/F4C52B/4B002E?text=JO" alt="James Ochieng">
          </div>
          <div class="author-info">
            <h5>James Ochieng</h5>
            <p>Event Organizer</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Additional Scripts -->
<?php
$additional_scripts = '
    <script>
        // Menu tabs functionality
        document.addEventListener("DOMContentLoaded", function() {
            const menuTabs = document.querySelectorAll(".menu-tab");
            const menuCategories = document.querySelectorAll(".menu-category");
            
            menuTabs.forEach(tab => {
                tab.addEventListener("click", function() {
                    // Remove active class from all tabs and categories
                    menuTabs.forEach(t => t.classList.remove("active"));
                    menuCategories.forEach(c => c.classList.remove("active"));
                    
                    // Add active class to clicked tab
                    this.classList.add("active");
                    
                    // Show corresponding category
                    const targetMenu = this.getAttribute("data-menu");
                    document.getElementById(targetMenu).classList.add("active");
                });
            });
        });
    </script>';

include '../includes/footer.php';
?>
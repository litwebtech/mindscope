-- ====================================
-- Mindscope Services Website Database
-- ====================================
SET
  SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET
  time_zone = "+00:00";

-- Create database
CREATE DATABASE IF NOT EXISTS `mindscope_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `mindscope_db`;

-- ====================================
-- Contact Messages Table
-- ====================================
CREATE TABLE
  `contact_messages` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `email` varchar(150) NOT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `company` varchar(100) DEFAULT NULL,
    `subject` varchar(200) NOT NULL,
    `message` text NOT NULL,
    `status` enum('new', 'read', 'replied', 'archived') DEFAULT 'new',
    `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `ip_address` varchar(45) DEFAULT NULL,
    `user_agent` text DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_submitted_at` (`submitted_at`),
    INDEX `idx_email` (`email`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ====================================
-- Quote Requests Table (Catering)
-- ====================================
CREATE TABLE
  `quote_requests` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `email` varchar(150) NOT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `company` varchar(100) DEFAULT NULL,
    `event_type` varchar(100) NOT NULL,
    `event_date` date NOT NULL,
    `guests` int(11) NOT NULL,
    `budget` varchar(50) DEFAULT NULL,
    `location` varchar(200) DEFAULT NULL,
    `special_requirements` text DEFAULT NULL,
    `status` enum(
      'new',
      'quoted',
      'confirmed',
      'completed',
      'cancelled'
    ) DEFAULT 'new',
    `estimated_cost` decimal(10, 2) DEFAULT NULL,
    `notes` text DEFAULT NULL,
    `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `ip_address` varchar(45) DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_event_date` (`event_date`),
    INDEX `idx_submitted_at` (`submitted_at`),
    INDEX `idx_email` (`email`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ====================================
-- Newsletter Subscribers Table
-- ====================================
CREATE TABLE
  `newsletter_subscribers` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `email` varchar(150) NOT NULL UNIQUE,
    `status` enum('active', 'unsubscribed', 'bounced') DEFAULT 'active',
    `subscribed_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `unsubscribed_at` timestamp NULL DEFAULT NULL,
    `ip_address` varchar(45) DEFAULT NULL,
    `source` varchar(50) DEFAULT 'website',
    `preferences` json DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_email` (`email`),
    INDEX `idx_status` (`status`),
    INDEX `idx_subscribed_at` (`subscribed_at`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ====================================
-- Blog Posts Table
-- ====================================
CREATE TABLE
  `blog_posts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `slug` varchar(255) NOT NULL UNIQUE,
    `excerpt` text DEFAULT NULL,
    `content` longtext NOT NULL,
    `featured_image` varchar(255) DEFAULT NULL,
    `author_name` varchar(100) NOT NULL,
    `author_email` varchar(150) DEFAULT NULL,
    `author_bio` text DEFAULT NULL,
    `category` varchar(100) DEFAULT NULL,
    `tags` json DEFAULT NULL,
    `status` enum('draft', 'published', 'archived') DEFAULT 'draft',
    `published_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `views` int(11) DEFAULT 0,
    `meta_description` varchar(160) DEFAULT NULL,
    `meta_keywords` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_slug` (`slug`),
    INDEX `idx_status` (`status`),
    INDEX `idx_published_at` (`published_at`),
    INDEX `idx_category` (`category`),
    FULLTEXT KEY `fulltext_search` (`title`, `content`, `excerpt`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ====================================
-- Portfolio Items Table
-- ====================================
CREATE TABLE
  `portfolio_items` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `slug` varchar(255) NOT NULL UNIQUE,
    `description` text DEFAULT NULL,
    `category` varchar(100) NOT NULL,
    `client_name` varchar(100) DEFAULT NULL,
    `project_date` date DEFAULT NULL,
    `featured_image` varchar(255) DEFAULT NULL,
    `gallery_images` json DEFAULT NULL,
    `project_details` json DEFAULT NULL,
    `status` enum('active', 'inactive', 'featured') DEFAULT 'active',
    `sort_order` int(11) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_slug` (`slug`),
    INDEX `idx_category` (`category`),
    INDEX `idx_status` (`status`),
    INDEX `idx_sort_order` (`sort_order`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ====================================
-- Services Table
-- ====================================
CREATE TABLE
  `services` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `slug` varchar(100) NOT NULL UNIQUE,
    `description` text DEFAULT NULL,
    `short_description` varchar(255) DEFAULT NULL,
    `icon` varchar(50) DEFAULT NULL,
    `featured_image` varchar(255) DEFAULT NULL,
    `features` json DEFAULT NULL,
    `pricing_info` json DEFAULT NULL,
    `status` enum('active', 'inactive') DEFAULT 'active',
    `sort_order` int(11) DEFAULT 0,
    `meta_description` varchar(160) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_slug` (`slug`),
    INDEX `idx_status` (`status`),
    INDEX `idx_sort_order` (`sort_order`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ====================================
-- Testimonials Table
-- ====================================
CREATE TABLE
  `testimonials` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `client_name` varchar(100) NOT NULL,
    `client_title` varchar(100) DEFAULT NULL,
    `client_company` varchar(100) DEFAULT NULL,
    `client_image` varchar(255) DEFAULT NULL,
    `testimonial` text NOT NULL,
    `rating` tinyint(1) DEFAULT 5 CHECK (
      `rating` >= 1
      AND `rating` <= 5
    ),
    `service_category` varchar(100) DEFAULT NULL,
    `status` enum('active', 'inactive', 'featured') DEFAULT 'active',
    `sort_order` int(11) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_service_category` (`service_category`),
    INDEX `idx_sort_order` (`sort_order`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ====================================
-- FAQ Table
-- ====================================
CREATE TABLE
  `faqs` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `question` varchar(255) NOT NULL,
    `answer` text NOT NULL,
    `category` varchar(100) DEFAULT 'general',
    `status` enum('active', 'inactive') DEFAULT 'active',
    `sort_order` int(11) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    INDEX `idx_category` (`category`),
    INDEX `idx_status` (`status`),
    INDEX `idx_sort_order` (`sort_order`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ====================================
-- Admin Users Table
-- ====================================
CREATE TABLE
  `admin_users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL UNIQUE,
    `email` varchar(150) NOT NULL UNIQUE,
    `password_hash` varchar(255) NOT NULL,
    `full_name` varchar(100) NOT NULL,
    `role` enum('admin', 'editor', 'viewer') DEFAULT 'editor',
    `status` enum('active', 'inactive', 'suspended') DEFAULT 'active',
    `last_login` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_username` (`username`),
    UNIQUE KEY `unique_email` (`email`),
    INDEX `idx_status` (`status`),
    INDEX `idx_role` (`role`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ====================================
-- Site Settings Table
-- ====================================
CREATE TABLE
  `site_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL UNIQUE,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum('text', 'number', 'boolean', 'json', 'file') DEFAULT 'text',
    `description` varchar(255) DEFAULT NULL,
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ====================================
-- Email Templates Table
-- ====================================
CREATE TABLE
  `email_templates` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `template_key` varchar(100) NOT NULL UNIQUE,
    `subject` varchar(255) NOT NULL,
    `body_html` longtext NOT NULL,
    `body_text` text DEFAULT NULL,
    `variables` json DEFAULT NULL,
    `status` enum('active', 'inactive') DEFAULT 'active',
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_template_key` (`template_key`),
    INDEX `idx_status` (`status`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ====================================
-- Insert Sample Data
-- ====================================
-- Sample Services
INSERT INTO
  `services` (
    `name`,
    `slug`,
    `description`,
    `short_description`,
    `icon`,
    `status`,
    `sort_order`
  )
VALUES
  (
    'Catering Services',
    'catering',
    'Professional catering for events, corporate meals, and weekly meal plans with trained chefs and quality ingredients.',
    'Professional event & corporate catering',
    'fas fa-utensils',
    'active',
    1
  ),
  (
    'Transport & Logistics',
    'logistics',
    'Reliable transportation solutions including group transport, personal drivers, and local errand services.',
    'Reliable transport solutions',
    'fas fa-truck',
    'active',
    2
  ),
  (
    'Business Consulting',
    'consulting',
    'Strategic consulting, coaching, branding, system setups, and business registration services.',
    'Strategic growth & consulting',
    'fas fa-chart-line',
    'active',
    3
  ),
  (
    'Event Management',
    'events',
    'Complete event planning and management from corporate conferences to social celebrations.',
    'Complete event planning',
    'fas fa-calendar-alt',
    'active',
    4
  );

-- Sample Testimonials
INSERT INTO
  `testimonials` (
    `client_name`,
    `client_title`,
    `client_company`,
    `testimonial`,
    `rating`,
    `service_category`,
    `status`,
    `sort_order`
  )
VALUES
  (
    'Sarah Kimani',
    'CEO',
    'TechHub Nairobi',
    'Mindscope Services has been instrumental in transforming our corporate catering experience. Their attention to detail and professional service is unmatched.',
    5,
    'catering',
    'featured',
    1
  ),
  (
    'Michael Otieno',
    'Founder',
    'GreenTech Solutions',
    'The business consulting services helped us streamline our operations and achieve 200% growth in just one year. Highly recommended!',
    5,
    'consulting',
    'featured',
    2
  ),
  (
    'Grace Wanjiku',
    'Operations Manager',
    'Summit Corporation',
    'From transport logistics to event management, Mindscope delivers excellence consistently. They\'re our go-to partner for all corporate needs.',
    5,
    'logistics',
    'featured',
    3
  );

-- Sample FAQs
INSERT INTO
  `faqs` (
    `question`,
    `answer`,
    `category`,
    `status`,
    `sort_order`
  )
VALUES
  (
    'What types of events do you cater for?',
    'We cater for all types of events including corporate conferences, weddings, birthday parties, product launches, and social gatherings. Our team can handle events from 10 to 1000+ guests.',
    'catering',
    'active',
    1
  ),
  (
    'How far in advance should I book your services?',
    'We recommend booking at least 2-3 weeks in advance for regular events and 1-2 months for large events or during peak seasons. However, we can accommodate last-minute requests based on availability.',
    'general',
    'active',
    2
  ),
  (
    'Do you provide transportation outside Nairobi?',
    'Yes, we provide transportation services throughout Kenya. Our fleet includes vehicles suitable for different group sizes and we can arrange inter-city travel as well as local transport.',
    'logistics',
    'active',
    3
  ),
  (
    'What is included in your business consulting services?',
    'Our business consulting includes strategic planning, business registration, branding, system setup, process optimization, financial planning, and ongoing coaching support.',
    'consulting',
    'active',
    4
  ),
  (
    'Do you offer customized catering menus?',
    'Absolutely! We work with you to create customized menus that suit your preferences, dietary requirements, budget, and event theme. Our chefs can prepare both local and international cuisines.',
    'catering',
    'active',
    5
  );

-- Sample Site Settings
INSERT INTO
  `site_settings` (
    `setting_key`,
    `setting_value`,
    `setting_type`,
    `description`
  )
VALUES
  (
    'site_name',
    'Mindscope Services Ltd',
    'text',
    'Website name'
  ),
  (
    'site_email',
    'info@mindscopeservices.com',
    'text',
    'Main contact email'
  ),
  (
    'admin_email',
    'admin@mindscopeservices.com',
    'text',
    'Admin email for notifications'
  ),
  (
    'phone_number',
    '+254 700 000 000',
    'text',
    'Primary phone number'
  ),
  (
    'address',
    'Ridgeways, Kiambu Road, Nairobi, Kenya',
    'text',
    'Physical address'
  ),
  (
    'business_hours',
    'Monday - Friday: 8:00 AM - 6:00 PM',
    'text',
    'Business operating hours'
  ),
  (
    'social_facebook',
    'https://facebook.com/mindscopeservices',
    'text',
    'Facebook page URL'
  ),
  (
    'social_twitter',
    'https://twitter.com/mindscopeservices',
    'text',
    'Twitter profile URL'
  ),
  (
    'social_linkedin',
    'https://linkedin.com/company/mindscope-services',
    'text',
    'LinkedIn page URL'
  ),
  (
    'social_instagram',
    'https://instagram.com/mindscopeservices',
    'text',
    'Instagram profile URL'
  ),
  (
    'whatsapp_number',
    '254722888385',
    'text',
    'WhatsApp business number'
  );

-- Sample Email Templates
INSERT INTO
  `email_templates` (
    `template_key`,
    `subject`,
    `body_html`,
    `variables`,
    `status`
  )
VALUES
  (
    'contact_confirmation',
    'Thank you for contacting Mindscope Services',
    '<html><body style="font-family: Arial, sans-serif;"><h2 style="color: #4B002E;">Thank you for your message!</h2><p>Dear {{name}},</p><p>We have received your message and will get back to you within 24 hours.</p><p>Best regards,<br>Mindscope Services Team</p></body></html>',
    '["name", "email", "message"]',
    'active'
  ),
  (
    'newsletter_welcome',
    'Welcome to Mindscope Services Newsletter',
    '<html><body style="font-family: Arial, sans-serif;"><h2 style="color: #4B002E;">Welcome to our Newsletter!</h2><p>Thank you for subscribing. You\'ll receive updates about our latest services, offers, and industry insights.</p></body></html>',
    '["email"]',
    'active'
  ),
  (
    'quote_confirmation',
    'Your Quote Request - Mindscope Services',
    '<html><body style="font-family: Arial, sans-serif;"><h2 style="color: #4B002E;">Thank you for your quote request!</h2><p>Dear {{name}},</p><p>We have received your catering quote request and will send you a detailed quote within 24 hours.</p><p>Event Details:<br><strong>Type:</strong> {{event_type}}<br><strong>Date:</strong> {{event_date}}<br><strong>Guests:</strong> {{guests}}</p></body></html>',
    '["name", "event_type", "event_date", "guests"]',
    'active'
  );

-- Create Default Admin User (password: admin123 - CHANGE THIS!)
INSERT INTO
  `admin_users` (
    `username`,
    `email`,
    `password_hash`,
    `full_name`,
    `role`,
    `status`
  )
VALUES
  (
    'admin',
    'admin@mindscopeservices.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'System Administrator',
    'admin',
    'active'
  );

-- ====================================
-- Create Views for Reporting
-- ====================================
-- Contact Messages Summary View
CREATE VIEW
  `contact_messages_summary` AS
SELECT
  DATE(submitted_at) as date,
  COUNT(*) as total_messages,
  COUNT(
    CASE
      WHEN status = 'new' THEN 1
    END
  ) as new_messages,
  COUNT(
    CASE
      WHEN status = 'replied' THEN 1
    END
  ) as replied_messages
FROM
  contact_messages
GROUP BY
  DATE(submitted_at)
ORDER BY
  date DESC;

-- Newsletter Subscribers Growth View
CREATE VIEW
  `newsletter_growth` AS
SELECT
  DATE(subscribed_at) as date,
  COUNT(*) as new_subscribers,
  (
    SELECT
      COUNT(*)
    FROM
      newsletter_subscribers
    WHERE
      DATE(subscribed_at) <= DATE(ns.subscribed_at)
      AND status = 'active'
  ) as total_active
FROM
  newsletter_subscribers ns
WHERE
  status = 'active'
GROUP BY
  DATE(subscribed_at)
ORDER BY
  date DESC;

-- Quote Requests Summary View
CREATE VIEW
  `quote_requests_summary` AS
SELECT
  DATE(submitted_at) as date,
  COUNT(*) as total_requests,
  COUNT(
    CASE
      WHEN status = 'new' THEN 1
    END
  ) as new_requests,
  COUNT(
    CASE
      WHEN status = 'quoted' THEN 1
    END
  ) as quoted_requests,
  COUNT(
    CASE
      WHEN status = 'confirmed' THEN 1
    END
  ) as confirmed_requests,
  AVG(estimated_cost) as avg_estimated_cost
FROM
  quote_requests
GROUP BY
  DATE(submitted_at)
ORDER BY
  date DESC;

COMMIT;
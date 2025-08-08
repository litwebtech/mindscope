-- Mindscope Services Ltd Database Schema
-- Updated with comprehensive tables for all forms and features
SET
  SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

SET
  AUTOCOMMIT = 0;

START TRANSACTION;

SET
  time_zone = "+00:00";

-- Database: mindscope_db
CREATE DATABASE IF NOT EXISTS `mindscope_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `mindscope_db`;

-- --------------------------------------------------------
-- Table structure for table `contact_messages`
CREATE TABLE
  `contact_messages` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `subject` varchar(200) NOT NULL,
    `message` text NOT NULL,
    `service_type` varchar(50) DEFAULT NULL,
    `newsletter_opt_in` tinyint(1) DEFAULT 0,
    `ip_address` varchar(45) DEFAULT NULL,
    `user_agent` text DEFAULT NULL,
    `status` enum('unread', 'read', 'replied', 'archived') DEFAULT 'unread',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_email` (`email`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_status` (`status`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `quote_requests`
CREATE TABLE
  `quote_requests` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `company` varchar(100) DEFAULT NULL,
    `form_type` enum('catering', 'events', 'logistics', 'consulting') NOT NULL,
    `service_details` json DEFAULT NULL,
    `message` text DEFAULT NULL,
    `ip_address` varchar(45) DEFAULT NULL,
    `user_agent` text DEFAULT NULL,
    `status` enum(
      'pending',
      'reviewed',
      'quoted',
      'accepted',
      'rejected',
      'completed'
    ) DEFAULT 'pending',
    `quote_amount` decimal(10, 2) DEFAULT NULL,
    `quote_notes` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_email` (`email`),
    KEY `idx_form_type` (`form_type`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_status` (`status`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `wellness_consultations`
CREATE TABLE
  `wellness_consultations` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `company` varchar(100) DEFAULT NULL,
    `programme_type` varchar(100) NOT NULL,
    `urgency_level` enum('low', 'medium', 'high', 'urgent') NOT NULL,
    `main_concerns` text NOT NULL,
    `preferred_date` date DEFAULT NULL,
    `preferred_time` varchar(20) DEFAULT NULL,
    `consultation_type` enum(
      'individual',
      'group',
      'corporate',
      'online',
      'in-person'
    ) DEFAULT NULL,
    `previous_experience` text DEFAULT NULL,
    `specific_goals` text DEFAULT NULL,
    `budget_range` varchar(50) DEFAULT NULL,
    `privacy_consent` tinyint(1) NOT NULL DEFAULT 0,
    `ip_address` varchar(45) DEFAULT NULL,
    `user_agent` text DEFAULT NULL,
    `status` enum(
      'pending',
      'scheduled',
      'in-progress',
      'completed',
      'cancelled'
    ) DEFAULT 'pending',
    `consultation_date` datetime DEFAULT NULL,
    `consultant_notes` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_email` (`email`),
    KEY `idx_urgency_level` (`urgency_level`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_status` (`status`),
    KEY `idx_programme_type` (`programme_type`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `newsletter_subscribers`
CREATE TABLE
  `newsletter_subscribers` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `email` varchar(100) NOT NULL UNIQUE,
    `name` varchar(100) DEFAULT NULL,
    `source` varchar(50) DEFAULT 'website',
    `status` enum('active', 'inactive', 'unsubscribed', 'bounced') DEFAULT 'active',
    `ip_address` varchar(45) DEFAULT NULL,
    `user_agent` text DEFAULT NULL,
    `subscribed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `unsubscribed_at` timestamp NULL DEFAULT NULL,
    `last_email_sent` timestamp NULL DEFAULT NULL,
    `email_count` int(11) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_email` (`email`),
    KEY `idx_status` (`status`),
    KEY `idx_subscribed_at` (`subscribed_at`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `faq_contacts`
CREATE TABLE
  `faq_contacts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `question` text NOT NULL,
    `category` varchar(50) DEFAULT 'general',
    `ip_address` varchar(45) DEFAULT NULL,
    `user_agent` text DEFAULT NULL,
    `status` enum('pending', 'answered', 'archived') DEFAULT 'pending',
    `admin_response` text DEFAULT NULL,
    `responded_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_email` (`email`),
    KEY `idx_category` (`category`),
    KEY `idx_status` (`status`),
    KEY `idx_created_at` (`created_at`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `portfolio_items`
CREATE TABLE
  `portfolio_items` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(200) NOT NULL,
    `description` text DEFAULT NULL,
    `category` enum(
      'catering',
      'events',
      'logistics',
      'consulting',
      'wellness'
    ) NOT NULL,
    `client_name` varchar(100) DEFAULT NULL,
    `project_date` date DEFAULT NULL,
    `image_url` varchar(500) DEFAULT NULL,
    `gallery_images` json DEFAULT NULL,
    `project_details` text DEFAULT NULL,
    `technologies_used` text DEFAULT NULL,
    `challenges` text DEFAULT NULL,
    `solutions` text DEFAULT NULL,
    `results` text DEFAULT NULL,
    `testimonial` text DEFAULT NULL,
    `testimonial_author` varchar(100) DEFAULT NULL,
    `testimonial_position` varchar(100) DEFAULT NULL,
    `featured` tinyint(1) DEFAULT 0,
    `status` enum('draft', 'published', 'archived') DEFAULT 'published',
    `seo_title` varchar(200) DEFAULT NULL,
    `seo_description` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_category` (`category`),
    KEY `idx_featured` (`featured`),
    KEY `idx_status` (`status`),
    KEY `idx_project_date` (`project_date`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `admin_users`
CREATE TABLE
  `admin_users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL UNIQUE,
    `email` varchar(100) NOT NULL UNIQUE,
    `password_hash` varchar(255) NOT NULL,
    `full_name` varchar(100) NOT NULL,
    `role` enum('super_admin', 'admin', 'manager', 'viewer') DEFAULT 'admin',
    `permissions` json DEFAULT NULL,
    `last_login` timestamp NULL DEFAULT NULL,
    `login_attempts` int(11) DEFAULT 0,
    `locked_until` timestamp NULL DEFAULT NULL,
    `password_reset_token` varchar(255) DEFAULT NULL,
    `password_reset_expires` timestamp NULL DEFAULT NULL,
    `email_verified` tinyint(1) DEFAULT 0,
    `email_verification_token` varchar(255) DEFAULT NULL,
    `status` enum('active', 'inactive', 'suspended') DEFAULT 'active',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_username` (`username`),
    UNIQUE KEY `unique_email` (`email`),
    KEY `idx_role` (`role`),
    KEY `idx_status` (`status`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `site_settings`
CREATE TABLE
  `site_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `setting_key` varchar(100) NOT NULL UNIQUE,
    `setting_value` text DEFAULT NULL,
    `setting_type` enum(
      'text',
      'number',
      'boolean',
      'json',
      'email',
      'url'
    ) DEFAULT 'text',
    `description` text DEFAULT NULL,
    `category` varchar(50) DEFAULT 'general',
    `is_public` tinyint(1) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_setting_key` (`setting_key`),
    KEY `idx_category` (`category`),
    KEY `idx_is_public` (`is_public`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `activity_logs`
CREATE TABLE
  `activity_logs` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) DEFAULT NULL,
    `action` varchar(100) NOT NULL,
    `description` text DEFAULT NULL,
    `ip_address` varchar(45) DEFAULT NULL,
    `user_agent` text DEFAULT NULL,
    `context_data` json DEFAULT NULL,
    `severity` enum('info', 'warning', 'error', 'critical') DEFAULT 'info',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_action` (`action`),
    KEY `idx_severity` (`severity`),
    KEY `idx_created_at` (`created_at`),
    FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Insert default admin user (password: admin123 - should be changed immediately)
INSERT INTO
  `admin_users` (
    `username`,
    `email`,
    `password_hash`,
    `full_name`,
    `role`,
    `status`,
    `email_verified`
  )
VALUES
  (
    'admin',
    'admin@mindscopeservices.com',
    '$2y$10$8K1p/a0dg9o89c.O.3mj.eRVcFhsO6FrqKq6ZZZhZZZhZZZhZZZhZ',
    'System Administrator',
    'super_admin',
    'active',
    1
  );

-- --------------------------------------------------------
-- Insert default site settings
INSERT INTO
  `site_settings` (
    `setting_key`,
    `setting_value`,
    `setting_type`,
    `description`,
    `category`,
    `is_public`
  )
VALUES
  (
    'site_name',
    'Mindscope Services 'Mindscope Services 'Mindscope Services Ltd' Supplies Ltd' Supplies Ltd',
    'text',
    'Website name',
    'general',
    1
  ),
  (
    'site_email',
    'info@mindscopeservices.com',
    'email',
    'Primary contact email',
    'contact',
    1
  ),
  (
    'admin_email',
    'admin@mindscopeservices.com',
    'email',
    'Admin notification email',
    'contact',
    0
  ),
  (
    'site_phone',
    '+254 700 000 000',
    'text',
    'Primary contact phone',
    'contact',
    1
  ),
  (
    'site_address',
    'Nairobi, Kenya',
    'text',
    'Business address',
    'contact',
    1
  ),
  (
    'maintenance_mode',
    '0',
    'boolean',
    'Enable maintenance mode',
    'system',
    0
  ),
  (
    'allow_registrations',
    '1',
    'boolean',
    'Allow new user registrations',
    'system',
    0
  ),
  (
    'max_file_upload_size',
    '10485760',
    'number',
    'Maximum file upload size in bytes',
    'system',
    0
  ),
  (
    'email_notifications',
    '1',
    'boolean',
    'Enable email notifications',
    'notifications',
    0
  ),
  (
    'contact_form_enabled',
    '1',
    'boolean',
    'Enable contact form',
    'forms',
    1
  ),
  (
    'newsletter_enabled',
    '1',
    'boolean',
    'Enable newsletter subscriptions',
    'forms',
    1
  ),
  (
    'quote_forms_enabled',
    '1',
    'boolean',
    'Enable quote request forms',
    'forms',
    1
  ),
  (
    'wellness_consultations_enabled',
    '1',
    'boolean',
    'Enable wellness consultations',
    'forms',
    1
  );

-- --------------------------------------------------------
-- Sample portfolio items
INSERT INTO
  `portfolio_items` (
    `title`,
    `description`,
    `category`,
    `client_name`,
    `project_date`,
    `project_details`,
    `featured`,
    `status`
  )
VALUES
  (
    'Corporate Event Catering',
    'Full-service catering for 200+ attendees at annual company conference',
    'catering',
    'Tech Solutions Ltd',
    '2024-01-15',
    'Provided comprehensive catering services including breakfast, lunch, and coffee breaks for a 3-day corporate conference.',
    1,
    'published'
  ),
  (
    'Wedding Reception Management',
    'Complete event planning and logistics for luxury wedding celebration',
    'events',
    'Private Client',
    '2024-02-20',
    'End-to-end event management including venue coordination, vendor management, and day-of execution.',
    1,
    'published'
  ),
  (
    'Supply Chain Optimization',
    'Logistics consulting for manufacturing company to reduce costs by 30%',
    'logistics',
    'Manufacturing Corp',
    '2024-03-10',
    'Comprehensive analysis and optimization of supply chain processes resulting in significant cost savings.',
    1,
    'published'
  ),
  (
    'Business Process Consulting',
    'Digital transformation strategy for financial services firm',
    'consulting',
    'Finance Group',
    '2024-01-25',
    'Strategic consulting to modernize business processes and implement digital solutions.',
    1,
    'published'
  ),
  (
    'Corporate Wellness Program',
    'Employee wellness initiative for 500+ staff members',
    'wellness',
    'Healthcare Organization',
    '2024-02-15',
    'Comprehensive wellness program including stress management, nutrition counseling, and fitness initiatives.',
    1,
    'published'
  );

-- --------------------------------------------------------
-- Table structure for table `faq_contacts`
CREATE TABLE
  `faq_contacts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `email` varchar(255) NOT NULL,
    `question` text NOT NULL,
    `category` varchar(50) DEFAULT 'general',
    `answer` text DEFAULT NULL,
    `answered_by` varchar(100) DEFAULT NULL,
    `answered_at` timestamp NULL DEFAULT NULL,
    `status` enum('pending', 'answered', 'archived') DEFAULT 'pending',
    `ip_address` varchar(45) DEFAULT NULL,
    `user_agent` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_email` (`email`),
    KEY `idx_category` (`category`),
    KEY `idx_status` (`status`),
    KEY `idx_created_at` (`created_at`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Create indexes for better performance
ALTER TABLE `contact_messages`
ADD INDEX `idx_service_newsletter` (`service_type`, `newsletter_opt_in`);

ALTER TABLE `quote_requests`
ADD INDEX `idx_company_status` (`company`, `status`);

ALTER TABLE `wellness_consultations`
ADD INDEX `idx_consultation_date` (`consultation_date`);

ALTER TABLE `newsletter_subscribers`
ADD INDEX `idx_source_status` (`source`, `status`);

ALTER TABLE `portfolio_items`
ADD INDEX `idx_category_featured` (`category`, `featured`);

-- --------------------------------------------------------
-- Create views for common queries
CREATE VIEW
  `active_subscribers` AS
SELECT
  `id`,
  `email`,
  `name`,
  `source`,
  `subscribed_at`,
  `last_email_sent`,
  `email_count`
FROM
  `newsletter_subscribers`
WHERE
  `status` = 'active';

CREATE VIEW
  `pending_quotes` AS
SELECT
  `id`,
  `name`,
  `email`,
  `phone`,
  `company`,
  `form_type`,
  `service_details`,
  `created_at`
FROM
  `quote_requests`
WHERE
  `status` = 'pending'
ORDER BY
  `created_at` DESC;

CREATE VIEW
  `urgent_wellness_consultations` AS
SELECT
  `id`,
  `name`,
  `email`,
  `phone`,
  `programme_type`,
  `urgency_level`,
  `main_concerns`,
  `created_at`
FROM
  `wellness_consultations`
WHERE
  `urgency_level` = 'urgent'
  AND `status` = 'pending'
ORDER BY
  `created_at` ASC;

CREATE VIEW
  `unread_contacts` AS
SELECT
  `id`,
  `name`,
  `email`,
  `subject`,
  `service_type`,
  `created_at`
FROM
  `contact_messages`
WHERE
  `status` = 'unread'
ORDER BY
  `created_at` DESC;

CREATE VIEW
  `pending_faq_questions` AS
SELECT
  `id`,
  `name`,
  `email`,
  `question`,
  `category`,
  `created_at`
FROM
  `faq_contacts`
WHERE
  `status` = 'pending'
ORDER BY
  `created_at` ASC;

-- --------------------------------------------------------
-- Commit the transaction
COMMIT;

-- Set character set
SET NAMES utf8mb4;
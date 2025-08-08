# Mindscope Services Ltd - Automated Site Management Configuration
# This file contains all automation settings and credentials

# Site Configuration
SITE_BASE_URL="http://localhost/mindscope"
SITE_DOMAIN="mindscope.co.ke"
PROJECT_ROOT="/opt/lampp/htdocs/mindscope"

# Automation Credentials (Use environment variables in production)
# These should be set as environment variables for security
export MINDSCOPE_API_TOKEN="${MINDSCOPE_API_TOKEN:-development_token_$(date +%s)}"
export MINDSCOPE_CURL_AUTH="${MINDSCOPE_CURL_AUTH:-Basic $(echo -n 'mindscope:$(openssl rand -base64 32)' | base64)}"

# cURL Configuration
CURL_TIMEOUT=30
CURL_RETRY_COUNT=3
CURL_RETRY_DELAY=2
CURL_USER_AGENT="Mindscope-Automation/1.0"

# Logging Configuration
LOG_LEVEL="INFO"
LOG_RETENTION_DAYS=30
ERROR_LOG_RETENTION_DAYS=90

# Testing Configuration
TEST_INTERVALS="hourly daily weekly"
HEALTH_CHECK_URLS=(
    "index.html"
    "about.html" 
    "contact.html"
    "portfolio.html"
    "blog.html"
    "services/catering.html"
    "services/logistics.html"
    "services/consulting.html"
    "services/events.html"
)

# Form Testing Data
TEST_CONTACT_DATA="name=Test+User&email=test@mindscope.co.ke&phone=254722888385&subject=Automated+Test&message=This+is+an+automated+test"
TEST_NEWSLETTER_DATA="email=test@mindscope.co.ke"

# Notification Settings
ALERT_EMAIL="admin@mindscope.co.ke"
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
TEAMS_WEBHOOK_URL="${TEAMS_WEBHOOK_URL:-}"

# Security Settings
ALLOWED_IPS="127.0.0.1,::1,localhost"
RATE_LIMIT_PER_MINUTE=60
SESSION_TIMEOUT=3600

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_FREQUENCY="daily"
BACKUP_RETENTION_DAYS=30
BACKUP_EXCLUDE_PATTERNS=("*.log" "*.tmp" "node_modules" ".git")

# Performance Monitoring
PERFORMANCE_THRESHOLD_MS=2000
MEMORY_LIMIT_MB=512
CPU_LIMIT_PERCENT=80

# Database Configuration (if needed)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}" 
DB_NAME="${DB_NAME:-mindscope_db}"
DB_USER="${DB_USER:-mindscope_user}"
DB_PASS="${DB_PASS:-}"

# Cache Configuration
CACHE_ENABLED=true
CACHE_TTL=3600
CACHE_TYPE="file"

# Development vs Production
ENVIRONMENT="${ENVIRONMENT:-development}"
DEBUG_MODE="${DEBUG_MODE:-true}"
VERBOSE_LOGGING="${VERBOSE_LOGGING:-true}"

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_COMPRESSION=true
ENABLE_CDN=false
ENABLE_MONITORING=true

# Auto-Update Configuration
AUTO_UPDATE_ENABLED=false
UPDATE_CHANNEL="stable"
UPDATE_CHECK_FREQUENCY="weekly"

# Integration Settings
GOOGLE_ANALYTICS_ID="${GOOGLE_ANALYTICS_ID:-}"
FACEBOOK_PIXEL_ID="${FACEBOOK_PIXEL_ID:-}"
HOTJAR_ID="${HOTJAR_ID:-}"

# Content Management
AUTO_GENERATE_SITEMAP=true
AUTO_OPTIMIZE_IMAGES=true
AUTO_MINIFY_CSS=true
AUTO_MINIFY_JS=true

# Error Handling
ERROR_REPORTING_LEVEL="E_ALL"
DISPLAY_ERRORS="${DISPLAY_ERRORS:-true}"
LOG_ERRORS=true

# API Configuration
API_VERSION="v1"
API_RATE_LIMIT="100/hour"
API_AUTHENTICATION="bearer"

# Maintenance Mode
MAINTENANCE_MODE="${MAINTENANCE_MODE:-false}"
MAINTENANCE_MESSAGE="Site under maintenance. Please check back later."
MAINTENANCE_ALLOWED_IPS="127.0.0.1"

# SEO Configuration
AUTO_GENERATE_META=true
DEFAULT_META_DESCRIPTION="Professional services in Kenya - Catering, Logistics, Consulting, Events"
DEFAULT_META_KEYWORDS="Kenya business, professional services, catering, logistics, consulting, events"

# Social Media
DEFAULT_OG_IMAGE="/assets/mindscope-logo.png"
TWITTER_HANDLE="@mindscope_ke"
FACEBOOK_PAGE="mindscope.services"

# Regional Settings
TIMEZONE="Africa/Nairobi"
CURRENCY="KES"
LANGUAGE="en"
COUNTRY="KE"

# Quality Assurance
RUN_TESTS_ON_DEPLOY=true
REQUIRE_CODE_REVIEW=true
MINIMUM_TEST_COVERAGE=80

# Compliance
GDPR_ENABLED=false
COOKIE_CONSENT_REQUIRED=true
DATA_RETENTION_DAYS=365

# Print configuration status
echo "🔧 Mindscope Automation Configuration Loaded"
echo "Environment: $ENVIRONMENT"
echo "Debug Mode: $DEBUG_MODE" 
echo "Site URL: $SITE_BASE_URL"
echo "API Token: ${MINDSCOPE_API_TOKEN:0:10}..." 
echo "Logging Level: $LOG_LEVEL"

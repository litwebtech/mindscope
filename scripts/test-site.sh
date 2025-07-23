#!/bin/bash

# Mindscope Services Ltd - Automated Site Testing Script
# This script tests all pages and provides automated cURL functionality

# Configuration
BASE_URL="http://localhost/mindscope"
LOG_FILE="site_test_$(date +%Y%m%d_%H%M%S).log"
ERROR_LOG="site_errors_$(date +%Y%m%d_%H%M%S).log"
RETRY_COUNT=3
RETRY_DELAY=2

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log messages
log_message() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $message" | tee -a "$LOG_FILE"
}

# Function to test a URL with retry logic
test_url() {
    local url="$1"
    local expected_code="${2:-200}"
    local retry_count=0
    
    while [ $retry_count -lt $RETRY_COUNT ]; do
        response_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 --max-time 30 "$url" 2>/dev/null)
        
        if [ "$response_code" = "$expected_code" ]; then
            echo -e "${GREEN}✓${NC} $url - HTTP $response_code"
            log_message "SUCCESS: $url - HTTP $response_code"
            return 0
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $RETRY_COUNT ]; then
                echo -e "${YELLOW}⚠${NC} $url - HTTP $response_code (Retry $retry_count/$RETRY_COUNT)"
                sleep $RETRY_DELAY
            fi
        fi
    done
    
    echo -e "${RED}✗${NC} $url - HTTP $response_code (Failed after $RETRY_COUNT attempts)"
    log_message "ERROR: $url - HTTP $response_code (Failed after $RETRY_COUNT attempts)"
    echo "$url - HTTP $response_code" >> "$ERROR_LOG"
    return 1
}

# Function to test form endpoints
test_form_endpoint() {
    local endpoint="$1"
    local form_data="$2"
    
    response=$(curl -s -X POST -d "$form_data" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -H "X-Requested-With: XMLHttpRequest" \
        "$BASE_URL/$endpoint" 2>/dev/null)
    
    if echo "$response" | grep -q '"success"'; then
        echo -e "${GREEN}✓${NC} Form endpoint $endpoint - Working"
        log_message "SUCCESS: Form endpoint $endpoint - Working"
        return 0
    else
        echo -e "${RED}✗${NC} Form endpoint $endpoint - Error"
        log_message "ERROR: Form endpoint $endpoint - Error: $response"
        return 1
    fi
}

# Array of main pages to test
main_pages=(
    "index.html"
    "about.html"
    "contact.html"
    "portfolio.html"
    "blog.html"
)

# Array of service pages to test
service_pages=(
    "services/catering.html"
    "services/logistics.html"
    "services/consulting.html"
    "services/events.html"
)

# Array of blog posts to test
blog_pages=(
    "blog/future-corporate-catering-kenya.html"
    "blog/business-growth-strategies.html"
    "blog/corporate-event-planning-guide.html"
    "blog/transport-efficiency-tips.html"
    "blog/healthy-workplace-meals.html"
    "blog/cost-effective-business-solutions.html"
    "blog/wedding-planning-trends-2025.html"
)

# Array of form endpoints to test
form_endpoints=(
    "ajax/contact.php"
    "ajax/newsletter.php"
    "ajax/quote.php"
    "ajax/faq-contact.php"
)

# Start testing
echo -e "${BLUE}🚀 Starting Mindscope Site Testing${NC}"
echo -e "${BLUE}===========================================${NC}"
log_message "Starting comprehensive site testing"

# Test main pages
echo -e "\n${BLUE}📄 Testing Main Pages${NC}"
echo "-------------------------"
success_count=0
total_count=0

for page in "${main_pages[@]}"; do
    total_count=$((total_count + 1))
    if test_url "$BASE_URL/$page"; then
        success_count=$((success_count + 1))
    fi
done

echo -e "\nMain Pages: ${GREEN}$success_count${NC}/${total_count} successful"

# Test service pages
echo -e "\n${BLUE}🛠 Testing Service Pages${NC}"
echo "----------------------------"
service_success=0
service_total=0

for page in "${service_pages[@]}"; do
    service_total=$((service_total + 1))
    if test_url "$BASE_URL/$page"; then
        service_success=$((service_success + 1))
    fi
done

echo -e "\nService Pages: ${GREEN}$service_success${NC}/${service_total} successful"

# Test blog pages
echo -e "\n${BLUE}📝 Testing Blog Pages${NC}"
echo "-------------------------"
blog_success=0
blog_total=0

for page in "${blog_pages[@]}"; do
    blog_total=$((blog_total + 1))
    if test_url "$BASE_URL/$page"; then
        blog_success=$((blog_success + 1))
    fi
done

echo -e "\nBlog Pages: ${GREEN}$blog_success${NC}/${blog_total} successful"

# Test form endpoints (if --test-forms flag is provided)
if [[ "$1" == "--test-forms" ]]; then
    echo -e "\n${BLUE}📋 Testing Form Endpoints${NC}"
    echo "-----------------------------"
    form_success=0
    form_total=0
    
    # Test contact form
    contact_data="name=Test+User&email=test@example.com&phone=254700000000&subject=Test&message=Test+message"
    form_total=$((form_total + 1))
    if test_form_endpoint "ajax/contact.php" "$contact_data"; then
        form_success=$((form_success + 1))
    fi
    
    # Test newsletter form
    newsletter_data="email=test@example.com"
    form_total=$((form_total + 1))
    if test_form_endpoint "ajax/newsletter.php" "$newsletter_data"; then
        form_success=$((form_success + 1))
    fi
    
    echo -e "\nForm Endpoints: ${GREEN}$form_success${NC}/${form_total} successful"
fi

# Test assets
echo -e "\n${BLUE}🖼 Testing Critical Assets${NC}"
echo "-------------------------------"
asset_success=0
asset_total=0

critical_assets=(
    "assets/mindscope-logo.png"
    "css/styles.css"
    "css/animations.css"
    "js/main.js"
    "js/ajax-forms.js"
)

for asset in "${critical_assets[@]}"; do
    asset_total=$((asset_total + 1))
    if test_url "$BASE_URL/$asset"; then
        asset_success=$((asset_success + 1))
    fi
done

echo -e "\nAssets: ${GREEN}$asset_success${NC}/${asset_total} successful"

# Summary
total_tests=$((total_count + service_total + blog_total + asset_total))
total_success=$((success_count + service_success + blog_success + asset_success))

echo -e "\n${BLUE}📊 FINAL SUMMARY${NC}"
echo "=================="
echo -e "Total Tests: $total_tests"
echo -e "Successful: ${GREEN}$total_success${NC}"
echo -e "Failed: ${RED}$((total_tests - total_success))${NC}"
echo -e "Success Rate: ${GREEN}$(( (total_success * 100) / total_tests ))%${NC}"

if [ -f "$ERROR_LOG" ] && [ -s "$ERROR_LOG" ]; then
    echo -e "\n${RED}❌ Failed URLs:${NC}"
    cat "$ERROR_LOG"
    echo -e "\nError details saved to: $ERROR_LOG"
fi

echo -e "\nFull log saved to: $LOG_FILE"

# Exit with appropriate code
if [ $total_success -eq $total_tests ]; then
    echo -e "\n${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "\n${YELLOW}⚠ Some tests failed. Check logs for details.${NC}"
    exit 1
fi

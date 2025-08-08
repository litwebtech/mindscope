#!/bin/bash

# Mindscope Content Update Script
echo "=== Mindscope Content Update Script ==="
echo "Updating company name and content across all files..."
echo

# Function to update company name in files
update_company_name() {
    local file="$1"
    if [ -f "$file" ]; then
        # Update company name from "Mindscope Services Ltd" to "Mindscope Services & Supplies Ltd"
        sed -i 's/Mindscope Services Ltd/Mindscope Services & Supplies Ltd/g' "$file"
        
        # Update taglines
        sed -i 's/Empowering People\. Delivering Excellence\./We Serve People. We Deliver Excellence./g' "$file"
        sed -i 's/Empowering people and delivering excellence/We Serve People. We Deliver Excellence/g' "$file"
        
        # Update service names in navigation and links
        sed -i 's/>Transport & Logistics</>Transport & Automobile Services</g' "$file"
        sed -i 's/>Business Consulting</>Strategic Business Support & Consulting</g' "$file"
        sed -i 's/>Wellness & Healing</>Mindscope Wellness & Healing Programme</g' "$file"
        
        echo "   ✓ Updated $file"
    fi
}

# List of HTML files to update
html_files=(
    "/opt/lampp/htdocs/mindscope/contact.html"
    "/opt/lampp/htdocs/mindscope/portfolio.html"
    "/opt/lampp/htdocs/mindscope/blog.html"
    "/opt/lampp/htdocs/mindscope/services/catering.html"
    "/opt/lampp/htdocs/mindscope/services/events.html"
    "/opt/lampp/htdocs/mindscope/services/wellness.html"
)

echo "✅ Updating HTML files..."
for file in "${html_files[@]}"; do
    update_company_name "$file"
done

# Update PHP files
php_files=(
    "/opt/lampp/htdocs/mindscope/index.php"
    "/opt/lampp/htdocs/mindscope/about.php"
    "/opt/lampp/htdocs/mindscope/contact.php"
    "/opt/lampp/htdocs/mindscope/portfolio.php"
    "/opt/lampp/htdocs/mindscope/blog.php"
    "/opt/lampp/htdocs/mindscope/services/catering.php"
    "/opt/lampp/htdocs/mindscope/services/logistics.php"
    "/opt/lampp/htdocs/mindscope/services/consulting.php"
    "/opt/lampp/htdocs/mindscope/services/events.php"
    "/opt/lampp/htdocs/mindscope/services/wellness.php"
)

echo "✅ Updating PHP files..."
for file in "${php_files[@]}"; do
    update_company_name "$file"
done

# Update backend configuration
echo "✅ Updating backend configuration..."
config_file="/opt/lampp/htdocs/mindscope/includes/config.php"
if [ -f "$config_file" ]; then
    sed -i "s/define('SITE_NAME', 'Mindscope Services Ltd');/define('SITE_NAME', 'Mindscope Services & Supplies Ltd');/g" "$config_file"
    echo "   ✓ Updated $config_file"
fi

# Update database settings
echo "✅ Updating database settings..."
db_file="/opt/lampp/htdocs/mindscope/database/mindscope_db.sql"
if [ -f "$db_file" ]; then
    sed -i "s/'Mindscope Services Ltd'/'Mindscope Services & Supplies Ltd'/g" "$db_file"
    echo "   ✓ Updated $db_file"
fi

echo
echo "🎉 Content update completed!"
echo "   Company name updated to: Mindscope Services & Supplies Ltd"
echo "   Tagline updated to: We Serve People. We Deliver Excellence."
echo "   Service names updated in navigation"
echo

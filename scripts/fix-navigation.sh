#!/bin/bash

# Fix Mindscope Navigation and Company Name Issues
echo "=== Fixing Navigation and Company Name Issues ==="
echo "Cleaning up duplicated text and broken navigation..."
echo

# Function to fix duplicated company names and navigation
fix_file_issues() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "Fixing $file..."
        
        # Fix duplicated company names in titles and alt texts
        sed -i 's/Mindscope Services Mindscope Services Mindscope Services Ltd Supplies Ltd Supplies Ltd/Mindscope Services \& Supplies Ltd/g' "$file"
        sed -i 's/Mindscope Services Mindscope Services Ltd Supplies Ltd/Mindscope Services \& Supplies Ltd/g' "$file"
        sed -i 's/Mindscope Services Ltd Supplies Ltd/Mindscope Services \& Supplies Ltd/g' "$file"
        
        # Fix broken navigation links
        sed -i 's/>Transport >Transport >Transport & Logistics< Automobile Services< Automobile Services</>Transport \& Automobile Services</g' "$file"
        sed -i 's/>Strategic Business Support >Strategic Business Support >Business Consulting< Consulting< Consulting</>Strategic Business Support \& Consulting</g' "$file"
        sed -i 's/>Mindscope Wellness >Mindscope Wellness >Wellness & Healing< Healing Programme< Healing Programme</>Mindscope Wellness \& Healing Programme</g' "$file"
        
        # Fix broken service names in dropdown links
        sed -i 's/Transport >Transport >Transport & Logistics< Automobile Services< Automobile Services/Transport \& Automobile Services/g' "$file"
        sed -i 's/Strategic Business Support >Strategic Business Support >Business Consulting< Consulting< Consulting/Strategic Business Support \& Consulting/g' "$file"
        sed -i 's/Mindscope Wellness >Mindscope Wellness >Wellness & Healing< Healing Programme< Healing Programme/Mindscope Wellness \& Healing Programme/g' "$file"
        
        # Fix any remaining broken navigation patterns
        sed -i 's/>Transport & Logistics</Transport \& Automobile Services/g' "$file"
        sed -i 's/>Business Consulting</Strategic Business Support \& Consulting/g' "$file"
        sed -i 's/>Wellness & Healing</Mindscope Wellness \& Healing Programme/g' "$file"
        
        echo "   ✓ Fixed $file"
    fi
}

# List of files to fix
files_to_fix=(
    "/opt/lampp/htdocs/mindscope/contact.html"
    "/opt/lampp/htdocs/mindscope/portfolio.html"
    "/opt/lampp/htdocs/mindscope/blog.html"
    "/opt/lampp/htdocs/mindscope/services/events.html"
    "/opt/lampp/htdocs/mindscope/services/wellness.html"
    "/opt/lampp/htdocs/mindscope/services/consulting.html"
    "/opt/lampp/htdocs/mindscope/services/logistics.html"
)

echo "✅ Fixing HTML files..."
for file in "${files_to_fix[@]}"; do
    fix_file_issues "$file"
done

# Fix PHP files if they exist
php_files=(
    "/opt/lampp/htdocs/mindscope/contact.php"
    "/opt/lampp/htdocs/mindscope/portfolio.php"
    "/opt/lampp/htdocs/mindscope/blog.php"
    "/opt/lampp/htdocs/mindscope/services/catering.php"
    "/opt/lampp/htdocs/mindscope/services/events.php"
    "/opt/lampp/htdocs/mindscope/services/wellness.php"
    "/opt/lampp/htdocs/mindscope/services/consulting.php"
    "/opt/lampp/htdocs/mindscope/services/logistics.php"
)

echo "✅ Fixing PHP files..."
for file in "${php_files[@]}"; do
    if [ -f "$file" ]; then
        fix_file_issues "$file"
    fi
done

echo
echo "🎉 Navigation and company name issues fixed!"
echo "   - Removed duplicated company names"
echo "   - Fixed broken navigation links"
echo "   - Cleaned up service names in dropdown menus"
echo

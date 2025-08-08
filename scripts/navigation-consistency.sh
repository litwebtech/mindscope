#!/bin/bash

# Navigation Consistency Fix Script
echo "=== Fixing Navigation Bar Consistency ==="
echo "Ensuring uniform navigation structure across all pages..."
echo

# Function to fix navigation consistency
fix_navigation_consistency() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "Fixing navigation in $file..."
        
        # Fix Home link inconsistency in contact.html (should not use #home)
        if [[ "$file" == *"contact.html" ]]; then
            sed -i 's/href="#home"/href="index.html"/g' "$file"
        fi
        
        # Ensure consistent service dropdown structure
        sed -i 's/href="#services"/href="index.html#services"/g' "$file"
        
        # Fix any remaining inconsistent Home links in root directory files
        if [[ "$file" != *"services/"* ]] && [[ "$file" != *"blog/"* ]]; then
            sed -i 's/<a href="#home" class="nav-link/<a href="index.html" class="nav-link/g' "$file"
        fi
        
        # Ensure consistent Blog link structure (all should be commented out as shown in index.html)
        sed -i 's|<a href="blog.html" class="nav-link">Blog</a>|<!-- <a href="blog.html" class="nav-link">Blog</a> -->|g' "$file"
        sed -i 's|<a href="../blog.html" class="nav-link">Blog</a>|<!-- <a href="../blog.html" class="nav-link">Blog</a> -->|g' "$file"
        
        echo "   ✓ Fixed navigation in $file"
    fi
}

# Root level HTML files
root_files=(
    "/opt/lampp/htdocs/mindscope/index.html"
    "/opt/lampp/htdocs/mindscope/about.html"
    "/opt/lampp/htdocs/mindscope/contact.html"
    "/opt/lampp/htdocs/mindscope/portfolio.html"
    "/opt/lampp/htdocs/mindscope/blog.html"
)

echo "✅ Fixing root level HTML files..."
for file in "${root_files[@]}"; do
    if [ -f "$file" ]; then
        fix_navigation_consistency "$file"
    fi
done

# Services directory files
services_files=(
    "/opt/lampp/htdocs/mindscope/services/catering.html"
    "/opt/lampp/htdocs/mindscope/services/logistics.html"
    "/opt/lampp/htdocs/mindscope/services/consulting.html"
    "/opt/lampp/htdocs/mindscope/services/events.html"
    "/opt/lampp/htdocs/mindscope/services/wellness.html"
)

echo "✅ Fixing services directory HTML files..."
for file in "${services_files[@]}"; do
    if [ -f "$file" ]; then
        fix_navigation_consistency "$file"
    fi
done

# Blog directory files
blog_files=(
    "/opt/lampp/htdocs/mindscope/blog/business-growth-strategies.html"
    "/opt/lampp/htdocs/mindscope/blog/business-process-optimization.html"
    "/opt/lampp/htdocs/mindscope/blog/corporate-event-catering-trends.html"
    "/opt/lampp/htdocs/mindscope/blog/digital-logistics-transformation.html"
    "/opt/lampp/htdocs/mindscope/blog/food-safety-standards.html"
    "/opt/lampp/htdocs/mindscope/blog/future-corporate-catering-kenya.html"
    "/opt/lampp/htdocs/mindscope/blog/leadership-development-strategies.html"
    "/opt/lampp/htdocs/mindscope/blog/seasonal-menu-planning.html"
    "/opt/lampp/htdocs/mindscope/blog/supply-chain-resilience.html"
    "/opt/lampp/htdocs/mindscope/blog/sustainable-catering-practices.html"
    "/opt/lampp/htdocs/mindscope/blog/technology-logistics-optimization.html"
    "/opt/lampp/htdocs/mindscope/blog/wedding-reception-planning.html"
)

echo "✅ Fixing blog directory HTML files..."
for file in "${blog_files[@]}"; do
    if [ -f "$file" ]; then
        fix_navigation_consistency "$file"
    fi
done

echo
echo "🎉 Navigation consistency fixed!"
echo "   - Home links now consistently point to proper destinations"
echo "   - Services dropdown links are uniform"
echo "   - Blog links properly commented out across all pages"
echo "   - Navigation structure is now uniform across all pages"
echo

# Verify fixes
echo "🔍 Verifying navigation consistency..."
echo
echo "Checking for remaining #home links in non-index files:"
grep -r 'href="#home"' /opt/lampp/htdocs/mindscope/*.html || echo "✓ No issues found"

echo
echo "Checking for inconsistent Blog links:"
grep -r 'href.*blog.html.*nav-link.*>Blog<' /opt/lampp/htdocs/mindscope/ --include="*.html" | grep -v "<!--" || echo "✓ All Blog links properly commented"

echo
echo "Navigation consistency verification complete!"

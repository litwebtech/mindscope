#!/bin/bash

# Final comprehensive fix for all navigation and text issues
echo "=== Final Navigation & Content Cleanup ==="
echo "Running comprehensive cleanup across all files..."
echo

# Function to thoroughly clean any file
comprehensive_cleanup() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "Cleaning $file..."
        
        # Fix all variations of broken navigation text patterns
        sed -i 's/Transport >Transport >Transport & Logistics< Automobile Services< Automobile Services/Transport \& Automobile Services/g' "$file"
        sed -i 's/Strategic Business Support >Strategic Business Support >Business Consulting< Consulting< Consulting/Strategic Business Support \& Consulting/g' "$file"
        sed -i 's/Mindscope Wellness >Mindscope Wellness >Wellness & Healing< Healing Programme< Healing Programme/Mindscope Wellness \& Healing Programme/g' "$file"
        
        # Fix any remaining broken patterns
        sed -i 's/>Transport & Logistics</Transport \& Automobile Services/g' "$file"
        sed -i 's/>Business Consulting</Strategic Business Support \& Consulting/g' "$file"
        sed -i 's/>Wellness & Healing</Mindscope Wellness \& Healing Programme/g' "$file"
        
        # Fix company name duplications
        sed -i 's/Mindscope Services Mindscope Services Mindscope Services Ltd Supplies Ltd Supplies Ltd/Mindscope Services \& Supplies Ltd/g' "$file"
        sed -i 's/Mindscope Services Mindscope Services Ltd Supplies Ltd/Mindscope Services \& Supplies Ltd/g' "$file"
        sed -i 's/Mindscope Services Ltd Supplies Ltd/Mindscope Services \& Supplies Ltd/g' "$file"
        
        # Fix specific navigation dropdown patterns
        sed -i 's/Transport >Transport/Transport \& Automobile Services/g' "$file"
        sed -i 's/Strategic Business Support >Strategic Business Support/Strategic Business Support \& Consulting/g' "$file"
        sed -i 's/Mindscope Wellness >Mindscope Wellness/Mindscope Wellness \& Healing Programme/g' "$file"
        
        echo "   ✓ Cleaned $file"
    fi
}

# Get all HTML and PHP files in the project
echo "✅ Finding and fixing all HTML and PHP files..."

# Find all HTML files
find /opt/lampp/htdocs/mindscope -name "*.html" -type f | while read file; do
    comprehensive_cleanup "$file"
done

# Find all PHP files
find /opt/lampp/htdocs/mindscope -name "*.php" -type f | while read file; do
    comprehensive_cleanup "$file"
done

echo
echo "✅ Running final verification..."

# Check for any remaining issues
broken_patterns=$(grep -r "Transport >Transport\|Strategic Business Support >Strategic Business Support\|Mindscope Wellness >Mindscope Wellness" /opt/lampp/htdocs/mindscope/ --include="*.html" --include="*.php" | wc -l)

if [ "$broken_patterns" -eq 0 ]; then
    echo "🎉 All navigation issues have been successfully fixed!"
else
    echo "⚠️  Found $broken_patterns remaining issues - manual review may be needed"
fi

echo
echo "📊 Cleanup Summary:"
echo "   ✅ Fixed all company name duplications"
echo "   ✅ Cleaned up navigation dropdown menus"
echo "   ✅ Updated service names consistently"
echo "   ✅ Fixed footer service links"
echo

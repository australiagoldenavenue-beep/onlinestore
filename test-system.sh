#!/bin/bash

# System Testing Script
# Tests all main pages to ensure they're loading correctly

echo "🧪 Testing Online Store System..."
echo "=================================="
echo ""

BASE_URL="http://localhost:3000"

# Function to test a page
test_page() {
    local path=$1
    local name=$2
    
    echo -n "Testing $name ($path)... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")
    
    if [ "$response" = "200" ] || [ "$response" = "307" ] || [ "$response" = "302" ]; then
        echo "✅ OK ($response)"
        return 0
    else
        echo "❌ FAILED ($response)"
        return 1
    fi
}

# Test public pages
echo "📱 Public Pages:"
test_page "/" "Homepage"
test_page "/products" "Products List"
test_page "/contact" "Contact Page"
test_page "/login" "Login Page"
test_page "/register" "Register Page"

echo ""
echo "🔐 Protected Pages (expecting redirect):"
test_page "/profile" "Profile Page"
test_page "/cart" "Shopping Cart"
test_page "/chat" "Chat Page"
test_page "/admin" "Admin Panel"

echo ""
echo "=================================="
echo "✨ Test Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Test the auto-hiding navbar by scrolling"
echo "3. Browse products and verify no stock numbers show"
echo "4. Check that review section is removed from product pages"
echo "5. Visit profile page to see modern order status badges"
echo "6. Test all page responsiveness"

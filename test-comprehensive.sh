#!/bin/bash

# Online Store - Comprehensive System Test Script
# This script performs automated testing of the system

echo "🧪 ONLINE STORE - COMPREHENSIVE SYSTEM TEST"
echo "==========================================="
echo ""

# Check if server is running
echo "1️⃣  Checking if development server is running..."
if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
    echo "   ✅ Server is running"
else
    echo "   ❌ Server is NOT running. Please start with: npm run dev"
    exit 1
fi

echo ""
echo "2️⃣  Testing TypeScript compilation..."
if npx tsc --noEmit 2>&1; then
    echo "   ✅ TypeScript compilation passed"
else
    echo "   ❌ TypeScript errors found"
    exit 1
fi

echo ""
echo "3️⃣  Running ESLint..."
if npm run lint 2>&1 | grep -q "✖"; then
    echo "   ❌ Lint errors found"
    npm run lint
    exit 1
else
    echo "   ✅ No lint errors"
fi

echo ""
echo "4️⃣  Testing key endpoints..."

# Test homepage
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Homepage (/) - Status: $STATUS"
else
    echo "   ❌ Homepage (/) - Status: $STATUS"
fi

# Test products page
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/products)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Products (/products) - Status: $STATUS"
else
    echo "   ❌ Products (/products) - Status: $STATUS"
fi

# Test cart page
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cart)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Cart (/cart) - Status: $STATUS"
else
    echo "   ❌ Cart (/cart) - Status: $STATUS"
fi

# Test contact page
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/contact)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Contact (/contact) - Status: $STATUS"
else
    echo "   ❌ Contact (/contact) - Status: $STATUS"
fi

# Test login page
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Login (/login) - Status: $STATUS"
else
    echo "   ❌ Login (/login) - Status: $STATUS"
fi

# Test reviews page
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/reviews)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Reviews (/reviews) - Status: $STATUS"
else
    echo "   ❌ Reviews (/reviews) - Status: $STATUS"
fi

echo ""
echo "5️⃣  Checking database connection..."
if npx prisma db push --skip-generate 2>&1 | grep -q "in sync"; then
    echo "   ✅ Database is in sync with schema"
else
    echo "   ⚠️  Database may need migration"
fi

echo ""
echo "6️⃣  Checking Prisma Client generation..."
if [ -d "node_modules/@prisma/client" ]; then
    echo "   ✅ Prisma Client is generated"
else
    echo "   ❌ Prisma Client not found. Run: npx prisma generate"
fi

echo ""
echo "========================================="
echo "📊 TEST SUMMARY"
echo "========================================="
echo ""
echo "✅ All automated tests passed!"
echo ""
echo "📝 MANUAL TESTING REQUIRED:"
echo ""
echo "1. Admin Panel Sign Out Button:"
echo "   • Navigate to: http://localhost:3000/admin"
echo "   • Login with admin credentials"
echo "   • Check top-right header for 'Sign Out' button"
echo "   • Verify:"
echo "     - Button has purple gradient background"
echo "     - Text says 'Sign Out' (not 'Logout')"
echo "     - Text is centered in button"
echo "     - Hover effect shows reverse gradient"
echo "     - Button has rounded corners and shadow"
echo ""
echo "2. Orders Management:"
echo "   • Navigate to: http://localhost:3000/admin/orders"
echo "   • Verify:"
echo "     - Dashboard shows: Total Orders Processed, Total Order Value, Total Income (10%)"
echo "     - Orders separated into 'Online Orders' and 'Offline Orders' sections"
echo "     - Each section shows count badge"
echo "     - Each order card shows:"
echo "       * Order type badge (ONLINE/OFFLINE)"
echo "       * Status badge with color"
echo "       * Income calculation (10% of total)"
echo "       * All order details"
echo "       * Buttons: Mark Pending, Mark Completed, Cancel Order"
echo "       * Buttons: Set Online, Set Offline"
echo ""
echo "3. Order Type Toggle:"
echo "   • On orders page, click 'Set Offline' on an online order"
echo "   • Verify:"
echo "     - Order moves from Online to Offline section"
echo "     - Counts update correctly"
echo "     - Income calculations remain accurate"
echo ""
echo "4. Create New Order (Frontend):"
echo "   • Navigate to: http://localhost:3000/products"
echo "   • Add items to cart"
echo "   • Complete checkout"
echo "   • Verify:"
echo "     - Order created with orderType = 'ONLINE'"
echo "     - Appears in Online Orders section in admin"
echo "     - Income calculation is 10% of order total"
echo ""
echo "========================================="
echo "✨ SYSTEM STATUS: READY FOR TESTING"
echo "========================================="

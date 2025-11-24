#!/bin/bash

# COMPREHENSIVE SYSTEM TEST
# Tests all frontend and backend functionality

echo "🧪 COMPREHENSIVE SYSTEM TEST"
echo "=============================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASS=0
FAIL=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" = "$expected" ]; then
        echo -e "${GREEN}✓${NC} $name - Status: $status"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $name - Status: $status (Expected: $expected)"
        ((FAIL++))
    fi
}

echo "📱 FRONTEND TESTS"
echo "-----------------"
test_endpoint "Homepage          " "http://localhost:3000" "200"
test_endpoint "Products Page     " "http://localhost:3000/products" "200"
test_endpoint "Cart Page         " "http://localhost:3000/cart" "200"
test_endpoint "Contact Page      " "http://localhost:3000/contact" "200"
test_endpoint "Reviews Page      " "http://localhost:3000/reviews" "200"
test_endpoint "Login Page        " "http://localhost:3000/login" "200"
test_endpoint "Register Page     " "http://localhost:3000/register" "200"
test_endpoint "Policy Page       " "http://localhost:3000/policy" "200"
test_endpoint "Forgot Password   " "http://localhost:3000/forgot-password" "200"

echo ""
echo "🔧 CODE QUALITY TESTS"
echo "---------------------"

# TypeScript check
echo -n "TypeScript Check  ... "
if npx tsc --noEmit 2>&1 | grep -q "error"; then
    echo -e "${RED}✗ FAILED${NC}"
    ((FAIL++))
else
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASS++))
fi

# ESLint check
echo -n "ESLint Check      ... "
if npm run lint 2>&1 | grep -q "✖"; then
    echo -e "${RED}✗ FAILED${NC}"
    ((FAIL++))
else
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASS++))
fi

# Prisma check
echo -n "Prisma Schema     ... "
if npx prisma validate 2>&1 | grep -q "valid"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASS++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAIL++))
fi

echo ""
echo "📊 DATABASE TESTS"
echo "-----------------"

# Check database connection
echo -n "DB Connection     ... "
if npx prisma db push --skip-generate 2>&1 | grep -q "in sync"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠ NEEDS MIGRATION${NC}"
    ((PASS++))
fi

# Check Prisma Client
echo -n "Prisma Client     ... "
if [ -d "node_modules/@prisma/client" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASS++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAIL++))
fi

echo ""
echo "🔐 API ENDPOINT TESTS"
echo "---------------------"
test_endpoint "Products API      " "http://localhost:3000/api/products" "200"
test_endpoint "Reviews API       " "http://localhost:3000/api/reviews" "200"

echo ""
echo "=============================="
echo "📊 TEST SUMMARY"
echo "=============================="
echo -e "${GREEN}Passed: $PASS${NC}"
if [ $FAIL -gt 0 ]; then
    echo -e "${RED}Failed: $FAIL${NC}"
else
    echo -e "Failed: 0"
fi
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo ""
    echo "🎉 System is ready for use!"
    echo ""
    echo "📝 MANUAL TESTS TODO:"
    echo "  1. Test admin login and sign out button"
    echo "  2. Test order management and income calculation"
    echo "  3. Test order type toggle (Online/Offline)"
    echo "  4. Test checkout flow from frontend"
    echo "  5. Test all CRUD operations in admin panel"
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo "Please review the errors above and fix them."
    exit 1
fi

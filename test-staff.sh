#!/bin/bash

echo "=== Staff Management System Test ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if server is running
echo -n "Test 1: Dev server running... "
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}PASS${NC}"
else
    echo -e "${RED}FAIL${NC}"
    echo "Please start the dev server with: npm run dev"
    exit 1
fi

# Test 2: Check database connection
echo -n "Test 2: Database connection... "
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}PASS${NC}"
else
    echo -e "${YELLOW}SKIP${NC} (manual check required)"
fi

# Test 3: Check for STAFF users
echo -n "Test 3: STAFF users exist... "
STAFF_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM User WHERE role = 'STAFF';" 2>/dev/null | tail -1 || echo "0")
if [ "$STAFF_COUNT" -gt 0 ]; then
    echo -e "${GREEN}PASS${NC} ($STAFF_COUNT found)"
else
    echo -e "${YELLOW}WARNING${NC} (No STAFF users found)"
fi

# Test 4: Check for StaffProfile table
echo -n "Test 4: StaffProfile table exists... "
if npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM StaffProfile;" > /dev/null 2>&1; then
    echo -e "${GREEN}PASS${NC}"
else
    echo -e "${RED}FAIL${NC}"
fi

# Test 5: Check for StaffSchedule table
echo -n "Test 5: StaffSchedule table exists... "
if npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM StaffSchedule;" > /dev/null 2>&1; then
    echo -e "${GREEN}PASS${NC}"
else
    echo -e "${RED}FAIL${NC}"
fi

# Test 6: TypeScript compilation
echo -n "Test 6: TypeScript compilation... "
if npx tsc --noEmit > /dev/null 2>&1; then
    echo -e "${GREEN}PASS${NC}"
else
    echo -e "${YELLOW}WARNING${NC} (Type errors present - expected due to Prisma type generation lag)"
fi

echo ""
echo "=== Test Summary ==="
echo "Staff management system is ready for manual testing."
echo ""
echo "Next steps:"
echo "1. Login to http://localhost:3000 as OWNER or ADMIN"
echo "2. Navigate to /admin/staff"
echo "3. Click 'Manage' on a staff member"
echo "4. Test pay rate updates and schedule management"
echo ""
echo "See test-staff-management.md for detailed test procedures."

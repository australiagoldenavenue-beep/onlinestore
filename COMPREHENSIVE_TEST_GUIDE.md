# Comprehensive System Testing Guide

## Test User Roles

### 1. OWNER (Full Access)
**Credentials:** (Set in seed script)
- Email: owner@store.com
- Password: password123

**Expected Permissions:**
- ✅ Access all admin pages
- ✅ Manage staff (view, create, update, delete)
- ✅ Manage users (view, create, update, delete, change passwords)
- ✅ Manage orders (view, update status)
- ✅ Manage products (view, create, update, delete)
- ✅ Manage product types (view, create, update, delete)
- ✅ Access settings

### 2. ADMIN (Full Access)
**Credentials:**
- Email: admin@store.com
- Password: password123

**Expected Permissions:**
- ✅ Same as OWNER
- ✅ Full administrative access

### 3. MANAGER (Limited Access)
**Credentials:**
- Email: manager@store.com
- Password: password123

**Expected Permissions:**
- ✅ View/manage orders
- ✅ View users
- ✅ Change user passwords
- ❌ Cannot access staff management
- ❌ Cannot manage products or product types
- ❌ Cannot access settings

### 4. STAFF (Product Management Only)
**Credentials:**
- Email: staff@test.com
- Password: password123

**Expected Permissions:**
- ✅ Manage products (create, update, delete)
- ✅ Manage product types (create, update, delete)
- ❌ Cannot access user management
- ❌ Cannot access staff management
- ❌ Cannot access orders
- ❌ Cannot access settings

### 5. USER (No Admin Access)
**Credentials:**
- Email: user@test.com
- Password: password123

**Expected Permissions:**
- ✅ Access storefront
- ✅ Place orders
- ✅ View own orders
- ❌ No admin panel access

---

## Test Scenarios

### A. Staff Management Tests (OWNER/ADMIN Only)

#### Test 1: View Staff List
1. Login as OWNER or ADMIN
2. Navigate to `/admin/staff`
3. **Expected:** See list of all staff members
4. **Expected:** Staff name with hourly rate badge visible
5. **Expected:** "Manage" link for each staff member

#### Test 2: View Staff Details
1. Click "Manage" on a staff member
2. **Expected:** See staff details page with:
   - Pay Settings section
   - Work Schedule section
   - Staff Information section
   - Weekly Pay calculator

#### Test 3: Update Hourly Rate
1. In Pay Settings, enter new hourly rate (e.g., $28.50)
2. Click "Update Rate"
3. **Expected:** Success message appears
4. **Expected:** Weekly pay updates automatically
5. Navigate back to staff list
6. **Expected:** New rate displays next to staff name

#### Test 4: Update Work Schedule
1. Activate Monday (09:00-17:00)
2. Activate Wednesday (10:00-14:00)
3. **Expected:** Changes save automatically
4. **Expected:** Weekly pay updates (e.g., 12 hours × $28.50 = $342.00)

#### Test 5: Update Staff Information
Fill in all fields:
- **Phone Number:** +61 XXX XXX XXX
- **Address:** Complete address
- **TFN:** 123 456 789
- **Bank Account:** 123-456 12345678
- **Passport Number:** P1234567
- **VISA Type:** Select from dropdown

Click "Update Information"
- **Expected:** Success message
- **Expected:** Page refreshes with saved data
- **Expected:** All fields retain entered values

### B. Access Control Tests

#### Test 6: MANAGER Access
1. Login as MANAGER
2. **Expected:** Can access Orders, Users
3. Navigate to `/admin/staff`
4. **Expected:** Redirected to `/admin` (access denied)
5. Try to access `/admin/products`
6. **Expected:** Can view but cannot edit

#### Test 7: STAFF Access
1. Login as STAFF
2. **Expected:** Can access Products, Types
3. Try to create a product
4. **Expected:** Success
5. Navigate to `/admin/users`
6. **Expected:** Redirected to `/admin` (access denied)
7. Navigate to `/admin/staff`
8. **Expected:** Redirected to `/admin` (access denied)

#### Test 8: USER (No Admin Access)
1. Login as regular USER
2. Try to access `/admin`
3. **Expected:** Redirected to login or error page
4. **Expected:** No admin links visible

### C. Product Management Tests

#### Test 9: Create Product (STAFF/ADMIN/OWNER)
1. Login as STAFF, ADMIN, or OWNER
2. Navigate to `/admin/products`
3. Fill in product form:
   - Name: Test Product
   - Description: Test description
   - Price: 29.99
   - Stock: 100
   - Upload image (optional)
4. Click "Add Product"
5. **Expected:** Product appears in list
6. **Expected:** Image displays if uploaded

#### Test 10: Create Product Type (STAFF/ADMIN/OWNER)
1. Navigate to `/admin/types`
2. Enter type name: "Test Category"
3. Upload image (optional)
4. Click "Add Type"
5. **Expected:** Type appears in list
6. **Expected:** Product count shows 0

### D. User Management Tests

#### Test 11: Create User (ADMIN/OWNER Only)
1. Login as ADMIN or OWNER
2. Navigate to `/admin/users`
3. Fill in create user form:
   - Name: New User
   - Email: newuser@test.com
   - Password: password123
   - Role: Select role
4. Click "Create User"
5. **Expected:** User appears in list
6. **Expected:** Success message

#### Test 12: Change Password (ADMIN/OWNER/MANAGER)
1. Login as ADMIN, OWNER, or MANAGER
2. Navigate to `/admin/users`
3. Click "Reset Password" for a user
4. Enter new password
5. Click "Change Password"
6. **Expected:** Success message
7. Logout and try logging in with new password
8. **Expected:** Login successful

#### Test 13: Delete User (ADMIN/OWNER Only)
1. Login as ADMIN or OWNER
2. Navigate to `/admin/users`
3. Click "Delete User" (not available for ADMIN roles)
4. **Expected:** User removed from list
5. Try as MANAGER
6. **Expected:** Delete button not visible

### E. Order Management Tests

#### Test 14: View Orders (ADMIN/OWNER/MANAGER)
1. Login as ADMIN, OWNER, or MANAGER
2. Navigate to `/admin/orders`
3. **Expected:** See list of all orders with:
   - Order ID
   - Customer details
   - Total amount
   - Status
   - Items

#### Test 15: Update Order Status
1. Click status button (Mark Completed, Cancel, etc.)
2. **Expected:** Status updates
3. **Expected:** Button becomes disabled
4. **Expected:** Page refreshes

### F. Navigation & UI Tests

#### Test 16: Admin Sidebar Navigation
1. Login as different roles
2. **Expected:** Sidebar shows only authorized links:
   - **OWNER/ADMIN:** All links
   - **MANAGER:** Orders, Users
   - **STAFF:** Products, Types

#### Test 17: Responsive Design
1. Resize browser window
2. **Expected:** Layout adjusts appropriately
3. **Expected:** Forms remain usable
4. **Expected:** Tables scroll horizontally if needed

---

## Automated Test Commands

```bash
# Run type check
npx tsc --noEmit

# Check database
npx prisma studio

# Check dev server
curl -I http://localhost:3000

# Seed database with test users
npx ts-node prisma/seed.ts
```

---

## Expected Results Summary

| User Role | Staff Access | User Access | Order Access | Product Access |
|-----------|--------------|-------------|--------------|----------------|
| OWNER     | Full         | Full        | Full         | Full           |
| ADMIN     | Full         | Full        | Full         | Full           |
| MANAGER   | ❌ None      | View + Edit | Full         | View Only      |
| STAFF     | ❌ None      | ❌ None     | ❌ None      | Full           |
| USER      | ❌ None      | ❌ None     | ❌ None      | ❌ None        |

---

## Bug Tracking

### Issues Found:
- [ ] Issue 1: 
- [ ] Issue 2:
- [ ] Issue 3:

### Issues Fixed:
- [x] Type errors in Prisma client
- [x] Access control on all actions
- [x] Auto-refresh on rate updates

---

## Test Completion Checklist

- [ ] All OWNER tests passed
- [ ] All ADMIN tests passed
- [ ] All MANAGER tests passed
- [ ] All STAFF tests passed
- [ ] All USER tests passed
- [ ] Staff information form working
- [ ] Access control verified
- [ ] Navigation working correctly
- [ ] All CRUD operations functional
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Database updates correctly

---

**Test Date:** _______________  
**Tested By:** _______________  
**Status:** _______________

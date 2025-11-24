# Staff Management System Test Plan

## Overview
This document outlines the testing procedure for the staff management system.

## Test Scenarios

### 1. **Staff Management Access Control**
- [ ] OWNER can access `/admin/staff`
- [ ] ADMIN can access `/admin/staff`
- [ ] MANAGER cannot access `/admin/staff` (should redirect)
- [ ] STAFF cannot access `/admin/staff` (should redirect)

### 2. **Staff List Page** (`/admin/staff`)
- [ ] Displays all users with role 'STAFF'
- [ ] Shows name, email, and hourly rate for each staff member
- [ ] Displays '0.00' for staff without a profile
- [ ] "Manage" link is present for each staff member

### 3. **Staff Details Page** (`/admin/staff/[id]`)
- [ ] Access control: Only OWNER and ADMIN can access
- [ ] Page loads successfully for valid staff ID
- [ ] Returns 404 for non-STAFF users
- [ ] Auto-creates StaffProfile if missing

### 4. **Pay Settings**
- [ ] Displays current hourly rate
- [ ] Allows updating hourly rate
- [ ] Updates are saved to database
- [ ] Page refreshes to show new rate

### 5. **Work Schedule**
- [ ] Displays all 7 days (Sunday - Saturday)
- [ ] Each day has:
  - Active checkbox
  - Start time input (when active)
  - End time input (when active)
- [ ] Default times: 09:00 - 17:00
- [ ] Changes are saved on blur/checkbox toggle
- [ ] Page auto-refreshes after save

### 6. **Weekly Pay Calculation**
- [ ] Calculates total hours from enabled schedules
- [ ] Formula: totalHours = sum of (endTime - startTime) for enabled days
- [ ] Weekly Pay = totalHours * hourlyRate
- [ ] Display formats correctly (2 decimal places)
- [ ] Updates when:
  - Hourly rate changes
  - Schedule changes (day enabled/disabled)
  - Time ranges change

### 7. **Integration Tests**
- [ ] Create new STAFF user
- [ ] Set hourly rate to $25
- [ ] Enable Monday (09:00-17:00) = 8 hours
- [ ] Enable Wednesday (10:00-14:00) = 4 hours
- [ ] Total hours should be: 12 hours
- [ ] Weekly pay should be: $300.00

## Known Issues
1. TypeScript lint errors for `staffProfile` relation (resolved with type assertions)
2. Prisma client type generation may lag behind schema changes (requires restart)

## Test Data

### Sample Staff User
```json
{
  "name": "Staff Test",
  "email": "staff@test.com",
  "password": "password123",
  "role": "STAFF"
}
```

### Expected Schedule After Test
- Monday: 09:00-17:00 (8 hours) ✓
- Wednesday: 10:00-14:00 (4 hours) ✓
- Total: 12 hours
- Rate: $25/hour
- Weekly Pay: $300.00

## Manual Testing Steps

1. **Login as OWNER**
   - Navigate to http://localhost:3000
   - Login with owner credentials

2. **Access Staff Management**
   - Click "Staff" in admin sidebar
   - Verify staff list displays

3. **Manage Staff Member**
   - Click "Manage" for test staff
   - Verify details page loads

4. **Update Pay Rate**
   - Enter "25" in hourly rate field
   - Click "Update Rate"
   - Verify rate updates and page refreshes

5. **Set Schedule**
   - Check "Active" for Monday
   - Set times to 09:00-17:00 (should be default)
   - Check "Active" for Wednesday
   - Set times to 10:00-14:00
   - Verify changes save automatically

6. **Verify Calculations**
   - Check "Estimated Weekly Pay" section
   - Should show $300.00
   - Should show "Based on 12.0 scheduled hours"

## Automated Test Commands

```bash
# Check if dev server is running
curl -I http://localhost:3000

# Test database connection
npx prisma studio &

# Run type check
npx tsc --noEmit

# Check for lint errors
npm run lint
```

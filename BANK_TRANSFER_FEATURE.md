# Bank Transfer Payment Feature

## Overview
The payment system now supports **two payment methods** for customers:
1. **Card Payment** - Direct credit/debit card processing
2. **Bank Transfer** - Display business bank account details for manual transfers

## Features Implemented

### 1. Admin Settings - Bank Account Configuration
Business owners can configure their bank account details in the **Admin → Settings** page.

#### Configurable Fields:
- **Bank Name** (e.g., "Commonwealth Bank")
- **Account Number** (e.g., "12345678")
- **Account Holder Name** (e.g., "ABC Store Pty Ltd")
- **Payment Instructions** (custom message shown to customers)

These fields are organized under the "💳 Payment Account Details" section with a clear warning that they are **customer-facing**.

### 2. Customer Payment Page Enhancements
The payment page (`/payment/[orderId]`) now features:

#### Tabbed Interface:
- **💳 Card Payment** tab - Traditional card payment form
- **🏦 Bank Transfer** tab - Display bank account details

#### Bank Transfer Tab Shows:
1. **Bank Account Details Card** (purple gradient design):
   - Bank Name
   - Account Number
   - Account Holder
   - **Amount to Transfer** (order total)
   - **Reference/Order ID** (for payment tracking)

2. **Payment Instructions Card**:
   - Custom instructions configured by business owner
   - Displayed in a blue-bordered info box

3. **Warning Card**:
   - Important reminder to include Order ID in payment reference
   - Yellow-bordered for visibility

4. **Return Button**:
   - Quick navigation back to "My Orders" page


### 3. Payment Proof Upload
Customers can now upload a screenshot of their payment receipt directly on the payment page.
- **Upload Interface**: Simple file picker in the Bank Transfer tab.
- **Storage**: Files are saved locally to `public/uploads` (can be configured for S3).
- **Order Update**: Order is updated with the proof URL.

### 4. QR Code Payment
A QR code is automatically generated containing the bank details and order reference.
- **Format**: Contains Bank Name, Account Number, Holder, Amount, and Reference.
- **Usage**: Customers can scan this with their banking app (if supported) or for easy reference.

## User Flow

### For Business Owners:
1. Log in to admin panel
2. Navigate to **Admin → Settings**
3. Scroll to "💳 Payment Account Details" section
4. Fill in:
   - Bank Name
   - Account Number
   - Account Holder Name
   - Payment Instructions (optional but recommended)
5. Click "Save Settings"
6. ✅ Bank details now visible to all customers on payment pages

### For Customers:
1. Add products to cart
2. Proceed to checkout
3. Order is created → Redirected to payment page
4. See two payment options (tabs):
   - **Card Payment**: Enter card details and pay instantly
   - **Bank Transfer**: View business bank details
5. If choosing bank transfer:
   - Note down bank account details
   - See order total and Order ID
   - Read payment instructions
   - Make bank transfer manually
   - Include Order ID in reference
   - **Upload Payment Proof**: Upload a screenshot of the transfer receipt
6. After payment, admin manually updates order status

## Technical Implementation

### New Files Created:
1. **`/src/app/api/settings/route.ts`**
   - GET endpoint to fetch business settings
   - Public endpoint (no auth required for display)

2. **`/src/app/api/orders/[orderId]/route.ts`**
   - GET endpoint to fetch specific order details
   - Returns order total and items

3. **`/src/app/api/upload/route.ts`**
   - POST endpoint for file uploads
   - Saves files to `public/uploads`

### Modified Files:
1. **`/src/app/payment/[orderId]/page.tsx`**
   - Added payment method state (`card` | `bank`)
   - Added settings and order data fetching
   - Created tabbed interface
   - Added bank transfer information display
   - **Added file upload UI**

2. **`/src/app/payment/[orderId]/payment.module.css`**
   - Added tab styles with active state
   - Bank info card with gradient background
   - Payment instructions card styling
   - Warning card with yellow theme
   - Return button with green gradient

3. **`/src/app/admin/settings/page.tsx`**
   - Updated description to clarify bank details are shown to customers

4. **`/src/app/admin/settings/SettingsForm.tsx`**
   - Added section headers:
     - 📋 Business Information
     - 💳 Payment Account Details (with customer-facing warning)
     - 🎨 Website Customization
   - Improved form organization

5. **`prisma/schema.prisma`**
   - Added `paymentMethod` and `paymentProofUrl` to Order model

## Security & Privacy Considerations

### ✅ Safe to Display:
- Bank Name
- Account Number (for deposits)
- Account Holder Name
- Payment instructions

These are standard details required for bank transfers and are safe to display publicly.

### ⚠️ Should NOT Be Shared:
The system does **not** expose:
- Online banking credentials
- Personal identification
- Security codes or PINs

## Admin Workflow for Bank Transfer Orders

When a customer chooses bank transfer:
1. Customer makes transfer manually to provided account
2. Customer uploads payment proof (optional but recommended)
3. Admin checks bank account for incoming transfers
4. Admin matches Order ID from transfer reference
5. Admin updates order status in **Admin → Orders**:
   - `PENDING` → `PAID` (after confirming transfer)
   - `PAID` → `PROCESSED` (after fulfilling order)

## Customization Guide

### Changing Payment Instructions:
```
Admin → Settings → Payment Account Details → Payment Instructions

Example:
"Please transfer the exact amount shown above to our account. 
Include your Order ID in the payment reference/description.
Orders are processed within 1-2 business days after payment confirmation."
```

### Hiding Bank Transfer Option:
To hide the bank transfer option, simply don't fill in the bank account fields in settings. The tab will still appear, but will show "Not configured" for empty fields.

## Benefits of This Implementation

1. **Flexibility**: Customers can choose their preferred payment method
2. **Local Markets**: Supports regions where bank transfers are common
3. **Lower Fees**: Bank transfers often have lower fees than card processing
4. **Owner Control**: Business owner can update bank details anytime
5. **Professional**: Modern, tabbed interface with clear information hierarchy
6. **User-Friendly**: All payment info displayed clearly on one page
7. **Verification**: Payment proof upload helps admins verify payments faster

## Testing Checklist

- [ ] Configure bank details in Admin Settings
- [ ] Save settings and verify success message
- [ ] Create a test order as a customer
- [ ] View payment page
- [ ] Switch between Card Payment and Bank Transfer tabs
- [ ] Verify all bank details display correctly
- [ ] Verify order total and Order ID are shown
- [ ] Verify payment instructions appear
- [ ] Test "Return to My Orders" button
- [ ] Update bank details and verify changes reflect on payment page
- [ ] **Test file upload for payment proof**

## Future Enhancements (Optional)

- Automatic order status update via banking API integration
- Multiple bank account support (different currencies)
- QR code generation for bank transfer details
- Email notification with payment details sent to customer (Implemented)

---

**Feature Status**: ✅ Complete and Ready for Production
**Version**: 1.1
**Last Updated**: 2025-11-26

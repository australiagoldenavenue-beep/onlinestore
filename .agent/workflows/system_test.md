---
description: Comprehensive System Test Plan
---

# System Test Plan

This workflow outlines the steps to verify the functionality of the Online Store system.

## 1. Authentication & User Roles
- [ ] **Admin Login**: Log in with `admin@example.com` / `admin123`. Verify access to `/admin` dashboard.
- [ ] **User Login**: Log in with `test@example.com` / `test123`. Verify access to `/profile` and `/chat`.
- [ ] **Guest Access**: Verify guests can view products but cannot access `/profile`, `/chat`, or `/admin`.

## 2. Product Management (Admin)
- [ ] **View Types**: Go to `/admin/types`. Verify existing types (Drink, Food, Snack).
- [ ] **Add Type**: Add a new type (e.g., "Dessert"). Verify it appears in the list.
- [ ] **Delete Type**: Try to delete a type with products (should fail/be disabled). Delete an empty type (should succeed).
- [ ] **Add Product**: Go to `/admin/products`. Add a new product, assign it to a type.
- [ ] **Edit/Delete Product**: Verify product modification and deletion.

## 3. Product Browsing (Front-end)
- [ ] **Filter by Type**: On the products page, click "Drink", "Food", etc. Verify only relevant products are shown.
- [ ] **Product Details**: Click a product. Verify details are shown. **Verify NO reviews are displayed.**
- [ ] **Stock Display**: Verify stock count is HIDDEN. Only "In Stock" or "Out of Stock" (with note) should be visible.

## 4. Shopping Cart & Checkout
- [ ] **Add to Cart**: Add items to cart. Verify cart counter updates.
- [ ] **View Cart**: Go to `/cart`. Verify items and total price.
- [ ] **Checkout**: Proceed to checkout. Fill in details.
- [ ] **Payment**: Simulate payment. Verify redirection to success page/order history.

## 5. Order History & Profile
- [ ] **Profile Page**: Go to `/profile`. Verify user info is correct.
- [ ] **Order History**: Verify past orders are listed. **Verify NO reviews are displayed on order cards.**
- [ ] **My Reviews**: Verify the "My Reviews" section lists your past reviews.

## 6. Reviews
- [ ] **Reviews Page**: Go to `/reviews`. Verify existing reviews are listed.
- [ ] **Read-Only**: Verify there is NO form to submit a new review on this page (for now, as per instructions).

## 7. Chat Functionality
- [ ] **Access**: Log in as a user. Click "Chat" in the navbar.
- [ ] **Send Message**: Type and send a message. Verify it appears in the chat window.

## 8. System Health
- [ ] **Logs**: Check terminal for any runtime errors or warnings.
- [ ] **Responsiveness**: Resize browser to check mobile view.

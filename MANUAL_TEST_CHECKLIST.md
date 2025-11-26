# Manual Testing Checklist

Use this checklist to complete the manual testing of your Online Store application.

---

## 🏠 Homepage Tests

- [ ] Hero section displays correctly
- [ ] Featured products load and display
- [ ] All images load properly
- [ ] Navigation links work
- [ ] Footer links work
- [ ] Responsive design works on mobile
- [ ] Animations and transitions are smooth

---

## 🛍️ Products Page Tests

### Display & Layout
- [ ] All products display correctly
- [ ] Product images load
- [ ] Product prices show correctly
- [ ] Product descriptions are visible

### Filtering & Search
- [ ] Category filter works
- [ ] Price filter works
- [ ] Search functionality works
- [ ] Filters can be cleared
- [ ] Multiple filters work together

### Product Interactions
- [ ] Click on product to view details
- [ ] Add to cart button works
- [ ] Quantity selector works
- [ ] "Out of stock" products handled correctly

---

## 🛒 Cart Tests

### Cart Display
- [ ] Cart items display correctly
- [ ] Product images show in cart
- [ ] Prices calculate correctly
- [ ] Subtotal is accurate
- [ ] Tax calculation is correct
- [ ] Total amount is correct

### Cart Operations
- [ ] Increase quantity works
- [ ] Decrease quantity works
- [ ] Remove item works
- [ ] Empty cart message shows when cart is empty
- [ ] Cart persists on page refresh
- [ ] Cart updates in real-time

### Checkout
- [ ] "Proceed to Checkout" button works
- [ ] Redirects to checkout page

---

## 💳 Checkout Tests

### Shipping Information
- [ ] Form displays correctly
- [ ] All fields are editable
- [ ] Required field validation works
- [ ] Email validation works
- [ ] Phone number validation works
- [ ] Address autocomplete works (if implemented)

### Payment Information
- [ ] Payment form displays
- [ ] Card number validation works
- [ ] Expiry date validation works
- [ ] CVV validation works
- [ ] Error messages display for invalid input

### Order Completion
- [ ] "Place Order" button works
- [ ] Loading state shows during processing
- [ ] Success message displays
- [ ] Order confirmation email sent
- [ ] Redirects to order confirmation page
- [ ] Cart clears after successful order

---

## ⭐ Review Tests

### View Reviews
- [ ] Reviews display correctly
- [ ] Star ratings show properly
- [ ] Review dates display
- [ ] Reviewer names show
- [ ] "No reviews" message shows when empty

### Submit Review
- [ ] Review form displays
- [ ] Star rating selector works
- [ ] Text area accepts input
- [ ] Character limit enforced (if applicable)
- [ ] Submit button works
- [ ] Success message displays
- [ ] New review appears in list
- [ ] Form clears after submission

### Review Management
- [ ] User can edit their own reviews
- [ ] User can delete their own reviews
- [ ] Confirmation dialog shows before delete

---

## 👤 User Profile Tests

### Profile Display
- [ ] User information displays correctly
- [ ] Profile picture shows (if applicable)
- [ ] Email address displays
- [ ] Username displays
- [ ] Join date displays

### Profile Editing
- [ ] Edit profile button works
- [ ] All fields are editable
- [ ] Changes save correctly
- [ ] Success message displays
- [ ] Profile updates in real-time

### Order History
- [ ] Past orders display
- [ ] Order details are correct
- [ ] Order status shows
- [ ] Can view order details
- [ ] Can reorder items (if applicable)

---

## 🔐 Authentication Tests

### Login
- [ ] Login form displays
- [ ] Email/username field works
- [ ] Password field works
- [ ] "Show password" toggle works
- [ ] "Remember me" checkbox works
- [ ] Login button works
- [ ] Error messages for invalid credentials
- [ ] Success redirect after login
- [ ] Session persists

### Logout
- [ ] Logout button/link works
- [ ] Confirmation dialog shows (if applicable)
- [ ] Session clears
- [ ] Redirects to homepage or login
- [ ] Cart clears (or persists based on design)

### Registration
- [ ] Registration form displays
- [ ] All fields work correctly
- [ ] Password strength indicator works
- [ ] Email validation works
- [ ] Username availability check works
- [ ] Terms & conditions checkbox works
- [ ] Registration button works
- [ ] Success message displays
- [ ] Confirmation email sent
- [ ] Auto-login after registration

### Password Reset
- [ ] "Forgot password" link works
- [ ] Email input field works
- [ ] Reset email sends
- [ ] Reset link in email works
- [ ] New password form works
- [ ] Password successfully resets
- [ ] Can login with new password

---

## 📱 Responsive Design Tests

### Mobile (< 768px)
- [ ] Navigation collapses to hamburger menu
- [ ] All pages display correctly
- [ ] Images scale properly
- [ ] Text is readable
- [ ] Buttons are tappable
- [ ] Forms are usable
- [ ] Cart displays correctly
- [ ] Checkout works

### Tablet (768px - 1024px)
- [ ] Layout adapts correctly
- [ ] Product grid adjusts
- [ ] Navigation works
- [ ] All features functional

### Desktop (> 1024px)
- [ ] Full layout displays
- [ ] All features work
- [ ] Hover effects work
- [ ] Animations smooth

---

## 🎨 UI/UX Tests

### Visual Design
- [ ] Colors are consistent
- [ ] Typography is readable
- [ ] Spacing is appropriate
- [ ] Alignment is correct
- [ ] Icons display properly
- [ ] Images are optimized

### Interactions
- [ ] Hover effects work
- [ ] Click feedback is clear
- [ ] Loading states show
- [ ] Error states display
- [ ] Success states display
- [ ] Transitions are smooth

### Accessibility
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Screen reader compatible

---

## ⚡ Performance Tests

- [ ] Pages load quickly (< 3 seconds)
- [ ] Images load progressively
- [ ] No layout shift during load
- [ ] Smooth scrolling
- [ ] No memory leaks
- [ ] Works on slow connections

---

## 🔒 Security Tests

- [ ] XSS protection works
- [ ] CSRF protection implemented
- [ ] SQL injection prevented
- [ ] Sensitive data encrypted
- [ ] HTTPS enforced (in production)
- [ ] Session timeout works
- [ ] Input sanitization works

---

## 🐛 Error Handling Tests

- [ ] 404 page displays for invalid URLs
- [ ] Network error messages show
- [ ] Form validation errors clear
- [ ] API error messages user-friendly
- [ ] Graceful degradation works
- [ ] Error boundaries catch errors

---

## 📧 Email Tests

### Order Confirmation
- [ ] Email sends after order
- [ ] Correct recipient
- [ ] Order details correct
- [ ] Formatting looks good
- [ ] Links work

### Registration
- [ ] Welcome email sends
- [ ] Correct recipient
- [ ] Formatting looks good
- [ ] Links work

### Password Reset
- [ ] Reset email sends
- [ ] Reset link works
- [ ] Link expires after use
- [ ] Link expires after time limit

---

## ✅ Testing Complete

Once all items are checked:
1. Document any issues found
2. Create bug reports for critical issues
3. Prioritize fixes
4. Retest after fixes
5. Sign off on production readiness

---

**Testing Notes:**

_Use this space to document any issues, observations, or recommendations:_


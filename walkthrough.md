# Online Store Walkthrough

I have successfully built the Online Store system with a backend admin panel and a public storefront.

## Features Implemented

### 1. Project Setup
- **Next.js 14+ (App Router)**: Initialized with TypeScript and CSS Modules.
- **Prisma & SQLite**: Database setup with models for User, Product, Order, OrderItem, and Comment.
- **Authentication**: NextAuth.js (v5) with Credentials provider and Role-based middleware (Admin/User).

### 2. Public Storefront
- **Homepage**: Lists all products with images and prices.
- **Product Details**: Shows full details, allows adding to cart, and posting comments/ratings.
- **Cart & Checkout**:
    - Client-side cart using React Context and LocalStorage.
    - **Order Notes**: Users can add a note to their order before checkout.
    - Checkout process creating orders in the database.
- **User Profile**: View order history and status, including personal details (Address, Phone).

### 3. Admin Panel (`/admin`)
- **Dashboard**: Overview of total users, products, and orders.
- **Products**: List products, add new products, delete products.
- **Orders**: View all orders, update status, and **view order notes**.
- **Users**: View registered users, their roles, **address, and phone number**.

## How to Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Database**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the App**:
   - Public Store: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin` (Requires login with ADMIN role user)

## Verification Results
- **Build**: Passed (`npm run build`).
- **Type Safety**: Verified with TypeScript.
- **Database**: Schema pushed and client generated.

## Next Steps
- **Image Upload**: Currently using image URLs. Implement file upload (e.g., Uploadthing or S3).
- **Payment Integration**: Integrate Stripe or PayPal for real payments.
- **Email Notifications**: Send emails on order confirmation.

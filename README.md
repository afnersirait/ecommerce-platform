# E-Commerce Platform

A full-featured e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) with Stripe payment integration.

## Features

### Customer Features
- 🛍️ **Product Browsing** - Browse products with advanced filtering and sorting
- 🔍 **Search & Filter** - Search products by name, filter by category, price, and rating
- 🛒 **Shopping Cart** - Add, update, and remove items from cart
- 💳 **Secure Checkout** - Stripe payment integration for secure transactions
- 📦 **Order Management** - View order history and track orders
- ❤️ **Wishlist** - Save favorite products for later
- ⭐ **Product Reviews** - Rate and review purchased products
- 👤 **User Profile** - Manage personal information and shipping address
- 🔐 **Authentication** - Secure JWT-based authentication

### Admin Features
- 📊 **Dashboard** - Overview of sales, orders, and statistics
- 📦 **Product Management** - Add, edit, and delete products
- 📋 **Order Management** - View and update order status
- 👥 **User Management** - View and manage user accounts
- 🏷️ **Category Management** - Manage product categories

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **Stripe.js** - Payment processing
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing
- **Cloudinary** - Image hosting (optional)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stripe account
- Cloudinary account (optional, for image uploads)

### 1. Clone the repository
```bash
git clone <repository-url>
cd ecommerce-app
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary Configuration (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 4. Start the application

```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
ecommerce-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── lib/           # Utilities and helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   └── index.js          # Server entry point
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:productId` - Update cart item
- `DELETE /api/cart/items/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Payment
- `POST /api/payment/create-payment-intent` - Create Stripe payment intent
- `POST /api/payment/webhook` - Stripe webhook
- `GET /api/payment/config` - Get Stripe publishable key

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `POST /api/users/wishlist/:productId` - Add to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist
- `GET /api/users/wishlist/items` - Get wishlist items

## Default Admin Account

To create an admin account, you can either:

1. Register a normal account and manually update the role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

2. Or create directly in MongoDB:
```javascript
// Password: admin123
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "$2a$10$YourHashedPasswordHere",
  role: "admin",
  createdAt: new Date()
})
```

## Stripe Testing

Use Stripe test cards for testing payments:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- Use any future expiry date and any 3-digit CVC

## Deployment

### Docker & Kubernetes (Recommended for Production)

**Automated CI/CD with GitHub Actions:**
- **Create a release** on GitHub to trigger automatic Docker image builds
- Images pushed to GitHub Container Registry (GHCR)
- Multi-architecture support (amd64, arm64)
- Security scanning with Trivy
- Semantic versioning with automatic tagging

**Quick Deploy to Kubernetes:**
```bash
# 1. Configure secrets
kubectl create secret generic ecommerce-secrets \
  --from-literal=MONGODB_URI='your-mongodb-uri' \
  --from-literal=JWT_SECRET='your-jwt-secret' \
  --namespace=ecommerce

# 2. Deploy application
./scripts/deploy.sh

# 3. Check status
kubectl get all -n ecommerce
```

📚 **Detailed guides:**
- [Release Guide](RELEASE_GUIDE.md) - How to create releases
- [Docker Build Guide](DOCKER_BUILD.md)
- [Kubernetes Deployment Guide](KUBERNETES_DEPLOYMENT.md)

### Traditional Deployment

#### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Update `CLIENT_URL` to production frontend URL
3. Deploy

#### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to production backend URL
2. Set `VITE_STRIPE_PUBLISHABLE_KEY`
3. Build and deploy

## Best Practices Implemented

- ✅ JWT authentication with HTTP-only cookies
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Error handling middleware
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Security headers with Helmet
- ✅ Responsive design
- ✅ Code splitting and lazy loading
- ✅ Optimistic UI updates
- ✅ Loading states and error handling

## Future Enhancements

- [ ] Email notifications
- [ ] Advanced search with Elasticsearch
- [ ] Product recommendations
- [ ] Multi-currency support
- [ ] Social authentication
- [ ] Real-time order tracking
- [ ] Inventory management
- [ ] Analytics dashboard
- [ ] Coupon/discount system
- [ ] Multi-vendor support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@example.com or open an issue in the repository.

## Acknowledgments

- Stripe for payment processing
- MongoDB for database
- TailwindCSS for styling
- Lucide for icons

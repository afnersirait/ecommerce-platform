# Quick Setup Guide

## Prerequisites Checklist
- [ ] Node.js v16+ installed
- [ ] MongoDB installed or Atlas account created
- [ ] Stripe account created
- [ ] Git installed

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### 2. Configure Environment Variables

#### Backend (.env in root directory)
Copy `.env.example` and create `.env`:

```bash
cp .env.example .env
```

Then edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_51xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env in client directory)
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas:**
- Create a cluster at https://www.mongodb.com/cloud/atlas
- Get connection string and update `MONGODB_URI` in `.env`

### 4. Get Stripe Keys

1. Sign up at https://stripe.com
2. Go to Developers → API keys
3. Copy test keys to `.env` files
4. For webhooks (optional):
   - Install Stripe CLI: https://stripe.com/docs/stripe-cli
   - Run: `stripe listen --forward-to localhost:5000/api/payment/webhook`
   - Copy webhook secret to `.env`

### 5. Start the Application

**Option 1: Run both together (recommended)**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Creating Test Data

### Create Admin User

1. Register a normal account through the UI
2. Connect to MongoDB:
```bash
mongosh ecommerce
```

3. Update user role:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Create Sample Categories

```javascript
db.categories.insertMany([
  { name: "Electronics", slug: "electronics", isActive: true },
  { name: "Clothing", slug: "clothing", isActive: true },
  { name: "Books", slug: "books", isActive: true },
  { name: "Home & Garden", slug: "home-garden", isActive: true }
])
```

### Create Sample Products

Use the admin dashboard at `/admin/products` or insert directly:

```javascript
db.products.insertOne({
  name: "Sample Product",
  description: "This is a sample product description",
  price: 29.99,
  category: ObjectId("your-category-id"),
  images: [{
    url: "https://via.placeholder.com/400",
    public_id: "sample"
  }],
  stock: 100,
  isActive: true,
  featured: true,
  rating: 4.5,
  numReviews: 10,
  reviews: []
})
```

## Testing Payments

Use Stripe test cards:

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Decline |
| 4000 0025 0000 3155 | Requires authentication |

- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)
- Use any ZIP code (e.g., 12345)

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` or kill the process
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Stripe Webhook Error
```
Error: No signatures found matching the expected signature
```
**Solution**: Make sure webhook secret matches Stripe CLI output

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**: Verify `CLIENT_URL` in backend `.env` matches frontend URL

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Vite automatically reloads on changes
- Backend: Nodemon restarts server on file changes

### Database GUI
Use MongoDB Compass for visual database management:
- Download: https://www.mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`

### API Testing
Use tools like:
- Postman: https://www.postman.com
- Insomnia: https://insomnia.rest
- Thunder Client (VS Code extension)

### Debugging
- Backend logs appear in terminal
- Frontend logs in browser console
- Use VS Code debugger for breakpoints

## Next Steps

1. ✅ Application running
2. ✅ Admin account created
3. ✅ Sample data added
4. ✅ Test payment flow
5. 📚 Read API documentation in README.md
6. 🎨 Customize styling in TailwindCSS
7. 🚀 Deploy to production

## Production Deployment

See README.md for deployment instructions to:
- Heroku
- Railway
- Render
- Vercel (frontend)
- Netlify (frontend)

## Support

If you encounter issues:
1. Check this guide
2. Review error messages
3. Check browser console
4. Check server logs
5. Open an issue on GitHub

Happy coding! 🚀

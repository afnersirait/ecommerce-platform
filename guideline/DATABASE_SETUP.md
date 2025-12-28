# Database Setup Guide

## MongoDB Installation Status

MongoDB is currently being installed via Homebrew. This may take a few minutes.

## After Installation Complete

### 1. Start MongoDB

```bash
brew services start mongodb-community
```

### 2. Verify MongoDB is Running

```bash
mongosh
# You should see MongoDB shell prompt
# Type 'exit' to quit
```

### 3. Seed the Database with Sample Products

```bash
npm run seed
```

This will create:
- **5 Categories**: Electronics, Clothing, Books, Home & Garden, Sports
- **15 Products**: Including headphones, smartwatch, t-shirts, books, yoga mat, etc.
- **Featured Products**: 6 products marked as featured for the homepage

### 4. Start the Application

```bash
npm run dev
```

## Alternative: MongoDB Atlas (Cloud)

If you prefer not to install MongoDB locally:

1. **Create Account**: Go to https://www.mongodb.com/cloud/atlas
2. **Create Cluster**: Choose the free tier (M0)
3. **Create Database User**: Set username and password
4. **Whitelist IP**: Add `0.0.0.0/0` for development
5. **Get Connection String**: Click "Connect" → "Connect your application"
6. **Update .env**: Replace `MONGODB_URI` with your Atlas connection string

Example Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

## Sample Products Included

### Electronics (4 products)
- Wireless Bluetooth Headphones - $89.99
- Smart Watch Pro - $199.99
- Wireless Keyboard & Mouse Combo - $49.99
- 4K Webcam - $79.99

### Clothing (3 products)
- Classic Cotton T-Shirt - $24.99
- Denim Jacket - $79.99
- Running Shoes - $89.99

### Books (2 products)
- The Art of Programming - $39.99
- Mindfulness & Meditation - $19.99

### Home & Garden (3 products)
- Ceramic Plant Pot Set - $34.99
- LED Desk Lamp - $44.99
- Throw Pillow Set - $29.99

### Sports (3 products)
- Yoga Mat Premium - $39.99
- Adjustable Dumbbells Set - $299.99
- Water Bottle Insulated - $24.99

## Troubleshooting

### MongoDB Won't Start
```bash
# Check if MongoDB is running
brew services list

# Restart MongoDB
brew services restart mongodb-community

# Check logs
tail -f /opt/homebrew/var/log/mongodb/mongo.log
```

### Connection Refused Error
- Make sure MongoDB is running: `brew services list`
- Check your `.env` file has correct `MONGODB_URI`
- Default local URI: `mongodb://localhost:27017/ecommerce`

### Seed Script Fails
- Ensure MongoDB is running
- Check connection string in `.env`
- Try running: `mongosh` to verify MongoDB is accessible

## Next Steps

After seeding:
1. ✅ Start the application: `npm run dev`
2. ✅ Visit: http://localhost:5173
3. ✅ Browse products on the homepage
4. ✅ Register a new account
5. ✅ Add products to cart
6. ✅ Test the checkout flow

## Managing Products

### Via Admin Dashboard
1. Register an account
2. Update user role to admin in MongoDB:
   ```javascript
   mongosh ecommerce
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```
3. Login again
4. Access admin dashboard: http://localhost:5173/admin/dashboard

### Via MongoDB Shell
```javascript
mongosh ecommerce

// View all products
db.products.find().pretty()

// View all categories
db.categories.find().pretty()

// Add a new product
db.products.insertOne({
  name: "New Product",
  description: "Product description",
  price: 99.99,
  category: ObjectId("category-id-here"),
  stock: 50,
  images: [{ url: "https://example.com/image.jpg", public_id: "img1" }],
  featured: false,
  isActive: true
})
```

## Database Schema

### Products Collection
- name, description, price
- category (reference to Category)
- images (array of {url, public_id})
- stock, featured, isActive
- rating, numReviews, reviews

### Categories Collection
- name, slug, description
- image, parent, isActive

### Users Collection
- name, email, password (hashed)
- role (user/admin)
- address, wishlist

### Orders Collection
- user, orderItems, shippingAddress
- paymentMethod, paymentResult
- itemsPrice, taxPrice, shippingPrice, totalPrice
- isPaid, paidAt, isDelivered, deliveredAt
- status, trackingNumber

### Cart Collection
- user, items (array)
- totalItems, totalPrice

---

**Ready to start?** Run `npm run seed` after MongoDB is installed!

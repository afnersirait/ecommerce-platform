# Quick Reference Guide

## Common Commands

### Development
```bash
# Start both frontend and backend
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Install all dependencies
npm run install-all
```

### Production
```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

## Environment Variables Quick Setup

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-min-32-chars
STRIPE_SECRET_KEY=sk_test_xxxxx
CLIENT_URL=http://localhost:5173
```

### Frontend (client/.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

## MongoDB Quick Commands

### Connect to Database
```bash
mongosh ecommerce
```

### Create Admin User
```javascript
// First register through UI, then:
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### View Collections
```javascript
show collections
db.users.find()
db.products.find()
db.orders.find()
```

### Clear Database
```javascript
db.dropDatabase()
```

## API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Create Product (Admin)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "price": 29.99,
    "category": "CATEGORY_ID",
    "stock": 100,
    "images": [{
      "url": "https://via.placeholder.com/400",
      "public_id": "test"
    }]
  }'
```

## Stripe Test Cards

| Purpose | Card Number | CVC | Date |
|---------|-------------|-----|------|
| Success | 4242 4242 4242 4242 | Any 3 digits | Any future date |
| Decline | 4000 0000 0000 0002 | Any 3 digits | Any future date |
| Auth Required | 4000 0025 0000 3155 | Any 3 digits | Any future date |

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### MongoDB Not Running
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Clear Node Modules
```bash
# Backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

### Reset Database
```bash
mongosh ecommerce --eval "db.dropDatabase()"
```

## File Locations

### Configuration
- Backend config: `/.env`
- Frontend config: `/client/.env`
- Package config: `/package.json`, `/client/package.json`

### Source Code
- Frontend pages: `/client/src/pages/`
- Frontend components: `/client/src/components/`
- Backend routes: `/server/routes/`
- Backend models: `/server/models/`

### Styling
- Global styles: `/client/src/index.css`
- Tailwind config: `/client/tailwind.config.js`

## Default URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |
| Admin Dashboard | http://localhost:5173/admin/dashboard |

## User Roles

### Regular User
- Browse products
- Add to cart
- Place orders
- Write reviews
- Manage wishlist

### Admin
- All user permissions
- Manage products
- Manage orders
- Manage users
- Manage categories
- View dashboard

## Quick Testing Flow

1. **Setup**
   ```bash
   npm run install-all
   cp .env.example .env
   cd client && cp .env.example .env && cd ..
   # Edit .env files with your values
   ```

2. **Start**
   ```bash
   npm run dev
   ```

3. **Create Admin**
   - Register at http://localhost:5173/register
   - Update role in MongoDB
   - Login again

4. **Add Products**
   - Go to http://localhost:5173/admin/products
   - Add sample products

5. **Test Shopping**
   - Browse products
   - Add to cart
   - Checkout with test card

## Git Commands

```bash
# Initial commit
git add .
git commit -m "Initial commit: E-commerce platform"

# Create feature branch
git checkout -b feature/new-feature

# Push to remote
git push origin main
```

## Deployment Checklist

- [ ] Update environment variables
- [ ] Set NODE_ENV=production
- [ ] Update CLIENT_URL to production domain
- [ ] Update VITE_API_URL to production API
- [ ] Enable MongoDB Atlas
- [ ] Set up Stripe production keys
- [ ] Build frontend: `npm run build`
- [ ] Test all features
- [ ] Set up SSL certificate
- [ ] Configure domain

## Support Resources

- **Documentation**: README.md
- **Setup Guide**: SETUP.md
- **Project Summary**: PROJECT_SUMMARY.md
- **Stripe Docs**: https://stripe.com/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **React Docs**: https://react.dev

## Useful VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (API testing)
- GitLens

## Performance Tips

- Use pagination for large datasets
- Implement caching for frequently accessed data
- Optimize images before upload
- Use CDN for static assets
- Enable compression
- Implement lazy loading
- Monitor database queries

## Security Reminders

- Never commit `.env` files
- Use strong JWT secrets (32+ characters)
- Keep dependencies updated
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting
- Regular security audits

---

**Need Help?** Check the full documentation in README.md and SETUP.md

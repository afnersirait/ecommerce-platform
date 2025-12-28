const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronic gadgets and devices',
    isActive: true
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel for everyone',
    isActive: true
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Books for all interests',
    isActive: true
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything for your home and garden',
    isActive: true
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Sports equipment and accessories',
    isActive: true
  }
];

const products = [
  // Electronics
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Features advanced Bluetooth 5.0 technology, comfortable over-ear design, and crystal-clear audio quality.',
    price: 89.99,
    stock: 50,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        public_id: 'headphones-1'
      }
    ],
    featured: true,
    isActive: true
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and 7-day battery life. Water-resistant up to 50m with customizable watch faces.',
    price: 199.99,
    stock: 30,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        public_id: 'watch-1'
      }
    ],
    featured: true,
    isActive: true
  },
  {
    name: 'Wireless Keyboard & Mouse Combo',
    description: 'Ergonomic wireless keyboard and mouse set with silent keys and precision tracking. Perfect for office or home use.',
    price: 49.99,
    stock: 75,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
        public_id: 'keyboard-1'
      }
    ],
    featured: false,
    isActive: true
  },
  {
    name: '4K Webcam',
    description: 'Professional 4K webcam with auto-focus and built-in microphone. Perfect for streaming and video conferencing.',
    price: 79.99,
    stock: 40,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800',
        public_id: 'webcam-1'
      }
    ],
    featured: false,
    isActive: true
  },

  // Clothing
  {
    name: 'Classic Cotton T-Shirt',
    description: 'Premium 100% cotton t-shirt with a comfortable fit. Available in multiple colors. Perfect for everyday wear.',
    price: 24.99,
    stock: 100,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        public_id: 'tshirt-1'
      }
    ],
    featured: false,
    isActive: true
  },
  {
    name: 'Denim Jacket',
    description: 'Classic denim jacket with a modern fit. Durable and stylish, perfect for any season.',
    price: 79.99,
    stock: 45,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
        public_id: 'jacket-1'
      }
    ],
    featured: true,
    isActive: true
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with excellent cushioning and support. Breathable mesh upper for maximum comfort.',
    price: 89.99,
    stock: 60,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        public_id: 'shoes-1'
      }
    ],
    featured: true,
    isActive: true
  },

  // Books
  {
    name: 'The Art of Programming',
    description: 'Comprehensive guide to modern programming practices. Perfect for beginners and experienced developers alike.',
    price: 39.99,
    stock: 80,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
        public_id: 'book-1'
      }
    ],
    featured: false,
    isActive: true
  },
  {
    name: 'Mindfulness & Meditation',
    description: 'A practical guide to mindfulness and meditation techniques for stress relief and mental clarity.',
    price: 19.99,
    stock: 90,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
        public_id: 'book-2'
      }
    ],
    featured: false,
    isActive: true
  },

  // Home & Garden
  {
    name: 'Ceramic Plant Pot Set',
    description: 'Set of 3 modern ceramic plant pots with drainage holes. Perfect for indoor plants and succulents.',
    price: 34.99,
    stock: 55,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
        public_id: 'pot-1'
      }
    ],
    featured: false,
    isActive: true
  },
  {
    name: 'LED Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness and color temperature. USB charging port included.',
    price: 44.99,
    stock: 65,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
        public_id: 'lamp-1'
      }
    ],
    featured: true,
    isActive: true
  },
  {
    name: 'Throw Pillow Set',
    description: 'Set of 2 decorative throw pillows with removable covers. Soft and comfortable for any couch or bed.',
    price: 29.99,
    stock: 70,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        public_id: 'pillow-1'
      }
    ],
    featured: false,
    isActive: true
  },

  // Sports
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick yoga mat with non-slip surface. Includes carrying strap. Perfect for yoga, pilates, and stretching.',
    price: 39.99,
    stock: 85,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
        public_id: 'yoga-1'
      }
    ],
    featured: false,
    isActive: true
  },
  {
    name: 'Adjustable Dumbbells Set',
    description: 'Space-saving adjustable dumbbells from 5-52.5 lbs. Perfect for home gym workouts.',
    price: 299.99,
    stock: 25,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
        public_id: 'dumbbell-1'
      }
    ],
    featured: true,
    isActive: true
  },
  {
    name: 'Water Bottle Insulated',
    description: 'Stainless steel insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. 32oz capacity.',
    price: 24.99,
    stock: 120,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
        public_id: 'bottle-1'
      }
    ],
    featured: false,
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Map category names to IDs
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Assign categories to products
    products[0].category = categoryMap['electronics'];
    products[1].category = categoryMap['electronics'];
    products[2].category = categoryMap['electronics'];
    products[3].category = categoryMap['electronics'];
    products[4].category = categoryMap['clothing'];
    products[5].category = categoryMap['clothing'];
    products[6].category = categoryMap['clothing'];
    products[7].category = categoryMap['books'];
    products[8].category = categoryMap['books'];
    products[9].category = categoryMap['home-garden'];
    products[10].category = categoryMap['home-garden'];
    products[11].category = categoryMap['home-garden'];
    products[12].category = categoryMap['sports'];
    products[13].category = categoryMap['sports'];
    products[14].category = categoryMap['sports'];

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Featured Products: ${products.filter(p => p.featured).length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

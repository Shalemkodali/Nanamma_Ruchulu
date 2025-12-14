const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Sample spice products - Using reliable image sources
const products = [
  {
    name: 'Smoked Paprika',
    description: 'Rich, smoky flavor with a deep red color. Perfect for adding depth to meats, stews, and roasted vegetables. Sourced from premium Spanish peppers.',
    price: 8.99,
    image: 'https://picsum.photos/500/500?random=1',
    category: 'Spicy',
    stockCount: 50,
  },
  {
    name: 'Ceylon Cinnamon',
    description: 'True cinnamon with a delicate, sweet flavor. Unlike cassia, this has a lighter, more complex taste. Perfect for baking and desserts.',
    price: 12.99,
    image: 'https://picsum.photos/500/500?random=2',
    category: 'Sweet',
    stockCount: 35,
  },
  {
    name: 'Turmeric Root Powder',
    description: 'Bright golden spice with earthy, slightly bitter flavor. Known for its health benefits and vibrant color. Essential for curries and golden milk.',
    price: 9.99,
    image: 'https://picsum.photos/500/500?random=3',
    category: 'Aromatic',
    stockCount: 60,
  },
  {
    name: 'Sumac',
    description: 'Tangy, lemony spice with a deep red-purple color. Adds a bright, citrusy note to Middle Eastern dishes, salads, and grilled meats.',
    price: 11.99,
    image: 'https://picsum.photos/500/500?random=4',
    category: 'Tangy',
    stockCount: 25,
  },
  {
    name: 'Cardamom Pods',
    description: 'Highly aromatic pods with a complex flavor profile - sweet, spicy, and slightly citrusy. Essential for Indian and Middle Eastern cuisine.',
    price: 15.99,
    image: 'https://picsum.photos/500/500?random=5',
    category: 'Aromatic',
    stockCount: 40,
  },
  {
    name: 'Saffron Threads',
    description: 'The world\'s most expensive spice. Imparts a golden color and unique floral, honey-like flavor. Use sparingly in rice, desserts, and sauces.',
    price: 89.99,
    image: 'https://picsum.photos/500/500?random=6',
    category: 'Premium',
    stockCount: 15,
  },
  {
    name: 'Za\'atar Blend',
    description: 'Traditional Middle Eastern spice blend of thyme, sumac, and sesame seeds. Perfect for seasoning bread, meats, and vegetables.',
    price: 10.99,
    image: 'https://picsum.photos/500/500?random=7',
    category: 'Blend',
    stockCount: 45,
  },
  {
    name: 'Black Peppercorns',
    description: 'Premium whole black peppercorns with intense, sharp flavor. Grind fresh for maximum aroma and taste. Essential kitchen staple.',
    price: 7.99,
    image: 'https://picsum.photos/500/500?random=8',
    category: 'Spicy',
    stockCount: 80,
  },
  {
    name: 'Star Anise',
    description: 'Distinctive star-shaped pods with a strong licorice flavor. Key ingredient in Chinese five-spice powder and pho broth.',
    price: 9.99,
    image: 'https://picsum.photos/500/500?random=9',
    category: 'Aromatic',
    stockCount: 30,
  },
  {
    name: 'Chipotle Powder',
    description: 'Smoked and dried jalapeño peppers ground into a fine powder. Adds smoky heat to Mexican dishes, marinades, and rubs.',
    price: 8.99,
    image: 'https://picsum.photos/500/500?random=10',
    category: 'Spicy',
    stockCount: 55,
  },
];

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@spicerack.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
  },
];

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Data cleared.');

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    // Insert products
    console.log('Inserting products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products inserted.`);

    // Insert users
    console.log('Inserting users...');
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`${createdUsers.length} users inserted.`);
    
    // Verify admin was created
    const admin = await User.findOne({ email: 'admin@spicerack.com' });
    if (admin && admin.isAdmin) {
      console.log('✅ Admin user verified: admin@spicerack.com');
    } else {
      console.log('⚠️  Warning: Admin user may not have been created correctly');
    }

    console.log('\n✅ Seeding completed successfully!');
    console.log('\nSample Users:');
    console.log('Admin - Email: admin@spicerack.com, Password: admin123');
    console.log('Customer - Email: john@example.com, Password: password123');
    console.log('\n10 spice products have been added to the database.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeder
seedData();


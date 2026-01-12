const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Sample spice products - Using reliable image sources
// Conversion rate: 1 USD = 83 INR (approximate)
const products = [
  {
    name: 'Smoked Paprika',
    description: 'Rich, smoky flavor with a deep red color. Perfect for adding depth to meats, stews, and roasted vegetables. Sourced from premium Spanish peppers.',
    ingredients: '100% Smoked Spanish Paprika (Capsicum annuum)',
    nutritionalFacts: 'Per 100g: Energy 282 kcal, Protein 14g, Fat 13g, Carbohydrates 54g, Fiber 21g, Sodium 68mg',
    storage: 'Store in a cool, dry place away from direct sunlight. Keep in an airtight container. Best used within 2 years of purchase.',
    healthBenefits: 'Rich in antioxidants, vitamin A, and capsaicin. May help reduce inflammation, improve heart health, and support eye health.',
    price: 8.99,
    priceInINR: 746,
    weight: '100g',
    image: 'https://picsum.photos/500/500?random=1',
    category: 'Spicy',
    stockCount: 50,
  },
  {
    name: 'Ceylon Cinnamon',
    description: 'True cinnamon with a delicate, sweet flavor. Unlike cassia, this has a lighter, more complex taste. Perfect for baking and desserts.',
    ingredients: '100% Pure Ceylon Cinnamon (Cinnamomum verum)',
    nutritionalFacts: 'Per 100g: Energy 247 kcal, Protein 4g, Fat 1.2g, Carbohydrates 81g, Fiber 53g, Calcium 1002mg, Iron 8.3mg',
    storage: 'Store in a cool, dry place in an airtight container. Protect from moisture and light. Shelf life: 3-4 years.',
    healthBenefits: 'Helps regulate blood sugar, anti-inflammatory properties, rich in antioxidants, may improve heart health and brain function.',
    price: 12.99,
    priceInINR: 1078,
    weight: '100g',
    image: 'https://picsum.photos/500/500?random=2',
    category: 'Sweet',
    stockCount: 35,
  },
  {
    name: 'Turmeric Root Powder',
    description: 'Bright golden spice with earthy, slightly bitter flavor. Known for its health benefits and vibrant color. Essential for curries and golden milk.',
    ingredients: '100% Pure Turmeric Root Powder (Curcuma longa)',
    nutritionalFacts: 'Per 100g: Energy 354 kcal, Protein 7.8g, Fat 9.9g, Carbohydrates 65g, Fiber 21g, Iron 41.4mg, Manganese 7.8mg',
    storage: 'Store in a cool, dry, dark place in an airtight container. Keep away from moisture and light to preserve color and potency.',
    healthBenefits: 'Contains curcumin with powerful anti-inflammatory and antioxidant effects. May help with arthritis, brain health, and heart disease prevention.',
    price: 9.99,
    priceInINR: 829,
    weight: '250g',
    image: 'https://picsum.photos/500/500?random=3',
    category: 'Aromatic',
    stockCount: 60,
  },
  {
    name: 'Sumac',
    description: 'Tangy, lemony spice with a deep red-purple color. Adds a bright, citrusy note to Middle Eastern dishes, salads, and grilled meats.',
    ingredients: '100% Ground Sumac Berries (Rhus coriaria)',
    nutritionalFacts: 'Per 100g: Energy 331 kcal, Protein 6g, Fat 4g, Carbohydrates 68g, Fiber 29g, Vitamin C 86mg, Calcium 529mg',
    storage: 'Store in a cool, dry place in an airtight container. Keep away from moisture to prevent clumping. Use within 2 years.',
    healthBenefits: 'High in antioxidants, anti-inflammatory properties, supports digestive health, may help lower cholesterol and blood sugar levels.',
    price: 11.99,
    priceInINR: 995,
    weight: '100g',
    image: 'https://picsum.photos/500/500?random=4',
    category: 'Tangy',
    stockCount: 25,
  },
  {
    name: 'Cardamom Pods',
    description: 'Highly aromatic pods with a complex flavor profile - sweet, spicy, and slightly citrusy. Essential for Indian and Middle Eastern cuisine.',
    ingredients: '100% Whole Green Cardamom Pods (Elettaria cardamomum)',
    nutritionalFacts: 'Per 100g: Energy 311 kcal, Protein 11g, Fat 6.7g, Carbohydrates 68g, Fiber 28g, Calcium 383mg, Iron 13.9mg',
    storage: 'Store in an airtight container in a cool, dry place. Keep pods whole until ready to use for maximum flavor. Shelf life: 2-3 years.',
    healthBenefits: 'Aids digestion, may help lower blood pressure, antimicrobial properties, rich in antioxidants, may improve oral health and breathing.',
    price: 15.99,
    priceInINR: 1327,
    weight: '50g',
    image: 'https://picsum.photos/500/500?random=5',
    category: 'Aromatic',
    stockCount: 40,
  },
  {
    name: 'Saffron Threads',
    description: 'The world\'s most expensive spice. Imparts a golden color and unique floral, honey-like flavor. Use sparingly in rice, desserts, and sauces.',
    ingredients: '100% Pure Saffron Threads (Crocus sativus)',
    nutritionalFacts: 'Per 100g: Energy 310 kcal, Protein 11g, Fat 5.9g, Carbohydrates 65g, Fiber 3.9g, Iron 11.1mg, Manganese 28.4mg',
    storage: 'Store in an airtight container in a cool, dark, dry place. Keep away from light and moisture. Best stored in refrigerator for extended freshness.',
    healthBenefits: 'Powerful antioxidant properties, may improve mood and treat depression, may reduce PMS symptoms, supports heart health, may have anti-cancer properties.',
    price: 89.99,
    priceInINR: 7467,
    weight: '1g',
    image: 'https://picsum.photos/500/500?random=6',
    category: 'Premium',
    stockCount: 15,
  },
  {
    name: 'Za\'atar Blend',
    description: 'Traditional Middle Eastern spice blend of thyme, sumac, and sesame seeds. Perfect for seasoning bread, meats, and vegetables.',
    ingredients: 'Thyme, Sumac, Sesame Seeds, Salt, Oregano',
    nutritionalFacts: 'Per 100g: Energy 293 kcal, Protein 9g, Fat 6g, Carbohydrates 58g, Fiber 18g, Calcium 405mg, Iron 17.5mg',
    storage: 'Store in an airtight container in a cool, dry place. Keep away from moisture and direct sunlight. Use within 1 year for best flavor.',
    healthBenefits: 'Rich in antioxidants from thyme and sumac, sesame seeds provide healthy fats, may support immune system, anti-inflammatory properties.',
    price: 10.99,
    priceInINR: 912,
    weight: '100g',
    image: 'https://picsum.photos/500/500?random=7',
    category: 'Blend',
    stockCount: 45,
  },
  {
    name: 'Black Peppercorns',
    description: 'Premium whole black peppercorns with intense, sharp flavor. Grind fresh for maximum aroma and taste. Essential kitchen staple.',
    ingredients: '100% Whole Black Peppercorns (Piper nigrum)',
    nutritionalFacts: 'Per 100g: Energy 251 kcal, Protein 10g, Fat 3.3g, Carbohydrates 64g, Fiber 25g, Calcium 443mg, Iron 9.7mg, Vitamin K 163.7mcg',
    storage: 'Store in a cool, dry place in an airtight container. Keep whole until ready to use. Grind fresh for best flavor. Shelf life: 3-4 years.',
    healthBenefits: 'Contains piperine which enhances nutrient absorption, anti-inflammatory properties, may improve brain function, supports digestive health, rich in antioxidants.',
    price: 7.99,
    priceInINR: 663,
    weight: '250g',
    image: 'https://picsum.photos/500/500?random=8',
    category: 'Spicy',
    stockCount: 80,
  },
  {
    name: 'Star Anise',
    description: 'Distinctive star-shaped pods with a strong licorice flavor. Key ingredient in Chinese five-spice powder and pho broth.',
    ingredients: '100% Whole Star Anise Pods (Illicium verum)',
    nutritionalFacts: 'Per 100g: Energy 337 kcal, Protein 18g, Fat 16g, Carbohydrates 50g, Fiber 15g, Calcium 646mg, Iron 36.9mg, Vitamin C 21mg',
    storage: 'Store in an airtight container in a cool, dry place away from light. Keep whole until ready to use. Shelf life: 2-3 years.',
    healthBenefits: 'Contains shikimic acid (used in Tamiflu), antimicrobial properties, may help with respiratory issues, supports digestive health, rich in antioxidants.',
    price: 9.99,
    priceInINR: 829,
    weight: '100g',
    image: 'https://picsum.photos/500/500?random=9',
    category: 'Aromatic',
    stockCount: 30,
  },
  {
    name: 'Chipotle Powder',
    description: 'Smoked and dried jalapeño peppers ground into a fine powder. Adds smoky heat to Mexican dishes, marinades, and rubs.',
    ingredients: '100% Smoked and Dried Jalapeño Peppers (Capsicum annuum)',
    nutritionalFacts: 'Per 100g: Energy 324 kcal, Protein 12g, Fat 5g, Carbohydrates 69g, Fiber 28g, Vitamin A 2081 IU, Vitamin C 76mg, Iron 6mg',
    storage: 'Store in an airtight container in a cool, dry, dark place. Keep away from moisture. Shelf life: 2-3 years when properly stored.',
    healthBenefits: 'Contains capsaicin which may boost metabolism, rich in vitamin C and antioxidants, may help with pain relief, supports cardiovascular health.',
    price: 8.99,
    priceInINR: 746,
    weight: '100g',
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


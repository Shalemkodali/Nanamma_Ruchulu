/**
 * Product Controller
 * 
 * This controller handles all product-related operations in the e-commerce application.
 * It provides endpoints for:
 * - Public users: Viewing and searching products
 * - Admin users: Creating, updating, and deleting products
 * 
 * All routes are protected with authentication middleware where necessary.
 */

const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

/**
 * @desc    Fetch all products from the database
 * @route   GET /api/products
 * @access  Public - Anyone can view products
 * @param   {Object} req - Express request object
 * @param   {string} req.query.keyword - Optional search keyword to filter products by name
 * @param   {string} req.query.category - Optional category to filter products (sweets, hots, giftpacks, pickels, others)
 * @param   {Object} res - Express response object
 * @returns {Array} JSON array of product objects with populated reviews
 * 
 * This function retrieves all products from the database. If a keyword query parameter
 * is provided, it filters products by name using a case-insensitive regex search.
 * If a category query parameter is provided, it filters products by exact category match.
 * Both filters can be used together. Reviews are automatically populated (joined) with
 * each product using Mongoose populate.
 */
const getProducts = asyncHandler(async (req, res) => {
  // Build search query object
  const query = {};
  
  // Add keyword filter if provided
  // Uses MongoDB regex for case-insensitive pattern matching
  if (req.query.keyword) {
    query.name = {
      $regex: req.query.keyword, // Search pattern
      $options: 'i', // Case-insensitive flag
    };
  }
  
  // Add category filter if provided
  // Valid categories: sweet, hots, giftpacks, pickels, others
  // Filtering is case-insensitive to handle variations
  if (req.query.category) {
    // Normalize category to lowercase for case-insensitive matching
    // Also handle plural/singular variations (sweets -> sweet)
    let categoryFilter = req.query.category.toLowerCase();
    
    // Map plural forms to singular for consistency
    if (categoryFilter === 'sweets') {
      categoryFilter = 'sweet';
    }
    
    // Use case-insensitive regex for category matching
    // This allows matching "Sweet", "sweet", "SWEET", etc.
    query.category = {
      $regex: new RegExp(`^${categoryFilter}$`, 'i'), // Case-insensitive exact match
    };
  }

  // Find all products matching the filters (if any)
  // populate('reviews') automatically fetches and attaches review documents
  const products = await Product.find(query).populate('reviews');
  
  // Send products as JSON response
  res.json(products);
});

/**
 * @desc    Fetch a single product by its ID
 * @route   GET /api/products/:id
 * @access  Public - Anyone can view product details
 * @param   {Object} req - Express request object
 * @param   {string} req.params.id - MongoDB ObjectId of the product
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object containing the product data with populated reviews
 * @throws  {Error} 404 if product is not found
 * 
 * This function retrieves a single product by its ID. The product ID comes from
 * the URL parameter. Reviews are automatically populated with the product data.
 * If the product doesn't exist, a 404 error is thrown.
 */
const getProductById = asyncHandler(async (req, res) => {
  // Find product by ID and populate reviews
  // populate('reviews') fetches full review documents instead of just IDs
  const product = await Product.findById(req.params.id).populate('reviews');

  if (product) {
    // Product found - send it as JSON
    res.json(product);
  } else {
    // Product not found - set status code and throw error
    res.status(404);
    throw new Error('Product not found');
  }
});

/**
 * @desc    Create a new product in the database
 * @route   POST /api/products
 * @access  Private/Admin - Only authenticated admin users can create products
 * @param   {Object} req - Express request object
 * @param   {Object} req.body - Product data from request body
 * @param   {string} req.body.name - Product name (required)
 * @param   {string} req.body.description - Product description (required)
 * @param   {number} req.body.price - Price in USD (required)
 * @param   {number} req.body.priceInINR - Price in Indian Rupees (required)
 * @param   {string} req.body.weight - Product weight (e.g., "100g", "1kg") (required)
 * @param   {string} req.body.image - Product image URL (required)
 * @param   {string} req.body.category - Product category (required)
 * @param   {number} req.body.stockCount - Number of items in stock (required)
 * @param   {string} req.body.ingredients - Product ingredients (optional)
 * @param   {string} req.body.nutritionalFacts - Nutritional information (optional)
 * @param   {string} req.body.storage - Storage instructions (optional)
 * @param   {string} req.body.healthBenefits - Health benefits description (optional)
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object containing the newly created product
 * @throws  {Error} 400 if required fields are missing
 * 
 * This function creates a new product in the database. It validates that all required
 * fields are present, converts data types appropriately, and handles optional fields
 * with default empty strings. The function is protected by authentication middleware
 * and admin authorization middleware.
 */
const createProduct = asyncHandler(async (req, res) => {
  // Log the incoming request body for debugging
  console.log('=== CREATE PRODUCT FUNCTION CALLED ===');
  console.log('Request body:', req.body);
  console.log('Request body type:', typeof req.body);
  console.log('Request body keys:', Object.keys(req.body || {}));
  console.log('Full request body:', JSON.stringify(req.body, null, 2));
  
  // Extract all fields from request body
  // Destructuring assignment - pulls out these properties from req.body
  const {
    name,
    description,
    price,
    priceInINR,
    weight,
    image,
    category,
    stockCount,
    ingredients,
    nutritionalFacts,
    storage,
    healthBenefits,
  } = req.body;

  // Validate that all required fields are present
  // stockCount uses === undefined check because 0 is a valid value
  if (!name || !description || !price || !priceInINR || !weight || !image || !category || stockCount === undefined) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Validate category - must be one of the allowed categories
  // Accept both singular and plural forms, normalize to singular
  const categoryLower = category.toLowerCase();
  let normalizedCategory = categoryLower;
  
  // Map plural to singular
  if (categoryLower === 'sweets') {
    normalizedCategory = 'sweet';
  }
  
  const allowedCategories = ['sweet', 'hots', 'giftpacks', 'pickels', 'others'];
  if (!allowedCategories.includes(normalizedCategory)) {
    res.status(400);
    throw new Error(`Category must be one of: ${allowedCategories.join(', ')}`);
  }

  // Build product data object with type conversion
  // Explicit type conversion ensures data integrity
  // IMPORTANT: We explicitly exclude _id to prevent any accidental _id from being set
  const productData = {
    name: String(name), // Convert to string
    description: String(description),
    price: Number(price), // Convert to number
    priceInINR: Number(priceInINR),
    weight: String(weight),
    image: String(image),
    category: normalizedCategory, // Use normalized category (singular form)
    stockCount: Number(stockCount),
    // Optional fields - default to empty string if not provided
    ingredients: ingredients ? String(ingredients) : '',
    nutritionalFacts: nutritionalFacts ? String(nutritionalFacts) : '',
    storage: storage ? String(storage) : '',
    healthBenefits: healthBenefits ? String(healthBenefits) : '',
  };
  
  // CRITICAL: Explicitly remove _id if it exists (shouldn't, but be defensive)
  // This prevents any accidental _id from being passed to Product.create()
  delete productData._id;

  // Log the product data we're about to create
  console.log('Creating product with data:', JSON.stringify(productData, null, 2));

  // Create product in database using Mongoose create method
  // This automatically generates _id and timestamps
  // Product.create() will NOT accept an _id field - it will generate one automatically
  const createdProduct = await Product.create(productData);
  
  // Return 201 Created status with the new product data
  res.status(201).json(createdProduct);
});

/**
 * @desc    Update an existing product in the database
 * @route   PUT /api/products/:id
 * @access  Private/Admin - Only authenticated admin users can update products
 * @param   {Object} req - Express request object
 * @param   {string} req.params.id - MongoDB ObjectId of the product to update
 * @param   {Object} req.body - Updated product data (all fields optional)
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object containing the updated product
 * @throws  {Error} 404 if product is not found
 * 
 * This function updates an existing product. Only fields provided in the request
 * body are updated - fields not provided remain unchanged. This allows partial
 * updates. The function uses !== undefined check to distinguish between
 * intentionally omitted fields and fields set to null/false/0.
 */
const updateProduct = asyncHandler(async (req, res) => {
  // Extract all possible fields from request body
  const {
    name,
    description,
    price,
    priceInINR,
    weight,
    image,
    category,
    stockCount,
    ingredients,
    nutritionalFacts,
    storage,
    healthBenefits,
  } = req.body;

  // Find the product to update
  const product = await Product.findById(req.params.id);

  if (product) {
    // Product found - update only fields that are provided (not undefined)
    // This allows partial updates - only provided fields are changed
    
    // Validate category if it's being updated
    if (category !== undefined) {
      const categoryLower = category.toLowerCase();
      let normalizedCategory = categoryLower;
      
      // Map plural to singular
      if (categoryLower === 'sweets') {
        normalizedCategory = 'sweet';
      }
      
      const allowedCategories = ['sweet', 'hots', 'giftpacks', 'pickels', 'others'];
      if (!allowedCategories.includes(normalizedCategory)) {
        res.status(400);
        throw new Error(`Category must be one of: ${allowedCategories.join(', ')}`);
      }
      
      product.category = normalizedCategory;
    }
    
    product.name = name !== undefined ? name : product.name;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? price : product.price;
    product.priceInINR = priceInINR !== undefined ? priceInINR : product.priceInINR;
    product.weight = weight !== undefined ? weight : product.weight;
    product.image = image !== undefined ? image : product.image;
    product.stockCount = stockCount !== undefined ? stockCount : product.stockCount;
    product.ingredients = ingredients !== undefined ? ingredients : product.ingredients;
    product.nutritionalFacts = nutritionalFacts !== undefined ? nutritionalFacts : product.nutritionalFacts;
    product.storage = storage !== undefined ? storage : product.storage;
    product.healthBenefits = healthBenefits !== undefined ? healthBenefits : product.healthBenefits;

    // Save the updated product to the database
    const updatedProduct = await product.save();
    
    // Return the updated product
    res.json(updatedProduct);
  } else {
    // Product not found
    res.status(404);
    throw new Error('Product not found');
  }
});

/**
 * @desc    Delete a product from the database
 * @route   DELETE /api/products/:id
 * @access  Private/Admin - Only authenticated admin users can delete products
 * @param   {Object} req - Express request object
 * @param   {string} req.params.id - MongoDB ObjectId of the product to delete
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object with success message
 * @throws  {Error} 404 if product is not found
 * 
 * This function permanently deletes a product from the database. The product ID
 * comes from the URL parameter. First, we verify the product exists, then delete it.
 * Note: This does not cascade delete reviews - reviews remain in the database
 * but will have orphaned references. Consider implementing soft delete or cascade
 * deletion if needed.
 */
const deleteProduct = asyncHandler(async (req, res) => {
  // First, find the product to verify it exists
  const product = await Product.findById(req.params.id);

  if (product) {
    // Product exists - delete it from the database
    // Using deleteOne with _id for explicit deletion
    await Product.deleteOne({ _id: product._id });
    
    // Return success message
    res.json({ message: 'Product removed' });
  } else {
    // Product not found
    res.status(404);
    throw new Error('Product not found');
  }
});

// Export all controller functions
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

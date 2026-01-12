/**
 * Product Model
 * 
 * This file defines the Mongoose schema for the Product collection in MongoDB.
 * Products represent items in the e-commerce store (spices in this case).
 * 
 * The schema includes product information, pricing, inventory, and relationships
 * to reviews. All products can have multiple reviews linked to them.
 */

const mongoose = require('mongoose');

/**
 * Product Schema Definition
 * 
 * Defines the structure and validation rules for products in the database.
 * Uses Mongoose schema to enforce data types and requirements.
 */
const productSchema = mongoose.Schema(
  {
    // Product name (e.g., "Smoked Paprika", "Turmeric Powder")
    name: {
      type: String,
      required: true, // Name is required - product cannot exist without a name
    },
    
    // Detailed description of the product
    description: {
      type: String,
      required: true, // Description is required
    },
    
    // List of ingredients (optional field)
    ingredients: {
      type: String,
      default: '', // Default to empty string if not provided
    },
    
    // Nutritional information (optional field)
    nutritionalFacts: {
      type: String,
      default: '', // Default to empty string if not provided
    },
    
    // Storage instructions (optional field)
    storage: {
      type: String,
      default: '', // Default to empty string if not provided
    },
    
    // Health benefits description (optional field)
    healthBenefits: {
      type: String,
      default: '', // Default to empty string if not provided
    },
    
    // Price in USD (required)
    price: {
      type: Number,
      required: true, // Price is required
    },
    
    // Price in Indian Rupees (required)
    // Stored separately to avoid currency conversion calculations
    priceInINR: {
      type: Number,
      required: true, // Price in INR is required
    },
    
    // Product weight (e.g., "100g", "250g", "500g", "1kg")
    // Stored as string to preserve format
    weight: {
      type: String,
      required: true, // Weight is required
    },
    
    // URL or path to product image
    image: {
      type: String,
      required: true, // Image is required
    },
    
    // Product category (e.g., "Spicy", "Sweet", "Aromatic")
    category: {
      type: String,
      required: true, // Category is required for filtering
    },
    
    // Number of items in stock
    stockCount: {
      type: Number,
      required: true, // Stock count is required (can be 0 for out of stock)
    },
    
    // Array of review ObjectIds
    // This creates a one-to-many relationship between Product and Review
    // Each product can have multiple reviews
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to Review document
        ref: 'Review', // Model name for population
        // When populated, this will contain full Review documents
      },
    ],
  },
  {
    // Schema options
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the Product model
// This allows other files to import and use the Product schema
module.exports = mongoose.model('Product', productSchema);

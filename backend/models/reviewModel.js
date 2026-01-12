/**
 * Review Model
 * 
 * This file defines the Mongoose schema for the Review collection in MongoDB.
 * Reviews represent user ratings and comments on products.
 * 
 * The schema includes links to both the user who wrote the review and the
 * product being reviewed, along with the rating and comment text.
 */

const mongoose = require('mongoose');

/**
 * Review Schema Definition
 * 
 * Defines the structure and validation rules for reviews in the database.
 * Reviews create relationships between users and products.
 */
const reviewSchema = mongoose.Schema(
  {
    // Reference to the user who wrote the review
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User document
      required: true, // User is required - every review belongs to a user
      ref: 'User', // Model name for population
    },
    
    // Reference to the product being reviewed
    product: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Product document
      required: true, // Product is required - every review belongs to a product
      ref: 'Product', // Model name for population
    },
    
    // User's name (stored separately in case user is deleted)
    // This preserves review authorship even if user account is removed
    name: {
      type: String,
      required: true, // Name is required
    },
    
    // Rating value (typically 1-5 stars)
    rating: {
      type: Number,
      required: true, // Rating is required
      min: 1, // Minimum rating value
      max: 5, // Maximum rating value
    },
    
    // Review comment text
    comment: {
      type: String,
      required: true, // Comment is required
    },
  },
  {
    // Schema options
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the Review model
module.exports = mongoose.model('Review', reviewSchema);

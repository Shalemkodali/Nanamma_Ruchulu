/**
 * Review Controller
 * 
 * This controller handles all review-related operations including:
 * - Creating reviews for products
 * - Deleting reviews (admin only)
 * 
 * Reviews are linked to both products and users, allowing users to
 * rate and comment on products. Each user can only review a product once.
 */

const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');
const Product = require('../models/productModel');

/**
 * @desc    Create a new review for a product
 * @route   POST /api/products/:id/reviews
 * @access  Private - Requires authentication
 * @param   {Object} req - Express request object
 * @param   {string} req.params.id - MongoDB ObjectId of the product being reviewed
 * @param   {Object} req.user - User object attached by protect middleware
 * @param   {Object} req.body - Review data
 * @param   {number} req.body.rating - Rating value (typically 1-5)
 * @param   {string} req.body.comment - Review comment text
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object containing the newly created review
 * @throws  {Error} 400 if product ID, rating, or comment are missing
 * @throws  {Error} 401 if user is not authenticated
 * @throws  {Error} 404 if product is not found
 * @throws  {Error} 400 if user has already reviewed this product
 * 
 * This function creates a new review for a product. It validates that the
 * product exists, checks that the user hasn't already reviewed the product
 * (one review per user per product), creates the review, and links it to
 * the product by adding the review ID to the product's reviews array.
 */
const createReview = asyncHandler(async (req, res) => {
  // Extract review data from request body
  const { rating, comment } = req.body;

  // Validate that product ID is provided in URL parameters
  if (!req.params.id) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  // Verify user is authenticated (should be set by protect middleware)
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  // Validate that rating and comment are provided
  if (!rating || !comment) {
    res.status(400);
    throw new Error('Rating and comment are required');
  }

  // Find the product being reviewed
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user has already reviewed this product
  // Each user can only review a product once
  const alreadyReviewed = await Review.findOne({
    product: req.params.id, // Product ID from URL
    user: req.user._id, // User ID from authenticated request
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  // Create the review in the database
  // Review includes user reference, product reference, rating, and comment
  const review = await Review.create({
    user: req.user._id, // Reference to the user who wrote the review
    product: req.params.id, // Reference to the product being reviewed
    name: req.user.name, // Store user's name (in case user is deleted)
    rating: Number(rating), // Convert to number to ensure type consistency
    comment, // Review comment text
  });

  // Link the review to the product by adding review ID to product's reviews array
  // This creates a bidirectional relationship between Product and Review
  product.reviews.push(review._id);
  await product.save();

  // Return 201 Created status with the new review data
  res.status(201).json(review);
});

/**
 * @desc    Delete a review from the system (admin only)
 * @route   DELETE /api/products/:productId/reviews/:reviewId
 * @access  Private/Admin - Requires admin authentication
 * @param   {Object} req - Express request object
 * @param   {string} req.params.productId - MongoDB ObjectId of the product
 * @param   {string} req.params.reviewId - MongoDB ObjectId of the review to delete
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object with success message
 * @throws  {Error} 404 if product or review is not found
 * 
 * This function deletes a review from the system. Only admin users can delete
 * reviews. It first verifies that both the product and review exist, removes
 * the review ID from the product's reviews array, and then deletes the review
 * document from the database. This maintains data consistency by cleaning up
 * the relationship between products and reviews.
 */
const deleteReview = asyncHandler(async (req, res) => {
  // Extract product ID and review ID from URL parameters
  const { productId, reviewId } = req.params;

  // Find the product to verify it exists
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Find the review to verify it exists
  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Remove the review ID from the product's reviews array
  // This cleans up the relationship between product and review
  // filter() creates a new array without the matching review ID
  product.reviews = product.reviews.filter(
    (review) => review.toString() !== reviewId // Convert ObjectId to string for comparison
  );
  await product.save();

  // Delete the review document from the database
  await Review.deleteOne({ _id: reviewId });

  // Return success message
  res.json({ message: 'Review removed' });
});

// Export all controller functions
module.exports = {
  createReview,
  deleteReview,
};

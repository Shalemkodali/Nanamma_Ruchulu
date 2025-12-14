const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');
const Product = require('../models/productModel');

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!req.params.id) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  if (!rating || !comment) {
    res.status(400);
    throw new Error('Rating and comment are required');
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = await Review.findOne({
    product: req.params.id,
    user: req.user._id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = await Review.create({
    user: req.user._id,
    product: req.params.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  product.reviews.push(review._id);
  await product.save();

  res.status(201).json(review);
});

// @desc    Delete a review
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Remove review from product's reviews array
  product.reviews = product.reviews.filter(
    (review) => review.toString() !== reviewId
  );
  await product.save();

  // Delete the review
  await Review.deleteOne({ _id: reviewId });

  res.json({ message: 'Review removed' });
});

module.exports = {
  createReview,
  deleteReview,
};


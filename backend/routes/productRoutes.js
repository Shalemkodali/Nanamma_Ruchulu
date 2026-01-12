/**
 * Product Routes
 * 
 * This file defines all routes related to products and reviews.
 * Routes are organized by resource (products) and HTTP method (GET, POST, PUT, DELETE).
 * 
 * Routes use middleware for authentication (protect) and authorization (admin)
 * where necessary. Review routes are nested under products since reviews
 * belong to products.
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Import review controller functions
const { createReview, deleteReview } = require('../controllers/reviewController');

// Import authentication middleware
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * Base Product Routes
 * GET /api/products - Get all products (public)
 * POST /api/products - Create a new product (admin only)
 */
router.route('/')
  .get(getProducts) // Public route - anyone can view products
  .post(protect, admin, (req, res, next) => {
    // Debug middleware to log when route is hit
    console.log('=== PRODUCT CREATE ROUTE HIT ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request body keys:', Object.keys(req.body || {}));
    console.log('User:', req.user ? { id: req.user._id, isAdmin: req.user.isAdmin } : 'No user');
    next(); // Continue to createProduct controller
  }, createProduct); // Protected route - requires admin authentication

/**
 * Review Routes (Nested under Products)
 * 
 * IMPORTANT: These routes must come BEFORE /:id route to avoid route conflicts.
 * Express matches routes in order, so /:id would match "/123/reviews" before
 * the nested route handler.
 * 
 * POST /api/products/:id/reviews - Create a review for a product (authenticated users)
 * DELETE /api/products/:productId/reviews/:reviewId - Delete a review (admin only)
 */
router.post('/:id/reviews', protect, createReview); // Protected route - requires authentication
router.delete('/:productId/reviews/:reviewId', protect, admin, deleteReview); // Protected route - requires admin

/**
 * Individual Product Routes
 * GET /api/products/:id - Get a single product by ID (public)
 * PUT /api/products/:id - Update a product (admin only)
 * DELETE /api/products/:id - Delete a product (admin only)
 */
router
  .route('/:id')
  .get(getProductById) // Public route - anyone can view product details
  .put(protect, admin, updateProduct) // Protected route - requires admin authentication
  .delete(protect, admin, deleteProduct); // Protected route - requires admin authentication

// Export the router
module.exports = router;

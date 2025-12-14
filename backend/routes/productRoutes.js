const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { createReview, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);

// Review routes must come before /:id route to avoid route conflicts
router.post('/:id/reviews', protect, createReview);
router.delete('/:productId/reviews/:reviewId', protect, admin, deleteReview);

// Product CRUD routes
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;


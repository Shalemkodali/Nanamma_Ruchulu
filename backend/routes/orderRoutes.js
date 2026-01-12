/**
 * Order Routes
 * 
 * This file defines all routes related to orders (purchases).
 * Routes include user order management and admin order management.
 * 
 * Routes use middleware for authentication (protect) and authorization (admin)
 * where necessary.
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
} = require('../controllers/orderController');

// Import authentication middleware
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * Base Order Routes
 * POST /api/orders - Create a new order from cart items (authenticated users)
 * GET /api/orders - Get all orders in system (admin only)
 */
router.route('/')
  .post(protect, addOrderItems) // Protected route - requires authentication
  .get(protect, admin, getOrders); // Protected route - requires admin authentication

/**
 * User Order History Route
 * GET /api/orders/myorders - Get all orders for current user (authenticated users)
 */
router.route('/myorders')
  .get(protect, getMyOrders); // Protected route - requires authentication

/**
 * Individual Order Routes
 * GET /api/orders/:id - Get a single order by ID (authenticated users - own orders or admin)
 * PUT /api/orders/:id/deliver - Mark order as delivered (admin only)
 */
router.route('/:id')
  .get(protect, getOrderById); // Protected route - requires authentication

router.route('/:id/deliver')
  .put(protect, admin, updateOrderToDelivered); // Protected route - requires admin authentication

// Export the router
module.exports = router;

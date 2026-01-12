/**
 * Order Controller
 * 
 * This controller handles all order-related operations including:
 * - Creating new orders from cart items
 * - Retrieving user's order history
 * - Admin order management (view all orders, mark as delivered)
 * 
 * Orders are created from shopping cart items and include shipping
 * address and payment information.
 */

const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');

/**
 * @desc    Create a new order from cart items
 * @route   POST /api/orders
 * @access  Private - Requires authentication
 * @param   {Object} req - Express request object
 * @param   {Object} req.user - User object attached by protect middleware
 * @param   {Object} req.body - Order data
 * @param   {Array} req.body.orderItems - Array of cart items to order
 * @param   {Object} req.body.shippingAddress - Shipping address object
 * @param   {string} req.body.shippingAddress.address - Street address
 * @param   {string} req.body.shippingAddress.city - City name
 * @param   {string} req.body.shippingAddress.postalCode - Postal/ZIP code
 * @param   {string} req.body.shippingAddress.country - Country name
 * @param   {number} req.body.totalPrice - Total price of the order
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object containing the newly created order
 * @throws  {Error} 400 if order items or shipping address are invalid
 * @throws  {Error} 401 if user is not authenticated
 * 
 * This function creates a new order from cart items. It validates that the
 * order has items, validates the shipping address, validates each order item,
 * creates the order in the database with the authenticated user's ID, and
 * returns the created order. Orders are created with isPaid and isDelivered
 * set to false by default.
 */
const addOrderItems = asyncHandler(async (req, res) => {
  // Extract order data from request body
  const { orderItems, shippingAddress, totalPrice } = req.body;

  // Validate that order has at least one item
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Validate that shipping address has all required fields
  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
    res.status(400);
    throw new Error('Please provide complete shipping address');
  }

  // Verify user is authenticated (should be set by protect middleware)
  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  // Verify user ID is present
  if (!req.user._id) {
    res.status(401);
    throw new Error('User ID not found');
  }

  // Validate and transform order items to ensure correct structure
  // This prevents invalid data from being stored
  const validatedOrderItems = orderItems.map((item) => {
    // Check that each item has required fields
    if (!item.product || !item.name || !item.quantity || !item.price) {
      throw new Error('Invalid order item structure');
    }
    // Return validated item with explicit type conversion
    return {
      name: item.name,
      quantity: Number(item.quantity), // Ensure quantity is a number
      image: item.image || '', // Default to empty string if no image
      price: Number(item.price), // Ensure price is a number
      product: item.product, // Product ID reference
    };
  });

  // Create the order in the database
  // Order model includes user reference, order items, shipping address, and total price
  const order = new Order({
    orderItems: validatedOrderItems, // Array of validated items
    user: req.user._id, // Reference to the user who created the order
    shippingAddress, // Complete shipping address object
    totalPrice: Number(totalPrice) || 0, // Total price, default to 0 if not provided
  });

  // Save the order to the database
  const createdOrder = await order.save();
  
  // Return 201 Created status with the new order data
  res.status(201).json(createdOrder);
});

/**
 * @desc    Get all orders for the currently authenticated user
 * @route   GET /api/orders/myorders
 * @access  Private - Requires authentication
 * @param   {Object} req - Express request object
 * @param   {Object} req.user - User object attached by protect middleware
 * @param   {string} req.user._id - Current user's MongoDB ObjectId
 * @param   {Object} res - Express response object
 * @returns {Array} JSON array of order objects belonging to the user
 * 
 * This function retrieves all orders that belong to the currently authenticated
 * user. Used in the user profile page to display order history. Orders are
 * filtered by the user's ID, so users can only see their own orders.
 */
const getMyOrders = asyncHandler(async (req, res) => {
  // Find all orders where the user ID matches the authenticated user's ID
  const orders = await Order.find({ user: req.user._id });
  
  // Return array of orders
  res.json(orders);
});

/**
 * @desc    Get a single order by its ID
 * @route   GET /api/orders/:id
 * @access  Private - Requires authentication
 * @param   {Object} req - Express request object
 * @param   {string} req.params.id - MongoDB ObjectId of the order
 * @param   {Object} req.user - User object attached by protect middleware
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object containing the order data with populated user info
 * @throws  {Error} 404 if order is not found
 * @throws  {Error} 401 if user is not authorized to view this order
 * 
 * This function retrieves a single order by its ID. It includes security
 * checks to ensure users can only view their own orders, unless they are
 * admin users who can view any order. The user information is populated
 * (joined) with the order data.
 */
const getOrderById = asyncHandler(async (req, res) => {
  // Find order by ID and populate user information
  // populate('user', 'name email') fetches only name and email from User model
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    // Order found - check authorization
    // Users can only view their own orders, unless they are admin
    // Convert ObjectIds to strings for comparison (MongoDB ObjectIds are objects)
    if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
      // User is authorized - return order data
      res.json(order);
    } else {
      // User is not authorized to view this order
      res.status(401);
      throw new Error('Not authorized');
    }
  } else {
    // Order not found
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @desc    Get all orders in the system (admin only)
 * @route   GET /api/orders
 * @access  Private/Admin - Requires admin authentication
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Array} JSON array of all order objects with populated user info
 * 
 * This function retrieves all orders in the database. It is restricted to
 * admin users only. User information (id, name, email) is populated with
 * each order. Used by admin dashboard to view and manage all orders.
 */
const getOrders = asyncHandler(async (req, res) => {
  // Find all orders and populate user information
  // populate('user', 'id name email') fetches id, name, and email from User model
  const orders = await Order.find({}).populate('user', 'id name email');
  
  // Return array of all orders
  res.json(orders);
});

/**
 * @desc    Mark an order as delivered (admin only)
 * @route   PUT /api/orders/:id/deliver
 * @access  Private/Admin - Requires admin authentication
 * @param   {Object} req - Express request object
 * @param   {string} req.params.id - MongoDB ObjectId of the order
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object containing the updated order
 * @throws  {Error} 404 if order is not found
 * 
 * This function marks an order as delivered by setting isDelivered to true
 * and recording the delivery timestamp. Only admin users can mark orders
 * as delivered. Used by admin dashboard to track order fulfillment status.
 */
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  // Find the order to update
  const order = await Order.findById(req.params.id);

  if (order) {
    // Order found - mark as delivered
    order.isDelivered = true;
    order.deliveredAt = Date.now(); // Record delivery timestamp

    // Save the updated order to the database
    const updatedOrder = await order.save();
    
    // Return the updated order
    res.json(updatedOrder);
  } else {
    // Order not found
    res.status(404);
    throw new Error('Order not found');
  }
});

// Export all controller functions
module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
};

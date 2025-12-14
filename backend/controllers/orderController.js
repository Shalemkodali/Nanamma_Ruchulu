const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
    res.status(400);
    throw new Error('Please provide complete shipping address');
  }

  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  if (!req.user._id) {
    res.status(401);
    throw new Error('User ID not found');
  }

  // Validate order items structure
  const validatedOrderItems = orderItems.map((item) => {
    if (!item.product || !item.name || !item.quantity || !item.price) {
      throw new Error('Invalid order item structure');
    }
    return {
      name: item.name,
      quantity: Number(item.quantity),
      image: item.image || '',
      price: Number(item.price),
      product: item.product,
    };
  });

  const order = new Order({
    orderItems: validatedOrderItems,
    user: req.user._id,
    shippingAddress,
    totalPrice: Number(totalPrice) || 0,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    // Check if user owns the order or is admin
    if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
      res.json(order);
    } else {
      res.status(401);
      throw new Error('Not authorized');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name email');
  res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
};


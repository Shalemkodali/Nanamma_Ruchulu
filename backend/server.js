/**
 * Express Server Entry Point
 * 
 * This is the main server file that configures and starts the Express application.
 * It sets up middleware, routes, error handling, and starts the HTTP server.
 * 
 * The server connects to MongoDB, sets up CORS, JSON parsing, and routes
 * for products, users, and orders. It also includes error handling middleware
 * and a 404 handler for undefined routes.
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Load environment variables from .env file
// This makes process.env.VARIABLE_NAME available throughout the application
dotenv.config();

// Connect to MongoDB database
// This establishes the database connection before starting the server
connectDB();

// Create Express application instance
const app = express();

/**
 * Middleware Configuration
 * 
 * Middleware functions are executed in order for every request.
 * They can modify the request/response objects or end the request-response cycle.
 */

// CORS (Cross-Origin Resource Sharing) middleware
// Allows the frontend (running on different port/domain) to make requests to this API
app.use(cors());

// Request logging middleware (for debugging)
// This logs all incoming requests to help debug issues
app.use((req, res, next) => {
  console.log(`\n=== INCOMING REQUEST ===`);
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log(`URL: ${req.url}`);
  console.log(`Headers:`, req.headers);
  next();
});

// JSON body parser middleware
// Parses JSON data from request body and makes it available as req.body
app.use(express.json());

// URL-encoded body parser middleware
// Parses URL-encoded form data (extended: true allows nested objects)
app.use(express.urlencoded({ extended: true }));

/**
 * Route Configuration
 * 
 * Routes are organized by resource (products, users, orders).
 * Each route file defines multiple endpoints for that resource.
 */

// Product routes - handles all /api/products/* requests
app.use('/api/products', productRoutes);

// User routes - handles all /api/users/* requests
app.use('/api/users', userRoutes);

// Order routes - handles all /api/orders/* requests
app.use('/api/orders', orderRoutes);

/**
 * Error Handling Middleware
 * 
 * This middleware catches errors thrown by route handlers and controllers.
 * It should be defined AFTER all routes so it can catch errors from them.
 * 
 * @param {Error} err - Error object thrown by previous middleware/route
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use((err, req, res, next) => {
  // Determine status code - use error's status code or default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Set response status code
  res.status(statusCode);
  
  // Send error response
  res.json({
    message: err.message, // Error message
    // Only include stack trace in development (not in production for security)
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

/**
 * 404 Handler (Catch-all Route)
 * 
 * This middleware handles requests to routes that don't exist.
 * It should be defined AFTER all other routes as a catch-all.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.use((req, res) => {
  // Log the 404 for debugging
  console.log('404 - Route not found:', req.method, req.path);
  
  // Send 404 response
  res.status(404).json({ message: 'Route not found' });
});

/**
 * Server Configuration and Startup
 */

// Get port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Create HTTP server and start listening on specified port
const server = app.listen(PORT, () => {
  // Log server startup message
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

/**
 * Server Error Handling
 * 
 * Handle errors that occur during server startup (e.g., port already in use).
 */
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // Port is already in use
    console.error(`Port ${PORT} is already in use. Please use a different port or stop the process using port ${PORT}.`);
    console.log(`You can set a different port in your .env file: PORT=5001`);
    process.exit(1); // Exit with error code
  } else {
    // Other server errors
    console.error('Server error:', err);
    process.exit(1); // Exit with error code
  }
});

/**
 * Authentication Middleware
 * 
 * This file contains middleware functions for authentication and authorization:
 * - protect: Verifies JWT tokens to allow access to protected routes
 * - admin: Implements Role-Based Access Control (RBAC) for admin-only routes
 * 
 * These middleware functions are used to secure API endpoints and ensure
 * only authenticated users (and optionally admin users) can access certain routes.
 */

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

/**
 * Protect Middleware Function
 * 
 * This middleware verifies JWT tokens from the Authorization header to authenticate users.
 * If the token is valid, it attaches the user object to the request and calls next().
 * If the token is invalid or missing, it returns a 401 Unauthorized error.
 * 
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @throws  {Error} 401 if token is missing, invalid, or user not found
 * 
 * Usage: Add this middleware to routes that require authentication
 * Example: router.get('/profile', protect, getUserProfile)
 * 
 * After this middleware runs, req.user contains the authenticated user object
 * (without the password field) for use in route handlers.
 */
const protect = asyncHandler(async (req, res, next) => {
  console.log('=== PROTECT MIDDLEWARE CALLED ===');
  console.log('Path:', req.path);
  console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
  
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  // JWT tokens are sent in format: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token from "Bearer <token>" format
      // split(' ') splits the string into ["Bearer", "<token>"]
      // [1] gets the second element (the actual token)
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token ? 'Yes' : 'No');
      
      // Verify and decode the JWT token
      // jwt.verify() checks the token signature and expiration
      // Returns the decoded payload (which contains the user ID)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully, user ID:', decoded.id);
      
      // Find the user by ID from the decoded token
      // select('-password') excludes the password field from the result
      // Attach the user object to the request for use in route handlers
      req.user = await User.findById(decoded.id).select('-password');
      
      // Verify that user still exists in database
      // (User might have been deleted after token was issued)
      if (!req.user) {
        console.log('User not found in database');
        res.status(401);
        throw new Error('User not found');
      }
      
      console.log('User authenticated:', req.user.email, 'isAdmin:', req.user.isAdmin);
      // Authentication successful - continue to next middleware/route handler
      next();
    } catch (error) {
      // Token verification failed (invalid signature, expired, etc.)
      console.log('Token verification failed:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    // No Authorization header or incorrect format
    console.log('No authorization header or incorrect format');
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

/**
 * Admin Middleware Function
 * 
 * This middleware checks if the authenticated user is an admin.
 * Must be used AFTER the protect middleware (which sets req.user).
 * If user is admin, calls next(). Otherwise, returns 401 Unauthorized.
 * 
 * @param   {Object} req - Express request object
 * @param   {Object} req.user - User object attached by protect middleware
 * @param   {boolean} req.user.isAdmin - Admin flag from user object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @throws  {Error} 401 if user is not an admin
 * 
 * Usage: Add this middleware AFTER protect middleware on admin-only routes
 * Example: router.delete('/:id', protect, admin, deleteProduct)
 * 
 * This implements Role-Based Access Control (RBAC) - restricting certain
 * operations (like deleting products) to administrators only.
 */
const admin = (req, res, next) => {
  console.log('=== ADMIN MIDDLEWARE CALLED ===');
  console.log('User exists:', !!req.user);
  console.log('User isAdmin:', req.user ? req.user.isAdmin : 'N/A');
  
  // Check if user exists and is an admin
  // req.user is set by protect middleware
  if (req.user && req.user.isAdmin) {
    // User is admin - allow access
    console.log('Admin access granted');
    next();
  } else {
    // User is not admin - deny access
    console.log('Admin access denied');
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

// Export middleware functions
module.exports = { protect, admin };

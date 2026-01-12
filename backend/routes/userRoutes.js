/**
 * User Routes
 * 
 * This file defines all routes related to user accounts and authentication.
 * Routes include public routes (register, login) and protected routes
 * (profile management, admin user management).
 * 
 * Routes use middleware for authentication (protect) and authorization (admin)
 * where necessary.
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
} = require('../controllers/userController');

// Import authentication middleware
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * Public Authentication Routes
 * These routes don't require authentication - anyone can access them
 * 
 * POST /api/users/register - Create a new user account
 * POST /api/users/login - Authenticate and login a user
 */
router.post('/register', registerUser); // Public route
router.post('/login', loginUser); // Public route

/**
 * User Profile Routes (Protected)
 * These routes require authentication - user must be logged in
 * 
 * GET /api/users/profile - Get current user's profile
 * PUT /api/users/profile - Update current user's profile
 */
router.route('/profile')
  .get(protect, getUserProfile) // Protected route - requires authentication
  .put(protect, updateUserProfile); // Protected route - requires authentication

/**
 * Admin User Management Routes (Protected & Admin Only)
 * These routes require authentication AND admin privileges
 * 
 * GET /api/users - Get all users (admin only)
 * DELETE /api/users/:id - Delete a user (admin only)
 */
router.route('/')
  .get(protect, admin, getUsers); // Protected route - requires admin authentication

router.route('/:id')
  .delete(protect, admin, deleteUser); // Protected route - requires admin authentication

// Export the router
module.exports = router;

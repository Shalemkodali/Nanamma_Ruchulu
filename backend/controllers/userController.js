/**
 * User Controller
 * 
 * This controller handles all user-related operations including:
 * - User registration and authentication
 * - User profile management
 * - Admin user management (list and delete users)
 * 
 * All routes use JWT (JSON Web Tokens) for authentication and bcrypt
 * for password hashing to ensure security.
 */

const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

/**
 * @desc    Register a new user account
 * @route   POST /api/users/register
 * @access  Public - Anyone can register
 * @param   {Object} req - Express request object
 * @param   {Object} req.body - User registration data
 * @param   {string} req.body.name - User's full name (required)
 * @param   {string} req.body.email - User's email address (required, must be unique)
 * @param   {string} req.body.password - User's password (required, will be hashed)
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object containing user data and JWT token
 * @throws  {Error} 400 if fields are missing or user already exists
 * 
 * This function creates a new user account. It validates input, checks for
 * duplicate emails, hashes the password using bcrypt, creates the user in
 * the database, and returns user data with a JWT token for authentication.
 * New users are created with isAdmin set to false by default.
 */
const registerUser = asyncHandler(async (req, res) => {
  // Extract user data from request body
  const { name, email, password } = req.body;

  // Validate that all required fields are provided
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if a user with this email already exists
  // MongoDB schema has unique constraint on email, but we check explicitly
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash the password before storing it in the database
  // genSalt(10) creates a salt with 10 rounds (higher = more secure but slower)
  // The salt is automatically included in the hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user in the database
  // Password is stored as hash, never as plain text
  // isAdmin defaults to false (see userModel)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    // User created successfully - return user data with JWT token
    // Never return the password hash to the client
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id), // Generate JWT token for authentication
    });
  } else {
    // User creation failed (unlikely but handle it)
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Authenticate a user and log them in
 * @route   POST /api/users/login
 * @access  Public - Anyone can login
 * @param   {Object} req - Express request object
 * @param   {Object} req.body - Login credentials
 * @param   {string} req.body.email - User's email address
 * @param   {string} req.body.password - User's plain text password
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object containing user data and JWT token
 * @throws  {Error} 401 if credentials are invalid
 * 
 * This function authenticates a user by checking their email and password.
 * It finds the user by email, compares the provided password with the stored
 * hash using bcrypt, and if successful, returns user data with a JWT token.
 * The token is used for authenticating subsequent requests.
 */
const loginUser = asyncHandler(async (req, res) => {
  // Extract login credentials from request body
  const { email, password } = req.body;

  // Find user by email address
  // User model has unique constraint on email, so only one result possible
  const user = await User.findOne({ email });

  // Verify password matches the stored hash
  // bcrypt.compare() hashes the provided password and compares it with stored hash
  // Returns true if passwords match, false otherwise
  if (user && (await bcrypt.compare(password, user.password))) {
    // Credentials are valid - return user data with JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id), // Generate JWT token for authentication
    });
  } else {
    // Invalid credentials - don't reveal whether email or password was wrong
    // This prevents user enumeration attacks
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

/**
 * @desc    Get the current user's profile information
 * @route   GET /api/users/profile
 * @access  Private - Requires authentication
 * @param   {Object} req - Express request object
 * @param   {Object} req.user - User object attached by protect middleware
 * @param   {string} req.user._id - Current user's MongoDB ObjectId
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object containing user profile data (without password)
 * @throws  {Error} 404 if user is not found
 * 
 * This function retrieves the profile information of the currently authenticated
 * user. The user object is attached to the request by the protect middleware
 * after JWT verification. Password is never returned in the response.
 */
const getUserProfile = asyncHandler(async (req, res) => {
  // Find user by ID from the authenticated request
  // req.user._id is set by protect middleware after JWT verification
  const user = await User.findById(req.user._id);

  if (user) {
    // User found - return profile data (excluding password)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    // User not found (shouldn't happen if middleware works correctly)
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update the current user's profile information
 * @route   PUT /api/users/profile
 * @access  Private - Requires authentication
 * @param   {Object} req - Express request object
 * @param   {Object} req.user - User object attached by protect middleware
 * @param   {Object} req.body - Updated user data (all fields optional)
 * @param   {string} req.body.name - Updated name (optional)
 * @param   {string} req.body.email - Updated email (optional)
 * @param   {string} req.body.password - New password (optional, will be hashed)
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object containing updated user data and new JWT token
 * @throws  {Error} 404 if user is not found
 * 
 * This function updates the profile information of the currently authenticated
 * user. Only provided fields are updated - fields not provided remain unchanged.
 * If password is provided, it is hashed before storing. A new JWT token is
 * returned after successful update.
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  // Find the user to update
  const user = await User.findById(req.user._id);

  if (user) {
    // User found - update fields if provided
    // Use || operator to keep existing value if new value not provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Only hash and update password if new password is provided
    // This allows updating profile without changing password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // Save the updated user to the database
    const updatedUser = await user.save();

    // Return updated user data with new JWT token
    // New token ensures authentication stays valid after update
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    // User not found
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Get a list of all users in the system
 * @route   GET /api/users
 * @access  Private/Admin - Requires admin authentication
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Array} JSON array of user objects (without passwords)
 * 
 * This function retrieves all users in the database. It is restricted to
 * admin users only. Passwords are excluded from the response using
 * select('-password'). Used by admin dashboard to manage users.
 */
const getUsers = asyncHandler(async (req, res) => {
  // Find all users and exclude password field
  // select('-password') removes password from the query results
  const users = await User.find({}).select('-password');
  
  // Return array of users
  res.json(users);
});

/**
 * @desc    Delete a user account from the system
 * @route   DELETE /api/users/:id
 * @access  Private/Admin - Requires admin authentication
 * @param   {Object} req - Express request object
 * @param   {string} req.params.id - MongoDB ObjectId of the user to delete
 * @param   {Object} res - Express response object
 * @returns {Object} JSON object with success message
 * @throws  {Error} 404 if user is not found
 * 
 * This function permanently deletes a user account from the database.
 * Only admin users can delete other users. First, we verify the user exists,
 * then delete them. Note: This does not cascade delete user orders or reviews.
 * Consider implementing soft delete or cascade deletion if needed.
 */
const deleteUser = asyncHandler(async (req, res) => {
  // Find the user to verify they exist
  const user = await User.findById(req.params.id);

  if (user) {
    // User exists - delete them from the database
    await User.deleteOne({ _id: user._id });
    
    // Return success message
    res.json({ message: 'User removed' });
  } else {
    // User not found
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * Generate a JWT (JSON Web Token) for user authentication
 * 
 * @param   {string} id - User's MongoDB ObjectId
 * @returns {string} JWT token string
 * 
 * This helper function generates a JWT token containing the user's ID.
 * The token is signed using a secret key from environment variables.
 * Tokens expire after 30 days. The token is used to authenticate
 * subsequent API requests without requiring login each time.
 */
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload - contains user ID
    process.env.JWT_SECRET, // Secret key from environment variables
    {
      expiresIn: '30d', // Token expires after 30 days
    }
  );
};

// Export all controller functions
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
};

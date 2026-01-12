/**
 * User Model
 * 
 * This file defines the Mongoose schema for the User collection in MongoDB.
 * Users represent accounts in the e-commerce system - both regular customers
 * and administrators.
 * 
 * The schema includes authentication information (email and hashed password),
 * user profile data, and an admin flag for role-based access control.
 */

const mongoose = require('mongoose');

/**
 * User Schema Definition
 * 
 * Defines the structure and validation rules for users in the database.
 * Uses Mongoose schema to enforce data types and requirements.
 */
const userSchema = mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true, // Name is required
    },
    
    // User's email address (used for login)
    email: {
      type: String,
      required: true, // Email is required
      unique: true, // Email must be unique - prevents duplicate accounts
    },
    
    // User's password (stored as bcrypt hash, never plain text)
    password: {
      type: String,
      required: true, // Password is required
      // Password is hashed before saving (see userController.js)
    },
    
    // Admin flag for role-based access control
    // true = admin user (can access admin routes)
    // false = regular user (standard permissions)
    isAdmin: {
      type: Boolean,
      required: true, // Field is required
      default: false, // New users are regular users by default
    },
  },
  {
    // Schema options
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the User model
// This allows other files to import and use the User schema
module.exports = mongoose.model('User', userSchema);

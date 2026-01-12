/**
 * Order Model
 * 
 * This file defines the Mongoose schema for the Order collection in MongoDB.
 * Orders represent completed purchases made by users.
 * 
 * The schema includes order items (products purchased), shipping address,
 * payment information, and order status (paid, delivered).
 */

const mongoose = require('mongoose');

/**
 * Order Schema Definition
 * 
 * Defines the structure and validation rules for orders in the database.
 * Orders contain arrays of items, shipping information, and status tracking.
 */
const orderSchema = mongoose.Schema(
  {
    // Reference to the user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User document
      required: true, // User is required - every order belongs to a user
      ref: 'User', // Model name for population
    },
    
    // Array of items in the order
    // Each item contains product information and quantity
    orderItems: [
      {
        // Product name (stored separately in case product is deleted)
        name: {
          type: String,
          required: true, // Name is required
        },
        
        // Quantity of this item ordered
        quantity: {
          type: Number,
          required: true, // Quantity is required
        },
        
        // Product image URL
        image: {
          type: String,
          required: true, // Image is required
        },
        
        // Price per unit at time of order
        // Stored separately in case product price changes later
        price: {
          type: Number,
          required: true, // Price is required
        },
        
        // Reference to the Product document
        product: {
          type: mongoose.Schema.Types.ObjectId, // Reference to Product document
          required: true, // Product reference is required
          ref: 'Product', // Model name for population
        },
      },
    ],
    
    // Shipping address object
    shippingAddress: {
      // Street address
      address: {
        type: String,
        required: true, // Address is required
      },
      
      // City name
      city: {
        type: String,
        required: true, // City is required
      },
      
      // Postal/ZIP code
      postalCode: {
        type: String,
        required: true, // Postal code is required
      },
      
      // Country name
      country: {
        type: String,
        required: true, // Country is required
      },
    },
    
    // Payment information (optional - for Stripe integration)
    paymentResult: {
      // Payment transaction ID
      id: {
        type: String,
      },
      
      // Payment status
      status: {
        type: String,
      },
      
      // Payment update time
      update_time: {
        type: String,
      },
      
      // Email address associated with payment
      email_address: {
        type: String,
      },
    },
    
    // Total price of the order
    totalPrice: {
      type: Number,
      required: true, // Total price is required
      default: 0.0, // Default to 0 if not provided
    },
    
    // Payment status flag
    isPaid: {
      type: Boolean,
      required: true, // Field is required
      default: false, // Default to false (unpaid)
    },
    
    // Payment timestamp (set when payment is processed)
    paidAt: {
      type: Date,
    },
    
    // Delivery status flag
    isDelivered: {
      type: Boolean,
      required: true, // Field is required
      default: false, // Default to false (not delivered)
    },
    
    // Delivery timestamp (set when order is marked as delivered)
    deliveredAt: {
      type: Date,
    },
  },
  {
    // Schema options
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the Order model
module.exports = mongoose.model('Order', orderSchema);

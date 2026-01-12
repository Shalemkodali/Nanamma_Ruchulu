/**
 * Database Configuration
 * 
 * This file handles the MongoDB database connection using Mongoose.
 * It exports a function that connects to the MongoDB database using
 * the connection string from environment variables.
 * 
 * The connection is established asynchronously and handles connection
 * errors by logging them and exiting the process.
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * 
 * This function establishes a connection to the MongoDB database using
 * the connection string from the MONGO_URI environment variable.
 * 
 * @throws {Error} If connection fails, logs error and exits process
 * 
 * Connection string format (from .env file):
 * MONGO_URI=mongodb://localhost:27017/the-spice-rack
 * or
 * MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/the-spice-rack
 * 
 * The function uses async/await for asynchronous database connection.
 * On successful connection, it logs the database host.
 * On failure, it logs the error and exits the Node.js process.
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from environment variables
    // mongoose.connect() returns a connection object
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Log successful connection with database host
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Connection failed - log error and exit process
    // process.exit(1) indicates an error exit code
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Export the connection function
// This allows server.js to import and call it
module.exports = connectDB;

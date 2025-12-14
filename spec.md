Project Requirements Document: The Spice Rack

Version: 1.0


Date: October 21, 2025


Author: Shalem Kodali

1. Vision & Objective
To create a high-quality, modern e-commerce platform for selling spices, providing a seamless shopping experience from browsing to checkout. The goal is to build a full-featured MERN stack application that is both functional and serves as a strong portfolio piece.
2. Target Audience

Primary: Home cooks and food enthusiasts looking for high-quality spices and recipes.


Secondary: Developers and potential employers viewing this as a portfolio project demonstrating MERN stack proficiency.

3. Project Scope & Features
This project will be built in phases, with features prioritized using the MoSCoW method. The "Must-Have" features represent the Minimum Viable Product (MVP) required for launch.
3.1. Must-Have Features (Core for Launch)

Product & Browsing:


Users can view all products on a homepage/product page.


Users can click a product to see a detailed description page.


Authentication:


Users can create a new account.


Users can log in and log out of their account.


Shopping Cart:


Users can add a product to a shopping cart.


Users can view the items, quantities, and subtotal in their cart.


Users can remove items or adjust quantities in the cart.


Checkout & Payments:


Users can enter their shipping information.


Users can securely pay for their order using Stripe.


Core Admin:


An admin can log in to a protected area.


An admin can create, edit, and delete products.

3.2. Should-Have Features (High-Priority additions after MVP)

User Experience:


Users can search for products using a search bar.


Users can leave a rating and a written review for a product.


Users receive an email confirmation after placing an order.


User Profile:


Users can view their complete order history in a personal profile.


Users can update their profile information (name, password).


Admin Dashboard:


An admin can view a list of all orders placed.


An admin can view a list of all registered users.


An admin can update an order's status (e.g., to "Shipped").

3.3. Could-Have Features (Nice additions for the future)

Content & Engagement:


Users can read blog posts or recipes managed via a headless CMS.


Users can filter products by category (e.g., "Salt-Free," "Spicy").


Shopping:


Users can add products to a personal wishlist to save for later.

3.4. Won't-Have Features (Post-Launch / Future Versions)

AI-powered chatbot assistant for customer support and recommendations.


Subscription-based "Spice of the Month" club with recurring payments.

4. Technology Stack

Frontend: React (Create React App, React Router)


State Management: Redux Toolkit


Backend: Node.js, Express.js


Database: MongoDB (with Mongoose ORM)


Authentication: JSON Web Tokens (JWT)


Payment Gateway: Stripe API


Image Hosting: Cloudinary


Deployment: Vercel (Frontend), Heroku (Backend), MongoDB Atlas (Database)


















Excellent, let's move on to Stage 2: Design. In this phase, we create the blueprints and schematics for your application. A little bit of planning here will save you a massive amount of time and headaches once you start coding.
This stage is about answering three key questions:

How will we store our data? (Database Design)


How will the frontend and backend talk to each other? (API Design)


What will the app look like and how will it flow? (UI/UX Wireframing)

Here’s a step-by-step guide to creating the design documents for "The Spice Rack."

Step 1: Database Schema Design
A schema is a blueprint for how your data is organized in the database. Even though MongoDB is flexible, defining a clear structure is crucial for a clean application.
Below are the schemas for your core "collections" (which are like tables in a traditional database). You should create a new page in your Google Doc called "Database Schema" and put this information there.
Product Collection
Stores all the information for a single spice or product.
{
  _id: ObjectId, // A unique ID, generated automatically by MongoDB
  name: String, // e.g., "Smoked Paprika"
  description: String, // Detailed text about the product
  price: Number, // e.g., 8.99
  image: String, // URL to the product image
  category: String, // e.g., "Spicy", "Salt-Free"
  stockCount: Number, // How many units are available
  reviews: [ ObjectId ], // An array of IDs that link to reviews in the 'Review' collection
  createdAt: Timestamp // The date this product was added
}
User Collection
Stores information for registered users.
{
  _id: ObjectId,
  name: String, // e.g., "John Doe"
  email: String, // e.g., "john.doe@example.com" (must be unique)
  password: String, // This will be the hashed password, NOT the plain text
  isAdmin: Boolean, // Determines if they have access to the admin dashboard (defaults to false)
  createdAt: Timestamp
}
Order Collection
Stores information about a completed purchase.
{
  _id: ObjectId,
  user: ObjectId, // The ID of the user who made the purchase
  orderItems: [ // An array of the products that were purchased
    {
      name: String,
      quantity: Number,
      image: String,
      price: Number,
      product: ObjectId // A link to the original product
    }
  ],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentResult: { // Information that comes back from Stripe
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  totalPrice: Number,
  isPaid: Boolean,
  paidAt: Timestamp,
  isDelivered: Boolean,
  deliveredAt: Timestamp,
  createdAt: Timestamp
}
Review Collection
Stores a single product review from a user.
{
  _id: ObjectId,
  user: ObjectId, // The ID of the user who wrote the review
  product: ObjectId, // The ID of the product being reviewed
  name: String, // User's name (to display with the review)
  rating: Number, // A number from 1 to 5
  comment: String, // The text of the review
  createdAt: Timestamp
}

Step 2: API Design (The Contract)
The API (Application Programming Interface) is the "contract" that defines how your frontend and backend communicate. It's a list of URLs (endpoints) that the frontend can call to get or send data.
Create a new page in your Google Doc called "API Endpoints" and list the most important ones.
Product Endpoints

GET /api/products


Description: Get a list of all products.


Response: An array of Product objects.


GET /api/products/:id


Description: Get the details of a single product.


Response: A single Product object.

User Endpoints

POST /api/users/register


Description: Create a new user account.


Request Body: { name, email, password }


Response: { _id, name, email, token } (The token is the JWT for authentication).


POST /api/users/login


Description: Log in an existing user.


Request Body: { email, password }


Response: { _id, name, email, token }

Order Endpoints

POST /api/orders


Description: Create a new order after successful payment.


Authentication: Required (user must be logged in).


Request Body: { orderItems, shippingAddress, totalPrice }


Response: The newly created Order object.


GET /api/orders/myorders


Description: Get the order history for the currently logged-in user.


Authentication: Required.


Response: An array of the user's Order objects.


Step 3: UI/UX Wireframing
A wireframe is a simple, black-and-white sketch of a webpage. It focuses only on layout and placement of elements, not on colors, fonts, or images. The goal is to plan the user's journey.
You can use a free tool like Figma or even just a piece of paper. You should create a wireframe for each key page.
Example Wireframe: Product Details Page
Here's a text-based description of a wireframe. Imagine drawing boxes for each part.
+-------------------------------------------------------------+
| [LOGO]   [Home]   [Products]   [Search Bar]   [Cart] [Login] |  <- Navbar
+-------------------------------------------------------------+
|                                                             |
|   +---------------------+        Product Name (Large Text)  |
|   |                     |        Rating: ★★★★★ (15 Reviews)   |
|   |                     |                                     |
|   |    PRODUCT IMAGE    |        Price: $8.99                 |
|   |                     |                                     |
|   |                     |        Status: In Stock             |
|   |                     |                                     |
|   +---------------------+        Quantity: [ - 1 + ]          |
|                                                               |
|                                  [ Add to Cart Button ]       |
|                                                               |
+-------------------------------------------------------------+
|                                                             |
|   Description (Section Title)                               |
|   Lorem ipsum dolor sit amet, consectetur adipiscing elit.  |
|   Duis aute irure dolor in reprehenderit in voluptate       |
|   velit esse cillum dolore eu fugiat nulla pariatur.        |
|                                                             |
+-------------------------------------------------------------+
|                                                             |
|   Reviews (Section Title)                                   |
|   ★★★★★ - Jane D. - "Absolutely fantastic!"                |
|   ★★★★☆ - John S. - "Great flavor, will buy again."          |
|                                                             |
+-------------------------------------------------------------+
Your Task: Sketch out similar simple wireframes for the Homepage, Cart Page, and Checkout Page.

Step 4: System Architecture (Folder Structure)
Finally, let's plan how you will organize your code files. A clean folder structure makes your project easy to navigate and maintain.
When you create your project, you'll have a main the-spice-rack folder, with frontend and backend folders inside it.
Backend (Node.js/Express) Structure
backend/
├── config/
│   └── db.js           # Database connection logic
├── controllers/
│   ├── productController.js # Logic for product-related requests
│   ├── userController.js    # Logic for user authentication
│   └── orderController.js   # Logic for handling orders
├── models/
│   ├── productModel.js      # The Mongoose schema for Products
│   ├── userModel.js         # The Mongoose schema for Users
│   └── orderModel.js        # The Mongoose schema for Orders
├── routes/
│   ├── productRoutes.js     # Defines the URLs for product API
│   ├── userRoutes.js      # Defines the URLs for user API
│   └── orderRoutes.js       # Defines the URLs for order API
└── server.js                # The main entry point for the backend server
Frontend (React) Structure
frontend/
├── public/
│   └── index.html      # The main HTML file
└── src/
    ├── assets/         # Images, logos, etc.
    ├── components/
    │   ├── Header.js
    │   ├── Footer.js
    │   └── Product.js    # The card component for a single product
    ├── constants/      # App-wide constants (e.g., API URLs)
    ├── screens/
    │   ├── HomeScreen.js # The homepage component
    │   ├── ProductScreen.js# The product details page component
    │   └── CartScreen.js   # The shopping cart page component
    ├── store/            # All Redux-related files (actions, reducers)
    ├── App.js            # Main app component with routing
    └── index.js          # The main entry point for the React app

Deliverables for Stage 2
You are now finished with the Design stage! Your project's "blueprint" consists of:

A Database Schema Document: Defining all your data structures.


An API Design Document: Listing your key API endpoints.


A set of UI/UX Wireframes: Simple sketches of your main pages.


A plan for your code's folder structure.


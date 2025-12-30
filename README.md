# Nanamma Ruchulu 🌶️

A full-stack e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). Users can browse spices, manage their cart, and securely checkout using Stripe. Includes a comprehensive Admin Dashboard for managing products, orders, and users.

## 🚀 Live Demo

- **Frontend (Vercel):** (https://nanamma-ruchulu.vercel.app/)
- **Backend (Render):** \(https://nanamma-ruchulu-api.onrender.com)

## ✨ Features

### User Features
- **Authentication:** Secure login and registration (JWT).
- **Product Browsing:** Search, filter, and view product details.
- **Shopping Cart:** Add items, adjust quantities, and calculate totals.
- **Secure Checkout:** Integration with Stripe for credit card payments.
- **User Profile:** Update profile info and view personal order history.
- **Reviews:** Rate products and leave comments.

### Admin Features
- **Dashboard:** Overview of products, orders, and users.
- **Product Management:** Create, edit (with image upload), and delete products.
- **Order Management:** View all orders and mark them as "Delivered".
- **User Management:** View and remove users.

## 🛠️ Tech Stack

**Frontend:**
- React.js (Hooks, Context API)
- Redux Toolkit (State Management)
- Tailwind CSS (Styling)
- React Router (Navigation)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database)
- JSON Web Token (JWT) (Auth)
- Multer & Cloudinary (Image Uploads)

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the `backend` folder:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

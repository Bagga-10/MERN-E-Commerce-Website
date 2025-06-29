# 🛍️ Bagga Store - Full Stack E-Commerce Platform

A modern, full-featured e-commerce platform built with React.js, Node.js, and MongoDB. Bagga Store provides a complete online shopping experience with user authentication, product management, shopping cart, order processing, and payment integration.

# 👇 Click for Live Demo

[![Interior Website Preview](https://github.com/user-attachments/assets/e10084f3-d580-46b5-a25e-f840d8bd6b7e)](https://mern-e-commerce-website-frontend-liart.vercel.app)

## 🌟 Features

### Customer Features
- **User Authentication** - Register, login, and profile management
- **Product Browsing** - Browse products by categories with search functionality
- **Shopping Cart** - Add/remove items, quantity management
- **Wishlist/Favorites** - Save products for later
- **Order Management** - Place orders, track order history
- **Payment Integration** - Secure payments via PayPal
- **Responsive Design** - Works seamlessly on desktop and mobile

### Admin Features
- **Admin Dashboard** - Comprehensive admin panel
- **Product Management** - Add, edit, delete products with image upload
- **Category Management** - Organize products into categories
- **Order Management** - View and manage customer orders
- **User Management** - Manage customer accounts
- **Analytics** - View sales and order statistics

## 🚀 Tech Stack

### Frontend
- **React.js** - User interface library
- **Vite** - Build tool and development server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage and management
- **PayPal API** - Payment processing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **PayPal Developer Account** (for payment integration)
- **Cloudinary Account** (for image storage)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Bagga-10/MERN-E-Commerce-Website.git
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PAYPAL_CLIENT_ID=your_paypal_client_id
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Start the backend server
npm start
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file with the following variables:
VITE_API_URL=http://localhost:5000
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id

# Start the frontend development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🎯 How to Use

### For Customers

#### 1. **Registration & Login**
- Click "Sign Up" to create a new account
- Provide email, username, and password
- Login with your credentials

#### 2. **Browse Products**
- Visit the Shop page to see all products
- Use category filters to narrow down products
- Click on any product to view detailed information

#### 3. **Shopping Cart**
- Click "Add to Cart" on any product
- View cart by clicking the cart icon
- Adjust quantities or remove items as needed

#### 4. **Favorites/Wishlist**
- Click the heart icon on products to add to favorites
- Access your favorites from the navigation menu

#### 5. **Place an Order**
- Go to your cart and click "Proceed to Checkout"
- Fill in shipping information
- Choose PayPal payment method
- Complete the payment process

#### 6. **Order History**
- View your past orders in the "My Orders" section
- Track order status and details

### For Administrators

#### 1. **Admin Access**
- Login with admin credentials
- Access the Admin Dashboard from the navigation

#### 2. **Product Management**
- **Add Products**: Click "Add Product" and fill in details
- **Edit Products**: Click on any product to modify
- **Delete Products**: Remove unwanted products
- **Upload Images**: Drag and drop product images

#### 3. **Category Management**
- Create new product categories
- Edit existing categories
- Organize products efficiently

#### 4. **Order Management**
- View all customer orders
- Update order status
- Track order details and customer information

#### 5. **User Management**
- View all registered users
- Manage user accounts and permissions


### Environment Variables for Production
Make sure to set all environment variables in your deployment platform:
- MongoDB connection string
- JWT secret
- PayPal client ID
- Cloudinary credentials

## 🔒 Security Features

- **JWT Authentication** - Secure user sessions
- **Password Hashing** - Bcrypt for password security
- **Protected Routes** - Admin and user route protection
- **Input Validation** - Server-side validation
- **CORS Configuration** - Cross-origin resource sharing

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktop (1024px and up)
- 🖥️ Large screens (1440px and up)

⭐ **If you found this project helpful, please give it a star!** ⭐

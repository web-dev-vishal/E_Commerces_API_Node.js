import express from "express";            // Express framework for creating the web server
import mongoose from "mongoose";          // MongoDB object modeling tool
import bodyParser from "express";         // For parsing incoming request bodies (NOTE: This should be 'body-parser', not 'express')
import User from './routes/user.js'; // Router for user-related endpoints
import { rateLimit } from 'express-rate-limit' // Rate limite to avoid the so many requeste
import productRouter from './routes/product.js' // Router for product-related endpoints
import cartRouter from './routes/cart.js' // Router for shopping cart functionality

// Import dotenv config function to load environment variables
import { config } from "dotenv";

// Initialize Express application
const app = express();

// Set up middleware to parse JSON request bodies
// NOTE: This should use body-parser package, not express itself
app.use(bodyParser.json());

// Load environment variables from .env file
// This allows us to keep sensitive information like database URLs and API keys separate from the code
config({ path: ".env" });

// Calling rate limite
const limiter = rateLimit({
  windowMs: 1000 * 60,
  max: 10,
  message: "Too many request from this IP, please try again later After some time"
})

// Mount the user router at the '/api/user' path
// All routes defined in userRouter will be prefixed with '/api/user'
app.use('/api/user', User)

// Mount the product router at the '/api/product' path
// All routes defined in productRouter will be prefixed with '/api/product'
app.use('/api/product',limiter, productRouter)

// Mount the cart router at the '/api/cart' path
// All routes defined in cartRouter will be prefixed with '/api/cart'
app.use('/api/cart',limiter, cartRouter)

// limter act like a middileware from to user and hacker 
app.use(limiter)

// Define a simple home route to verify the server is running
// When users access the root URL, they'll get a JSON response
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the backend server of the E-Commerce App" });
});

// Connect to MongoDB using the database URL from environment variables
// Once connected, start the Express server
mongoose.connect(process.env.DBURL)
  .then(() => {
    console.log("connected to MongoDB ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection error ❌", error);
  });

// Start the server on the specified port from environment variables
app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
})

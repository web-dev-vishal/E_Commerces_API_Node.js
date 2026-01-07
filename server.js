import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from './routes/user.js'; 
import { rateLimit } from 'express-rate-limit';
import productRouter from './routes/product.js';
import cartRouter from './routes/cart.js';
import { config } from "dotenv";

// Initialize Express application
const app = express();

// Set up middleware to parse JSON request bodies
app.use(bodyParser.json());

// Load environment variables from .env file
config({ path: ".env" });

// Calling rate limiter
const limiter = rateLimit({
  windowMs: 1000 * 60,
  max: 10,
  message: "Too many requests from this IP, please try again later"
});

// Mount the user router at the '/api/user' path
app.use('/api/user', userRouter);  // ✅ Fixed: Changed from User to userRouter

// Mount the product router at the '/api/product' path
app.use('/api/product', limiter, productRouter);

// Mount the cart router at the '/api/cart' path
app.use('/api/cart', limiter, cartRouter);

// Define a simple home route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the backend server of the E-Commerce App" });
});

// Connect to MongoDB
mongoose.connect(process.env.DBURL)
  .then(() => {
    console.log("Connected to MongoDB ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection error ❌", error);
  });

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
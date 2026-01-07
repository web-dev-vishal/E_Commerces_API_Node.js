import express from "express";
import { addToCart, clearCart, decreaseProductQty, removeProductFromCart, userCart } from "../controllers/cart.js";
import { isAuthenticated } from "../middlewares/Auth.js";

/**
 * Cart Router - Handles all cart-related API endpoints
 * Uses the isAuthenticated middleware to ensure only logged-in users can access cart functionality
 */
const router = express.Router();

/**
 * Route to add a product to the user's cart
 * POST request that requires authentication
 * @api - /api/cart/add
 */
router.post("/add", isAuthenticated, addToCart);

/**
 * Route to fetch the current user's cart contents
 * GET request that requires authentication
 * @api - /api/cart/user
 */
router.get("/user", isAuthenticated, userCart);

/**
 * Route to completely remove a specific product from the cart
 * DELETE request that requires authentication
 * The productId is passed as a URL parameter
 * @api - /api/cart/remove/:productId
 */
router.delete("/remove/:productId", isAuthenticated, removeProductFromCart);

/**
 * Route to empty the entire cart
 * DELETE request that requires authentication
 * @api - /api/cart/clear
 */
router.delete("/clear", isAuthenticated, clearCart);

/**
 * Route to decrease the quantity of a product in the cart
 * POST request that requires authentication
 * Unlike /remove which completely removes the product, this decreases quantity by one
 * @api - /api/cart/--qty
 */
router.post('/--qty', isAuthenticated, decreaseProductQty);

export default router;
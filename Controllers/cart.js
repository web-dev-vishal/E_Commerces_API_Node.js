import { Cart } from "../models/Cart.js";
/**
 * Controller to add products to a user's cart
 * Creates a new cart if one doesn't exist for the user
 * Updates quantity if product already exists in cart
 */
export const addToCart = async (req, res) => {
    // Extract product information from request body
    const { productId, title, price, qty } = req.body;

    // Get user ID from authenticated request
    const userId = req.user;

    // Find the user's cart or create one if it doesn't exist
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        // Initialize a new cart with empty items array if user doesn't have one
        cart = new Cart({ userId, items: [] });
    }

    // Check if the product already exists in the cart
    const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() == productId
    );

    if (itemIndex > -1) {
        // If product exists, increase quantity and update price
        cart.items[itemIndex].qty += qty;
        cart.items[itemIndex].price += price * qty;
    } else {
        // If product doesn't exist in cart, add it as a new item
        cart.items.push({ productId, title, price, qty });
    }

    // Save the updated cart to database
    await cart.save();

    // Send success response with updated cart
    res.json({ message: "Items added to cart", cart, success: true });
};

/**
 * Controller to retrieve a user's cart
 * Returns the entire cart object with all items
 */
export const userCart = async (req, res) => {
    // Get user ID from authenticated request
    const userId = req.user;

    // Find the user's cart in database
    let cart = await Cart.findOne({ userId });

    // Return message if cart doesn't exist
    if (!cart) return res.json({ message: "Cart was not found" });

    // Return cart data if found
    res.json({ message: "User Cart", cart });
};

/**
 * Controller to remove a specific product from the cart
 * Filters out the product with matching ID
 */
export const removeProductFromCart = async (req, res) => {
    // Get product ID from URL parameters
    const productId = req.params.productId;

    // Get user ID from authenticated request
    const userId = req.user;

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    // Return message if cart doesn't exist
    if (!cart) return res.json({ message: "Cart was not found" });

    // Filter out the product with matching ID
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

    // Save the updated cart
    await cart.save();

    // Send success response
    res.json({ message: "Product has been remove from cart" });
};

/**
 * Controller to clear all items from a user's cart
 * Either creates an empty cart or empties an existing one
 */
export const clearCart = async (req, res) => {
    // Get user ID from authenticated request
    const userId = req.user;

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    // Note: There's a bug here - should be !cart not !Cart
    if (!cart) {
        // Create new cart with empty items if doesn't exist
        cart = new Cart({ items: [] });
    } else {
        // Empty the items array if cart exists
        cart.items = [];
    }

    // Save the empty cart
    await cart.save();

    // Send success response
    res.json({ message: "User cart Cleard" });
};

/**
 * Controller to decrease the quantity of a product in the cart
 * Removes product completely if quantity would become zero
 * Calculates correct price adjustment based on unit price
 */
export const decreaseProductQty = async (req, res) => {
    // Extract product ID and quantity to decrease from request body
    const { productId, qty } = req.body;

    // Get user ID from authenticated request
    const userId = req.user;

    // Find the user's cart or create one if it doesn't exist
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    // Find the product in the cart items
    const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() == productId
    );

    if (itemIndex > -1) {
        const item = cart.items[itemIndex];

        if (item.qty > qty) {
            // Calculate price per unit to ensure correct price adjustment
            const pricePerUnit = item.price / item.qty;

            // Decrease quantity and adjust price accordingly
            item.qty -= qty;
            item.price -= pricePerUnit * qty;
        } else {
            // Remove item completely if requested decrease is >= current quantity
            cart.items.splice(itemIndex, 1);
        }
    } else {
        // Return error if product not found in cart
        return res.json({ message: 'Invalid product id' });
    }

    // Save the updated cart
    await cart.save();

    // Send success response with updated cart
    res.json({ message: "Items qty decreased", cart, success: true });
};
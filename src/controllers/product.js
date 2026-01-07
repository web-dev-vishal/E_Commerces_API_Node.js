import { Product } from "../models/product.js"

/**
 * Controller to add a new product to the database
 * Creates a product using the data provided in the request body
 * 
 * @param {Object} req - Express request object containing product details in body
 * @param {Object} res - Express response object
 */
export const addProduct = async (req, res) => {
    try {
        // Create new product using data from request body
        let product = await Product.create(req.body);
        
        // Return success response with the created product
        res.json({ message: "product added successfully", product, success: true })
    } catch (error) {
        // Return error message if product creation fails
        res.json(error.message)
    }
};

/**
 * Controller to retrieve all products from the database
 * Returns an array of all products
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllProducts = async (req, res) => {
    try {
        // Fetch all products from database
        let products = await Product.find();
        
        // Check if products exist
        if (!products)
            return res.json({ message: "No Product find", success: false });

        // Return success response with all products
        res.json({ message: "fetched all products", products, success: true })
    } catch (error) {
        // Return error message if retrieval fails
        res.json(error.message)
    }
}

/**
 * Controller to fetch a specific product by its ID
 * Returns a single product that matches the requested ID
 * 
 * @param {Object} req - Express request object with product ID in params
 * @param {Object} res - Express response object
 */
export const getProductById = async (req, res) => {
    // Extract product ID from request parameters
    const id = req.params.id;
    
    try {
        // Find product by ID in database
        let product = await Product.findById(id);
        
        // Return error if product not found
        if (!product) return res.json({ message: "Invalid Id", success: false });

        // Return success response with product data
        res.json({ message: "Fetched Specific Product", product, success: true });
    } catch (error) {
        // Return error message if retrieval fails
        res.json(error.message);
    }
};

/**
 * Controller to update a product's information
 * Finds product by ID and applies updates from request body
 * 
 * @param {Object} req - Express request object with product ID in params and update data in body
 * @param {Object} res - Express response object
 */
export const updateProductById = async (req, res) => {
    // Extract product ID from request parameters
    const id = req.params.id;
    
    try {
        // Find and update product, returning the updated document ({ new: true })
        let product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        
        // Return error if product not found
        if (!product) return res.json({ message: "Invalid Id", success: false });

        // Return success response with updated product data
        res.json({ message: "Product updated Successfully", product, success: true });
    } catch (error) {
        // Return error message if update fails
        res.json(error.message);
    }
};

/**
 * Controller to remove a product from the database
 * Permanently deletes the product with the specified ID
 * 
 * @param {Object} req - Express request object with product ID in params
 * @param {Object} res - Express response object
 */
export const deleteProductById = async (req, res) => {
    // Extract product ID from request parameters
    const id = req.params.id;
    
    try {
        // Find and delete product from database
        let product = await Product.findByIdAndDelete(id);
        
        // Return error if product not found
        if (!product) return res.json({ message: "Invalid Id", success: false });

        // Return success response (product is already deleted so not included)
        res.json({ message: "Product Delete Successfully", success: true });
    } catch (error) {
        // Return error message if deletion fails
        res.json(error.message);
    }
}
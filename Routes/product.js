import express from 'express';
import { 
  addProduct, 
  deleteProductById, 
  getAllProducts, 
  getProductById, 
  updateProductById 
} from '../controllers/product.js';

/**
 * Product Router - Handles all product-related API endpoints
 * Manages product creation, retrieval, updates and deletion
 */
const router = express.Router();

/**
 * Route to add a new product to the database
 * POST request that accepts product details in the request body
 * @api - /api/products/add (assuming this is mounted at /api/products)
 */
router.post('/add', addProduct);

/**
 * Route to retrieve all products from the database
 * GET request that returns a list of all available products
 * @api - /api/products/all
 */
router.get("/all", getAllProducts);

/**
 * Route to fetch a specific product by its ID
 * GET request that uses a URL parameter to identify the product
 * @api - /api/products/:id
 * @param {string} id - The unique identifier of the product
 */
router.get("/:id", getProductById);

/**
 * Route to update a specific product's information
 * PUT request that uses a URL parameter to identify the product
 * Accepts updated product details in the request body
 * @api - /api/products/:id
 * @param {string} id - The unique identifier of the product to update
 */
router.put("/:id", updateProductById);

/**
 * Route to remove a specific product from the database
 * DELETE request that uses a URL parameter to identify the product
 * @api - /api/products/:id
 * @param {string} id - The unique identifier of the product to delete
 */
router.delete("/:id", deleteProductById);

export default router;
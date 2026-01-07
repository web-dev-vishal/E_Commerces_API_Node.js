// Import mongoose library - the MongoDB object modeling tool
import mongoose from "mongoose";

//  Define a new schema for Product documents
//  The empty object {} means we're not explicitly defining any fields upfront
//  { strict: false } option disables Mongoose's strict mode, allowing:
//   1. Documents to have fields that aren't defined in the schema
//    2. Storing any data structure without predefined validation
//    3. Greater flexibility at the cost of schema validation
const productSchema = new mongoose.Schema({}, { strict: false });

// Create and export the Product model using the schema
// First parameter "Product" defines:
//   - The name of the model
//   - MongoDB will pluralize this to create collection name "products"
// Second parameter passes our schema that defines the document structure
export const Product = mongoose.model("Product", productSchema);
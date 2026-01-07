import mongoose from "mongoose";  // Importing mongoose to interact with MongoDB

// Defining a schema for individual items in the cart
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId, // Storing the reference ID of the product
    ref: "product", // Refers to the "product" collection in MongoDB
    require: true,  // (Incorrect: should be "required") Ensures this field is mandatory
  },
  title: { type: String, require: true },  // (Incorrect: should be "required") Product title
  price: { type: Number, require: true },  // (Incorrect: should be "required") Product price
  qty: { type: Number, require: true },    // (Incorrect: should be "required") Quantity of the product in cart
});

// Defining the schema for the entire cart
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Stores the reference ID of the user
    ref: "User", // Refers to the "User" collection
    require: true, // (Incorrect: should be "required") Ensures this field is mandatory
  },
  items: [cartItemSchema] // Array of cart items based on cartItemSchema
}); 

// Creating a model from the schema and exporting it
export const Cart = mongoose.model('Cart', cartSchema);
 
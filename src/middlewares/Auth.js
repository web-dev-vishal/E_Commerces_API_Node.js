import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

/*
 * Middleware to verify if a user is authenticated
 * This function checks if the user has a valid JWT token and attaches the user to the request object
 */
export const isAuthenticated = async (req, res, next) => {
  // Extract token from request headers
  const token = req.header("Auth");

  // If no token is provided, user is not logged in
  if (!token) return res.json({ message: "Login first" });

  // Verify the JWT token using the secret key stored in environment variables
  // This will throw an error if token is invalid or expired
  const decoded = jwt.verify(token, process.env.JWT);

  // Extract the user ID from the decoded token
  const id = decoded.userId;

  // Find the user in the database using the ID from the token
  // This confirms the user still exists in our system
  let user = await User.findById(id);

  // If user not found in database, authentication fails
  if (!user) return res.json({ message: "User not find" });

  // Attach the user object to the request
  // This makes the user data available to any subsequent middleware or route handlers
  req.user = user;

  // Call the next middleware in the stack
  // This allows the request to proceed to the protected route
  next();
};
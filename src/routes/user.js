import express from 'express';
import { login, register, forgotPassword, verifyOTP, changePassword } from '../controllers/user.js';

const router = express.Router();

// Register 
// @api - /api/user/register
router.post('/register', register);

// Login 
// @api - /api/user/login
router.post('/login', login);

// Verify with OTP
// @api - /api/user/verifyOTP/:email
router.post('/verifyOTP/:email', verifyOTP);

// Forgot Password
// @api - /api/user/forgotPassword
router.post('/forgotPassword', forgotPassword);

// Change Password
// @api - /api/user/changePassword/:email
router.post('/changePassword/:email', changePassword);

export default router;
import express from 'express'
import { login, register ,forgotPassword, verifyOTP ,changePassword } from '../controllers/user.js';


const router = express.Router();

// register 
// @api - /api/user/register
router.post('/register',register)

// login 
// @api - /api/user/login
router.post('/login',login)

// verfiywithOTP
// @api - /api/user/verifywithOTP
router.post('/verifyOTP/:email',verifyOTP)

// ForgetPassword
// @api - /api/user/forgotPassword
router.post('/forgotPassword',forgotPassword)

// changePassword
// @api - /api/user/changePassword
router.post("/changePassword/:email",changePassword )

export default router;
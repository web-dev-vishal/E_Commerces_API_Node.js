import { User } from "../models/User.js";
import { sendOtpMail } from "../emailVerify/sendOtpMail.js";
import { verifyMail } from "../emailVerify/verifyMail.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

// user registet
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.json({ message: "User already exists", success: false });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashPassword,
    isVerified: false, // Ensure the user is marked as not verified initially
  });

  // Generate a JWT token for email verification
  const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "10m" });

  // Save the token in the user document
  user.token = token;
  await user.save();

  // Send the verification email
  verifyMail(token, email);

  res.json({ message: "User registered successfully. Please verify your email.", user, success: true });
};

// user login
export const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.json({ message: "User not exist", success: false });

  const validPass = await bcrypt.compare(password, user.password);

  if (!validPass)
    return res.json({ message: "Invalid Password", success: false });

  const token = jwt.sign({userId:user._id},process.env.JWT,{
    expiresIn:'1d'
  })

  res.json({message:`Welcome ${user.name}`,token,success:true})
};

//forgot password 
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000)

        user.otp = otp;
        user.otpExpiry = expiry;
        await user.save()
        await sendOtpMail(email, otp);
        return res.status(200).json({
            success:true,
            message:"OTP sent successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// verify with otp
export const verifyOTP = async (req, res)=>{
    const {otp} = req.body
    const email = req.params.email

    if(!otp){
        return res.status(400).json({
            success:false,
            message:"OTP is requried"
        })
    }

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        if(!user.otp || !user.otpExpiry){
            return res.status(400).json({
                success:false,
                message:"OTP not generated or already verified"
            })
        }
        if (user.otpExpiry < new Date()){
            return res.status(400).json({
                success:false,
                message:"OTP has expired. Please request a new one"
            })
        }
        if(otp !== user.otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        user.otp = null
        user.otpExpiry = null
        await user.save()

        return res.status(200).json({
            success:true,
            message:"OTP verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

// chanage Password
export const changePassword = async (req, res)=>{
    const {newPassword, confirmPassword} = req.body
    const email = req.params.email
    
    if(!newPassword || !confirmPassword){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }

    if(newPassword !== confirmPassword) {
        return res.status(400).json({
            success:false,
            message:"Password do not match"
        })
    }

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()

        return res.status(200).json({
            success:true,
            message:"Password changed successsfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}
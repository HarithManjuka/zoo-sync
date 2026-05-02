import express from 'express';
import {
  register,
  login,
  requestVerificationOTP,
  verifyEmail,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.post('/register', upload.single('profileImage'), register);
router.post('/login', login);
router.post('/request-otp', requestVerificationOTP);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
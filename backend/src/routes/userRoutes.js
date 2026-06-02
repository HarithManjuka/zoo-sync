import express from 'express';
import {
  getAllUsers,
  getUserStats,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
} from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Admin: get all users
router.get('/stats', protect, authorize('Admin'), getUserStats);
router.get('/', protect, authorize('Admin'), getAllUsers);

// Protected routes (require login)
router.get('/profile', protect, getUserProfile);
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, upload.single('profileImage'), updateUserProfile);
router.put('/me', protect, upload.single('profileImage'), updateUserProfile);
router.delete('/profile', protect, deleteUserProfile);

export default router;

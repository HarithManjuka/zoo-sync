import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
} from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Protected routes (require login)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profileImage'), updateUserProfile);
router.delete('/profile', protect, deleteUserProfile);

// Admin only routes (if you have userController functions for admin)
// router.get('/', protect, authorize('Admin'), getAllUsers);
// router.delete('/:id', protect, authorize('Admin'), deleteUserAdmin);

export default router;
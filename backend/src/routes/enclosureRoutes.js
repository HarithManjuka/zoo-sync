import express from 'express';
import {
  createEnclosure,
  getAllEnclosures,
  getEnclosureById,
  getEnclosureByEnclosureId,
  updateEnclosure,
  deleteEnclosure,
  updateMaintenanceStatus,
  getEnclosureStats
} from '../controllers/enclosureController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes (for visitors)
router.get('/public/:enclosureId', getEnclosureByEnclosureId);
router.get('/stats', getEnclosureStats);  // Make public or protect as needed

// Protected routes
router.use(protect); // All routes below require authentication

// CRUD operations
router.post('/', authorize('Admin', 'Zookeeper'), createEnclosure);
router.get('/', authorize('Admin', 'Zookeeper', 'VisitorExperienceManager', 'Veterinarian'), getAllEnclosures);
router.get('/:id', authorize('Admin', 'Zookeeper', 'VisitorExperienceManager', 'Veterinarian'), getEnclosureById);
router.put('/:id', authorize('Admin', 'Zookeeper'), updateEnclosure);
router.delete('/:id', authorize('Admin'), deleteEnclosure);

// Maintenance
router.put('/:id/maintenance', authorize('Admin', 'Zookeeper'), updateMaintenanceStatus);

export default router;
import express from 'express';
import {
  createAnimal,
  getAllAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
  hardDeleteAnimal,
  transferAnimal,
  updateHealthStatus,
  getAnimalsByEnclosure,
  getSpeciesList,
  getAnimalStats,
  getAnimalForQR
} from '../controllers/animalController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ========== PUBLIC ROUTES ==========
// For visitor QR scanning (no auth required)
router.get('/qr/:id', getAnimalForQR);
router.get('/species', getSpeciesList);
router.get('/stats', getAnimalStats);

// ========== PROTECTED ROUTES ==========
router.use(protect); // All routes below require authentication

// CRUD Operations
router.post('/', authorize('Admin', 'Zookeeper'), createAnimal);
router.get('/', authorize('Admin', 'Zookeeper', 'Veterinarian', 'VisitorExperienceManager'), getAllAnimals);
router.get('/enclosure/:enclosureId', authorize('Admin', 'Zookeeper', 'Veterinarian'), getAnimalsByEnclosure);
router.get('/:id', authorize('Admin', 'Zookeeper', 'Veterinarian', 'VisitorExperienceManager'), getAnimalById);
router.put('/:id', authorize('Admin', 'Zookeeper', 'Veterinarian'), updateAnimal);
router.delete('/:id', authorize('Admin', 'Zookeeper'), deleteAnimal);

// Specialized Operations
router.put('/:id/transfer', authorize('Admin', 'Zookeeper'), transferAnimal);
router.put('/:id/health', authorize('Veterinarian', 'Admin'), updateHealthStatus);

// Admin Only
router.delete('/:id/permanent', authorize('Admin'), hardDeleteAnimal);

export default router;
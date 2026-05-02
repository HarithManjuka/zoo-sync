import mongoose from 'mongoose';
import User from './User.js';

const InventoryManagerSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, default: 'Inventory & Supply' },
  managedCategories: [{
    type: String,
    enum: ['Food', 'Medical Supplies', 'Equipment', 'Cleaning Supplies']
  }],
  hireDate: { type: Date, default: Date.now }
});

const InventoryManager = User.discriminator('InventoryManager', InventoryManagerSchema);
export default InventoryManager;
import mongoose from 'mongoose';
import User from './User.js';

const AdminSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  department: { 
    type: String, 
    enum: ['HR', 'Finance', 'Resource Management', 'Operations'],
    default: 'Operations'
  },
  permissions: [{
    type: String,
    enum: ['manage_animals', 'manage_staff', 'manage_finance', 'manage_reports', 'manage_feedback']
  }],
  hireDate: { type: Date, default: Date.now }
});

const Admin = User.discriminator('Admin', AdminSchema);
export default Admin;
import mongoose from 'mongoose';
import User from './User.js';

const VeterinarianSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  licenseNumber: { type: String, required: true, unique: true },
  specialization: { 
    type: String, 
    enum: ['General', 'Surgery', 'Dentistry', 'Pathology', 'Wildlife Medicine'],
    default: 'General'
  },
  yearsOfExperience: { type: Number, default: 0 },
  hireDate: { type: Date, default: Date.now }
});

const Veterinarian = User.discriminator('Veterinarian', VeterinarianSchema);
export default Veterinarian;
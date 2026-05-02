import mongoose from 'mongoose';
import User from './User.js';

const VisitorExperienceManagerSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, default: 'Visitor Experience' },
  managedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  hireDate: { type: Date, default: Date.now }
});

const VisitorExperienceManager = User.discriminator('VisitorExperienceManager', VisitorExperienceManagerSchema);
export default VisitorExperienceManager;
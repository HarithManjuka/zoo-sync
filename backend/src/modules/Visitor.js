import mongoose from 'mongoose';
import User from './User.js';

const VisitorSchema = new mongoose.Schema({
  // Visitors don't have employeeId
  preferences: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'English' }
  },
  bookingHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  membershipId: { type: String, unique: true, sparse: true },
  membershipValidUntil: { type: Date }
});

const Visitor = User.discriminator('Visitor', VisitorSchema);
export default Visitor;
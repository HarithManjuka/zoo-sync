import mongoose from 'mongoose';

const baseOptions = {
  discriminatorKey: 'role',
  collection: 'users',
  timestamps: true
};

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  
  // OTP for email verification
  otp: { type: String },
  otpExpires: { type: Date },
  
  // OTP for password reset
  resetPasswordOtp: { type: String },
  resetPasswordExpires: { type: Date },
  
  // Profile image
  profileImage: {
    url: { type: String, default: '' },
    public_id: { type: String, default: '' }
  },
  
  // Common location field for all roles
  location: {
    address: { type: String },
    city: { type: String },
    district: { type: String }
  }
}, baseOptions);

const User = mongoose.model('User', UserSchema);
export default User;
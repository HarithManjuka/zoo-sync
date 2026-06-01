import User from '../modules/User.js';
import Admin from '../modules/Admin.js';
import Zookeeper from '../modules/Zookeeper.js';
import VisitorExperienceManager from '../modules/VisitorExperienceManager.js';
import InventoryManager from '../modules/InventoryManager.js';
import Veterinarian from '../modules/Veterinarian.js';
import Visitor from '../modules/Visitor.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

const removeLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Auto-generate Employee ID based on role
const generateEmployeeId = async (role, model) => {
  const prefixes = {
    'Admin': 'ADM',
    'Zookeeper': 'ZK',
    'Veterinarian': 'VET',
    'VisitorExperienceManager': 'VEM',
    'InventoryManager': 'INV'
  };
  
  const prefix = prefixes[role];
  if (!prefix) return null;
  
  // Find the last employee with this prefix
  const lastEmployee = await model.findOne(
    { employeeId: { $regex: `^${prefix}`, $options: 'i' } },
    { employeeId: 1 }
  ).sort({ employeeId: -1 });
  
  let nextNumber = 1;
  if (lastEmployee && lastEmployee.employeeId) {
    const match = lastEmployee.employeeId.match(new RegExp(`^${prefix}(\\d+)$`, 'i'));
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }
  
  return `${prefix}${String(nextNumber).padStart(3, '0')}`;
};

// Auto-generate License Number for Veterinarian
const generateLicenseNumber = async (model) => {
  const lastVet = await model.findOne(
    { licenseNumber: { $regex: '^LIC', $options: 'i' } },
    { licenseNumber: 1 }
  ).sort({ licenseNumber: -1 });
  
  let nextNumber = 1;
  if (lastVet && lastVet.licenseNumber) {
    const match = lastVet.licenseNumber.match(/^LIC(\d+)$/i);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }
  
  return `LIC${String(nextNumber).padStart(6, '0')}`;
};

// REGISTER - Create new user account with auto-generated IDs
export const register = async (req, res) => {
  try {
    const { role, email, password, fullName, phone } = req.body;
    
    const validRoles = ['Admin', 'Zookeeper', 'VisitorExperienceManager', 'InventoryManager', 'Veterinarian', 'Visitor'];
    
    if (!validRoles.includes(role)) {
      if (req.file) removeLocalFile(req.file.path);
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (req.file) removeLocalFile(req.file.path);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userData = {
      fullName,
      email,
      password: hashedPassword,
      phone,
      role,
    };

    let newUser;
    let generatedEmployeeId = null;
    let generatedLicenseNumber = null;

    // Create user based on role with auto-generated IDs
    switch (role) {
      case 'Admin':
        generatedEmployeeId = await generateEmployeeId('Admin', Admin);
        userData.employeeId = generatedEmployeeId;
        userData.department = req.body.department || 'Operations';
        userData.permissions = req.body.permissions || ['manage_animals', 'manage_staff', 'manage_reports'];
        newUser = new Admin(userData);
        console.log(`✅ Generated Admin ID: ${generatedEmployeeId}`);
        break;
        
      case 'Zookeeper':
        generatedEmployeeId = await generateEmployeeId('Zookeeper', Zookeeper);
        userData.employeeId = generatedEmployeeId;
        userData.position = req.body.position || 'Zookeeper';
        userData.specialization = req.body.specialization || [];
        newUser = new Zookeeper(userData);
        console.log(`✅ Generated Zookeeper ID: ${generatedEmployeeId}`);
        break;
        
      case 'VisitorExperienceManager':
        generatedEmployeeId = await generateEmployeeId('VisitorExperienceManager', VisitorExperienceManager);
        userData.employeeId = generatedEmployeeId;
        userData.department = 'Visitor Experience';
        newUser = new VisitorExperienceManager(userData);
        console.log(`✅ Generated Manager ID: ${generatedEmployeeId}`);
        break;
        
      case 'InventoryManager':
        generatedEmployeeId = await generateEmployeeId('InventoryManager', InventoryManager);
        userData.employeeId = generatedEmployeeId;
        userData.department = 'Inventory & Supply';
        newUser = new InventoryManager(userData);
        console.log(`✅ Generated Inventory Manager ID: ${generatedEmployeeId}`);
        break;
        
      case 'Veterinarian':
        generatedEmployeeId = await generateEmployeeId('Veterinarian', Veterinarian);
        userData.employeeId = generatedEmployeeId;
        generatedLicenseNumber = await generateLicenseNumber(Veterinarian);
        userData.licenseNumber = generatedLicenseNumber;
        userData.specialization = req.body.specialization || 'General';
        userData.yearsOfExperience = req.body.yearsOfExperience || 0;
        newUser = new Veterinarian(userData);
        console.log(`✅ Generated Veterinarian ID: ${generatedEmployeeId}, License: ${generatedLicenseNumber}`);
        break;
        
      case 'Visitor':
        newUser = new Visitor(userData);
        break;
        
      default:
        if (req.file) removeLocalFile(req.file.path);
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (['Admin', 'Zookeeper', 'VisitorExperienceManager', 'InventoryManager', 'Veterinarian'].includes(role) && !generatedEmployeeId) {
      if (req.file) removeLocalFile(req.file.path);
      return res.status(500).json({ message: `Failed to generate Employee ID for ${role}` });
    }
    if (role === 'Veterinarian' && !generatedLicenseNumber) {
      if (req.file) removeLocalFile(req.file.path);
      return res.status(500).json({ message: 'Failed to generate Veterinarian license number' });
    }

    // Handle profile image upload
    if (req.file) {
      let folderName = 'zoosync/profiles';
      
      switch (role) {
        case 'Admin':
          folderName = 'zoosync/admins';
          break;
        case 'Zookeeper':
          folderName = 'zoosync/zookeepers';
          break;
        case 'Veterinarian':
          folderName = 'zoosync/veterinarians';
          break;
        case 'VisitorExperienceManager':
        case 'InventoryManager':
          folderName = 'zoosync/managers';
          break;
        case 'Visitor':
          folderName = 'zoosync/visitors';
          break;
      }
      
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: folderName
      });
      
      newUser.profileImage = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      };
      
      removeLocalFile(req.file.path);
    }

    await newUser.save();

    // Prepare response
    const responseData = {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
      profileImage: newUser.profileImage?.url || null
    };
    
    if (newUser.employeeId) {
      responseData.employeeId = newUser.employeeId;
    }
    if (newUser.licenseNumber) {
      responseData.licenseNumber = newUser.licenseNumber;
    }

    // Create success message
    let successMessage = `${role} registered successfully!`;
    if (generatedEmployeeId) {
      successMessage += ` Your Employee ID: ${generatedEmployeeId}.`;
    }
    if (generatedLicenseNumber) {
      successMessage += ` License Number: ${generatedLicenseNumber}.`;
    }
    successMessage += ` Please verify your email to continue.`;

    res.status(201).json({
      success: true,
      message: successMessage,
      user: responseData
    });
  } catch (error) {
    if (req.file) removeLocalFile(req.file.path);
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LOGIN - Authenticate user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Prepare user response data
    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      profileImage: user.profileImage?.url || null
    };

    if (user.employeeId) userResponse.employeeId = user.employeeId;
    if (user.licenseNumber) userResponse.licenseNumber = user.licenseNumber;
    if (user.department) userResponse.department = user.department;
    if (user.position) userResponse.position = user.position;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// REQUEST OTP - For email verification
export const requestVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified' });
    }
    
    const otpCode = generateOTP();
    user.otp = otpCode;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    
    await user.save();
    
    const emailMessage = `Hello ${user.fullName},\n\nYour ZooSync email verification OTP is: ${otpCode}\n\nThis code expires in 10 minutes.\n\nThank you for joining ZooSync! 🦁`;
    
    await sendEmail({
      email: user.email,
      subject: 'ZooSync - Verify Your Email',
      message: emailMessage
    });
    
    res.status(200).json({ message: 'OTP sent successfully to your email!' });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }
    
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    }
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// FORGOT PASSWORD - Send reset OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const resetOtp = generateOTP();
    user.resetPasswordOtp = resetOtp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();
    
    const emailMessage = `Hello ${user.fullName},\n\nYou requested a password reset for your ZooSync account.\n\nYour OTP is: ${resetOtp}\n\nThis code expires in 15 minutes.\n\nIf you didn't request this, please ignore this email.`;
    
    await sendEmail({
      email: user.email,
      subject: 'ZooSync - Password Reset OTP',
      message: emailMessage
    });
    
    res.status(200).json({ message: 'Password reset OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.status(200).json({ message: 'Password reset successful! You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// RESEND VERIFICATION OTP
export const resendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified' });
    }

    const otpCode = generateOTP();
    user.otp = otpCode;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const emailMessage = `Hello ${user.fullName},\n\nYour ZooSync email verification OTP is: ${otpCode}\n\nThis code expires in 10 minutes.\n\nThank you for joining ZooSync! 🦁`;
    await sendEmail({
      email: user.email,
      subject: 'ZooSync - Resend Verification OTP',
      message: emailMessage
    });

    res.status(200).json({ message: 'Verification OTP resent successfully!' });
  } catch (error) {
    console.error('Resend verification OTP error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
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

// REGISTER - Create new user account
export const register = async (req, res) => {
  try {
    const { role, email, password, fullName, phone, ...roleSpecificData } = req.body;
    
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

    const userData = {
      fullName,
      email,
      password: hashedPassword,
      phone,
      ...roleSpecificData
    };

    let newUser;

    // Create user based on role
    switch (role) {
      case 'Admin':
        if (!roleSpecificData.employeeId) {
          return res.status(400).json({ message: 'Employee ID is required for Admin' });
        }
        newUser = new Admin(userData);
        break;
        
      case 'Zookeeper':
        if (!roleSpecificData.employeeId) {
          return res.status(400).json({ message: 'Employee ID is required for Zookeeper' });
        }
        newUser = new Zookeeper(userData);
        break;
        
      case 'VisitorExperienceManager':
        if (!roleSpecificData.employeeId) {
          return res.status(400).json({ message: 'Employee ID is required for Manager' });
        }
        newUser = new VisitorExperienceManager(userData);
        break;
        
      case 'InventoryManager':
        if (!roleSpecificData.employeeId) {
          return res.status(400).json({ message: 'Employee ID is required for Inventory Manager' });
        }
        newUser = new InventoryManager(userData);
        break;
        
      case 'Veterinarian':
        if (!roleSpecificData.employeeId || !roleSpecificData.licenseNumber) {
          return res.status(400).json({ message: 'Employee ID and License Number are required for Veterinarian' });
        }
        newUser = new Veterinarian(userData);
        break;
        
      case 'Visitor':
        newUser = new Visitor(userData);
        break;
        
      default:
        if (req.file) removeLocalFile(req.file.path);
        return res.status(400).json({ message: 'Invalid role' });
    }

    // Handle profile image upload
    if (req.file) {
        // Determine folder based on user role
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
        
        user.profileImage = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        };
        
        removeLocalFile(req.file.path);
    }

    await newUser.save();

    res.status(201).json({
      success: true,
      message: `${role} registered successfully! Please verify your email to continue.`,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        profileImage: newUser.profileImage?.url || null
      }
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

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profileImage: user.profileImage?.url || null
      }
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
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
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
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
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
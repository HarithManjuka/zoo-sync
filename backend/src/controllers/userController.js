import User from '../modules/User.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password -otp -otpExpires -resetPasswordOtp -resetPasswordExpires')
        .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(query)
    ]);
    res.status(200).json({ success: true, total, count: users.length, users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user stats (Admin only)
export const getUserStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalUsers, createdToday, createdThisMonth] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);

    res.status(200).json({
      success: true,
      totalUsers,
      createdToday,
      createdThisMonth,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Get logged-in user's profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      if (req.file) removeLocalFile(req.file.path);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields
    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.location) user.location = req.body.location;

    // Handle profile image upload
    if (req.file) {
      // Delete old image if exists
      if (user.profileImage?.public_id) {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      }

      // Determine folder based on role
      let folderName = 'zoosync/profiles';
      switch (user.role) {
        case 'Admin': folderName = 'zoosync/admins'; break;
        case 'Zookeeper': folderName = 'zoosync/zookeepers'; break;
        case 'Veterinarian': folderName = 'zoosync/veterinarians'; break;
        case 'VisitorExperienceManager':
        case 'InventoryManager': folderName = 'zoosync/managers'; break;
        case 'Visitor': folderName = 'zoosync/visitors'; break;
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

    await user.save();
    
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    if (req.file) removeLocalFile(req.file.path);
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete own account
export const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete profile image from Cloudinary if exists
    if (user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }

    await user.deleteOne();
    res.status(200).json({ message: 'Your account has been deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
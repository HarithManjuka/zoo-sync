import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const RegisterForm = () => {
  const [formValues, setFormValues] = useState({
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    phone: '', 
    role: 'Visitor',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formValues.password !== formValues.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formValues.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('fullName', formValues.fullName);
      formData.append('email', formValues.email);
      formData.append('password', formValues.password);
      formData.append('phone', formValues.phone);
      formData.append('role', formValues.role);
      
      // Add profile image if selected
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/auth/register`, {
        method: 'POST',
        body: formData, // Don't set Content-Type header - browser will set it with boundary
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Show success message with generated employee ID if applicable
      const successMessage = data.message || 'Registration successful! Please verify your email.';
      toast.success(successMessage);
      
      // Store registration info for next step
      if (data.user?.employeeId) {
        localStorage.setItem('tempEmployeeId', data.user.employeeId);
      }
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      toast.error(error?.message || 'Registration failed');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get role description for the info box
  const getRoleDescription = () => {
    const descriptions = {
      'Visitor': 'Access to public features, QR scanning, and ticket booking',
      'Zookeeper': 'Manage animals, enclosures, feeding schedules, and daily tasks',
      'Veterinarian': 'Handle medical records, health status, and treatments',
      'Admin': 'Full system access, manage staff, and system configuration',
      'VisitorExperienceManager': 'Manage events, visitor content, and QR information',
      'InventoryManager': 'Track supplies, manage stock, and handle purchase orders'
    };
    return descriptions[formValues.role] || 'Choose a role to see description';
  };

  const getRoleBadgeColor = () => {
    const colors = {
      'Visitor': 'bg-blue-100 text-blue-800',
      'Zookeeper': 'bg-green-100 text-green-800',
      'Veterinarian': 'bg-purple-100 text-purple-800',
      'Admin': 'bg-red-100 text-red-800',
      'VisitorExperienceManager': 'bg-orange-100 text-orange-800',
      'InventoryManager': 'bg-cyan-100 text-cyan-800'
    };
    return colors[formValues.role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {/* Profile Image Upload */}
      <div className="flex justify-center mb-2">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zoo-500 to-lime-400 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            {profileImagePreview ? (
              <img 
                src={profileImagePreview} 
                alt="Profile preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-zoo-500 rounded-full p-1.5 cursor-pointer shadow-lg hover:bg-zoo-600 transition">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800">Full Name</label>
        <input 
          name="fullName" 
          type="text"
          value={formValues.fullName} 
          onChange={handleChange} 
          placeholder="Enter your full name"
          required
          className="w-full rounded-xl border border-zoo-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zoo-500 focus:border-transparent transition"
        />
      </div>
      
      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800">Email</label>
        <input 
          name="email" 
          type="email" 
          value={formValues.email} 
          onChange={handleChange} 
          placeholder="you@example.com"
          required
          className="w-full rounded-xl border border-zoo-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zoo-500 focus:border-transparent transition"
        />
      </div>
      
      {/* Phone */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800">Phone</label>
        <input 
          name="phone" 
          type="tel"
          value={formValues.phone} 
          onChange={handleChange} 
          placeholder="+94 XX XXX XXXX"
          required
          className="w-full rounded-xl border border-zoo-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zoo-500 focus:border-transparent transition"
        />
      </div>
      
      {/* Password Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-800">Password</label>
          <input 
            name="password" 
            type="password" 
            value={formValues.password} 
            onChange={handleChange} 
            placeholder="••••••"
            required
            className="w-full rounded-xl border border-zoo-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zoo-500 focus:border-transparent transition"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-800">Confirm Password</label>
          <input 
            name="confirmPassword" 
            type="password" 
            value={formValues.confirmPassword} 
            onChange={handleChange} 
            placeholder="••••••"
            required
            className="w-full rounded-xl border border-zoo-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zoo-500 focus:border-transparent transition"
          />
        </div>
      </div>
      
      {/* Role Selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800">Role</label>
        <select 
          name="role" 
          value={formValues.role} 
          onChange={handleChange}
          className="w-full rounded-xl border border-zoo-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zoo-500 focus:border-transparent transition cursor-pointer"
        >
          <option value="Visitor">👤 Visitor</option>
          <option value="Zookeeper">🦁 Zookeeper</option>
          <option value="Veterinarian">🏥 Veterinarian</option>
          <option value="Admin">👑 Admin</option>
          <option value="VisitorExperienceManager">🎫 Visitor Experience Manager</option>
          <option value="InventoryManager">📦 Inventory Manager</option>
        </select>
        
        {/* Role Description Badge */}
        <div className="flex items-center gap-2 mt-2">
          <div className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor()}`}>
            {formValues.role}
          </div>
          <p className="text-xs text-gray-500">{getRoleDescription()}</p>
        </div>
      </div>
      
      {/* Auto-generated ID Info Box */}
      <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div className="text-xs text-green-800">
            {formValues.role === 'Visitor' ? (
              <>
                <strong>No Employee ID needed</strong> — Visitors register with just email and phone.
              </>
            ) : (
              <>
                <strong>Employee ID will be auto-generated</strong> — You'll receive a unique ID like 
                <span className="font-mono font-bold mx-1">
                  {formValues.role === 'Admin' && 'ADM001'}
                  {formValues.role === 'Zookeeper' && 'ZK001'}
                  {formValues.role === 'Veterinarian' && 'VET001'}
                  {formValues.role === 'VisitorExperienceManager' && 'VEM001'}
                  {formValues.role === 'InventoryManager' && 'INV001'}
                </span>
                after registration.
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-zoo-500 to-zoo-600 px-4 py-3 text-base font-bold text-white shadow-lg shadow-zoo-500/30 transition-all hover:from-zoo-600 hover:to-zoo-700 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </div>
        ) : (
          'Create Account'
        )}
      </button>
      
      {/* Terms Agreement */}
      <p className="text-center text-xs text-gray-500 mt-2">
        By creating an account, you agree to our{' '}
        <a href="/terms" className="text-zoo-600 hover:underline">Terms of Service</a>{' '}
        and{' '}
        <a href="/privacy" className="text-zoo-600 hover:underline">Privacy Policy</a>
      </p>
    </form>
  );
};

export default RegisterForm;
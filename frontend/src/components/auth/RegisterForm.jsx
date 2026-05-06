import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const RegisterForm = () => {
  const [formValues, setFormValues] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', phone: '', role: 'Visitor'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formValues.password !== formValues.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.message || 'Registration failed');
      }

      toast.success('Registration successful! Please verify your email.');
      navigate('/login');
    } catch (error) {
      toast.error(error?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800">Full Name</label>
        <input name="fullName" value={formValues.fullName} onChange={handleChange} required
          className="w-full rounded-xl border border-zoo-200 px-4 py-3" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800">Email</label>
        <input name="email" type="email" value={formValues.email} onChange={handleChange} required
          className="w-full rounded-xl border border-zoo-200 px-4 py-3" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800">Phone</label>
        <input name="phone" value={formValues.phone} onChange={handleChange} required
          className="w-full rounded-xl border border-zoo-200 px-4 py-3" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-800">Password</label>
          <input name="password" type="password" value={formValues.password} onChange={handleChange} required
            className="w-full rounded-xl border border-zoo-200 px-4 py-3" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-800">Confirm Password</label>
          <input name="confirmPassword" type="password" value={formValues.confirmPassword} onChange={handleChange} required
            className="w-full rounded-xl border border-zoo-200 px-4 py-3" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800">Role</label>
        <select name="role" value={formValues.role} onChange={handleChange}
          className="w-full rounded-xl border border-zoo-200 px-4 py-3">
          <option value="Visitor">Visitor</option>
          <option value="Zookeeper">Zookeeper</option>
          <option value="Veterinarian">Veterinarian</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      <button type="submit" disabled={isSubmitting}
        className="w-full rounded-xl bg-zoo-500 px-4 py-3 text-base font-bold text-white shadow-lg shadow-zoo-500/30 transition hover:bg-zoo-600 active:scale-95 disabled:opacity-70">
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default RegisterForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.message || 'Login failed');
      }

      const data = await response.json();
      login(data.user, data.token);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full rounded-xl border border-zoo-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-zoo-500 focus:ring-2 focus:ring-zoo-200"
          placeholder="you@example.com"
          value={formValues.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-800" htmlFor="password">Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            className="w-full rounded-xl border border-zoo-200 bg-white px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-zoo-500 focus:ring-2 focus:ring-zoo-200"
            placeholder="••••••••"
            value={formValues.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-700"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-zoo-500 px-4 py-3 text-base font-bold text-white shadow-lg shadow-zoo-500/30 transition hover:bg-zoo-600 focus:ring-2 focus:ring-zoo-400 focus:ring-offset-2 active:scale-95 disabled:opacity-70"
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>

      <div className="text-right text-sm text-zoo-700 font-semibold">
        <button type="button" onClick={() => navigate('/forgot-password')} className="underline hover:text-zoo-800">
          Forgot password?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';

const AuthPage = ({ initialMode }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const location = useLocation();

  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode, location]);

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zoo-500/35 via-slate-900 to-zoo-900" />
        <div className="absolute -right-24 top-10 h-64 w-64 rounded-full bg-zoo-400/20 blur-3xl" />
        <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative flex flex-col justify-between bg-gradient-to-br from-zoo-500 to-lime-400 text-white p-6 sm:p-7 md:p-10 min-h-[220px]">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10 space-y-4 sm:space-y-6">
                <Link to="/" className="inline-flex items-center text-xs sm:text-sm text-zoo-50 hover:text-white transition">
                  ← Back to Home
                </Link>
                <div>
                  <p className="inline-flex items-center rounded-full bg-white/20 px-3 sm:px-4 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wide">ZooSync</p>
                  <h1 className="mt-3 sm:mt-4 text-3xl sm:text-4xl font-bold leading-tight">Zoo Management System</h1>
                  <p className="mt-3 text-zoo-50/90 text-base sm:text-lg">Secure access for staff, veterinarians, and administrators.</p>
                </div>
              </div>
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-zoo-50/90">
                <div className="rounded-xl bg-white/10 px-4 py-3 shadow-inner">
                  <p className="text-xs uppercase tracking-wide text-zoo-50/70">Role Based Access</p>
                  <p className="mt-1 text-base font-semibold">Staff · Vets · Admin</p>
                </div>
                <div className="rounded-xl bg-white/10 px-4 py-3 shadow-inner">
                  <p className="text-xs uppercase tracking-wide text-zoo-50/70">24/7 Support</p>
                  <p className="mt-1 text-base font-semibold">Dedicated Team</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 sm:p-10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zoo-600">{isLogin ? 'Welcome back' : 'Join ZooSync'}</p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900">{isLogin ? 'Sign in' : 'Create your account'}</h2>
                  <p className="mt-2 text-sm text-slate-600">Access the zoo management platform.</p>
                </div>
                <Link to="/" className="md:hidden text-sm font-semibold text-zoo-700 hover:text-zoo-800">Home</Link>
              </div>

              <div className="space-y-6">
                {isLogin ? <LoginForm /> : <RegisterForm />}

                <div className="text-center text-sm text-slate-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-semibold text-zoo-700 hover:text-zoo-800"
                  >
                    {isLogin ? 'Create one' : 'Login'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
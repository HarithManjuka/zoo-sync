import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-display font-bold text-zoo-700">
            ZooSync<span className="text-zoo-500">.LK</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-zoo-600">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-zoo-600">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-zoo-600">Contact</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-zoo-600">Dashboard</Link>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-zoo-600">Login</Link>
                <Link to="/register" className="bg-zoo-600 text-white px-5 py-2 rounded-xl hover:bg-zoo-700">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
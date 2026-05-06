import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 px-6">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-display font-bold text-white">
            ZooSync<span className="text-zoo-500">.LK</span>
          </div>
          <p className="text-sm">© 2025 ZooSync. Smart Zoo Management System</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-zoo-400">About</Link>
            <Link to="/contact" className="hover:text-zoo-400">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-zoo-900 to-zoo-700 flex items-center">
        <div className="container-custom relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Smart Zoo Management
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-8">
            Streamline animal care, enclosure management, and staff coordination
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="btn-primary bg-white text-zoo-700 hover:bg-gray-100">
              Staff Login
            </Link>
            <Link to="/register" className="border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-xl font-semibold">
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
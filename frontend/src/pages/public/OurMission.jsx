import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const OurMission = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container-custom py-16">
        <h1 className="text-4xl font-display font-bold text-center text-zoo-800 mb-6">Our Mission</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          To modernize zoo management through technology, ensuring better animal care and visitor experience.
        </p>
        {/* Add more content */}
      </div>
      <Footer />
    </div>
  );
};

export default OurMission;
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const Dashboard = () => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-custom py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome, {user?.fullName || 'User'}!
          </h1>
          <p className="text-gray-600">
            Role: <span className="font-semibold text-zoo-600">{user?.role}</span>
          </p>
          <p className="text-gray-600 mt-2">
            Email: {user?.email}
          </p>
          <div className="mt-6 p-4 bg-zoo-50 rounded-xl border border-zoo-200">
            <p className="text-zoo-800">
              Dashboard content coming soon. Your role-based features will appear here.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
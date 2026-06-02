import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const { user, token, isAuthReady } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zoo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) return <Navigate to="/login" />;
  if (user?.role !== 'Admin') return <Navigate to="/dashboard" />;

  const sidebarW = collapsed ? 'ml-20' : 'ml-64';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content */}
      <main className={`flex-1 ${sidebarW} transition-all duration-300 min-h-screen`}>
        <Outlet />
      </main>
    </div>
  );
}

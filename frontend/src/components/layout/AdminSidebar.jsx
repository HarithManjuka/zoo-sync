import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard',     path: '/admin',            icon: <GridIcon /> },
      { label: 'Analytics',     path: '/admin/analytics',  icon: <ChartIcon /> },
    ],
  },
  {
    group: 'Management',
    items: [
      { label: 'Animals',       path: '/admin/animals',    icon: <PawIcon /> },
      { label: 'Enclosures',    path: '/admin/enclosures', icon: <HomeIcon /> },
      { label: 'Staff',         path: '/admin/staff',      icon: <UsersIcon /> },
    ],
  },
  {
    group: 'System',
    items: [
      { label: 'Settings',      path: '/admin/settings',   icon: <GearIcon /> },
    ],
  },
];

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-40 flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
        bg-gray-950 border-r border-gray-800
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
        <div className="w-9 h-9 rounded-xl bg-zoo-600 flex items-center justify-center shrink-0 shadow-lg shadow-zoo-900/50">
          <span className="text-white text-lg font-bold">Z</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-base leading-tight">ZooSync</p>
            <p className="text-zoo-400 text-xs font-medium">Admin Panel</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`ml-auto p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ${collapsed ? 'mx-auto' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronIcon collapsed={collapsed} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
        {NAV_ITEMS.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
                {group.group}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/admin'}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                      ${isActive
                        ? 'bg-zoo-600 text-white shadow-md shadow-zoo-900/40'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`
                    }
                  >
                    <span className="shrink-0 w-5 h-5">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User profile bottom */}
      <div className="border-t border-gray-800 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-800 transition-colors">
            <div className="w-9 h-9 rounded-full bg-zoo-700 flex items-center justify-center shrink-0">
              {user?.profileImage?.url ? (
                <img src={user.profileImage.url} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white text-sm font-semibold">
                  {user?.fullName?.charAt(0) || 'A'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.fullName || 'Admin'}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogoutIcon />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center p-2 text-gray-500 hover:text-red-400 transition-colors rounded-xl hover:bg-gray-800"
            title="Logout"
          >
            <LogoutIcon />
          </button>
        )}
      </div>
    </aside>
  );
}

// ---- SVG Icon Components ----
function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 4-4"/>
    </svg>
  );
}
function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <ellipse cx="6" cy="7.5" rx="2" ry="3" opacity=".8"/>
      <ellipse cx="18" cy="7.5" rx="2" ry="3" opacity=".8"/>
      <ellipse cx="9.5" cy="5" rx="1.5" ry="2.5" opacity=".8"/>
      <ellipse cx="14.5" cy="5" rx="1.5" ry="2.5" opacity=".8"/>
      <path d="M12 10c-3.5 0-6 2-6 5 0 2.5 1.5 4 3 4 .8 0 1.5-.3 2.1-.7.5-.3 1.2-.3 1.8 0 .6.4 1.3.7 2.1.7 1.5 0 3-1.5 3-4 0-3-2.5-5-6-5z"/>
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}
function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );
}
function ChevronIcon({ collapsed }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} stroke="currentColor" strokeWidth="2.5">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

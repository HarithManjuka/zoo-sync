import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminTopbar({ title, subtitle }) {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'Lion cub health check due', time: '2h ago', type: 'warning' },
    { id: 2, text: 'Tropical Dome maintenance scheduled', time: '5h ago', type: 'info' },
    { id: 3, text: 'New staff member registered', time: '1d ago', type: 'success' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Title */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                  <p className="font-semibold text-gray-800 text-sm">Notifications</p>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">{notifications.length} new</span>
                </div>
                <ul>
                  {notifications.map(n => (
                    <li key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'warning' ? 'bg-amber-400' : n.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2.5 text-center">
                  <button className="text-zoo-600 text-xs font-medium hover:underline">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
            <div className="w-8 h-8 rounded-full bg-zoo-700 flex items-center justify-center shrink-0">
              {user?.profileImage?.url ? (
                <img src={user.profileImage.url} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white text-xs font-semibold">{user?.fullName?.charAt(0) || 'A'}</span>
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800 leading-none">{user?.fullName || 'Admin'}</p>
              <p className="text-xs text-zoo-600 font-medium mt-0.5">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

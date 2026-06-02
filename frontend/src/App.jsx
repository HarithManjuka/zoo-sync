import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

// Public Pages
import Homepage from './pages/public/Homepage'
import OurMission from './pages/public/OurMission'
import Contact from './pages/public/Contact'

// Auth Pages
import AuthPage from './pages/auth/AuthPage'

// General Dashboard (non-admin roles)
import Dashboard from './pages/dashboard/Dashboard'

// Admin Layout + Pages
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage'
import AdminAnalyticsPage from './pages/dashboard/AdminAnalyticsPage'
import AdminAnimalsPage from './pages/admin/AdminAnimalsPage'
import AdminEnclosuresPage from './pages/admin/AdminEnclosuresPage'
import AdminStaffPage from './pages/admin/AdminStaffPage'
import AdminSettingsPage from './pages/settings/AdminSettingsPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<OurMission />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Routes */}
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/register" element={<AuthPage initialMode="register" />} />

          {/* General Dashboard (non-admin roles) */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Admin Dashboard (nested layout) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="animals" element={<AdminAnimalsPage />} />
            <Route path="enclosures" element={<AdminEnclosuresPage />} />
            <Route path="staff" element={<AdminStaffPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
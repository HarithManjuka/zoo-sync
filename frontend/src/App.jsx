import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

// Public Pages
import Homepage from './pages/public/Homepage'
import OurMission from './pages/public/OurMission'
import Contact from './pages/public/Contact'

// Auth Pages
import AuthPage from './pages/auth/AuthPage'

// Dashboard
import Dashboard from './pages/dashboard/Dashboard'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<OurMission />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/register" element={<AuthPage initialMode="register" />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/animals', label: 'Animals' },
    { to: '/enclosures', label: 'Enclosures' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .zs-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.4s ease;
          font-family: 'DM Sans', sans-serif;
        }

        .zs-nav-inner {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          background: rgba(5, 18, 10, 0.55);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          transition: all 0.4s ease;
        }

        .zs-nav.scrolled .zs-nav-inner {
          background: rgba(5, 18, 10, 0.85);
          border-bottom: 1px solid rgba(74, 147, 82, 0.15);
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        }

        .zs-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }

        .zs-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          position: relative;
        }

        .zs-logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #4a9352, #2d6b35);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(74, 147, 82, 0.3);
        }

        .zs-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.01em;
        }

        .zs-logo-text span {
          color: #6bc97a;
        }

        .zs-nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .zs-nav-link {
          position: relative;
          padding: 6px 14px;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          font-weight: 400;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .zs-nav-link:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.06);
        }

        .zs-nav-link.active {
          color: #6bc97a;
          background: rgba(74, 147, 82, 0.1);
        }

        .zs-nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 2px;
          background: #6bc97a;
          border-radius: 2px;
        }

        .zs-nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .zs-btn-ghost {
          padding: 8px 18px;
          border-radius: 9px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.12);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .zs-btn-ghost:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.22);
          color: #fff;
        }

        .zs-btn-primary {
          padding: 8px 20px;
          border-radius: 9px;
          background: linear-gradient(135deg, #4a9352, #2d6b35);
          color: #fff;
          font-size: 0.875rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 12px rgba(74, 147, 82, 0.3);
        }

        .zs-btn-primary:hover {
          background: linear-gradient(135deg, #5aaa63, #3a7d43);
          box-shadow: 0 4px 20px rgba(74, 147, 82, 0.45);
          transform: translateY(-1px);
        }

        .zs-btn-logout {
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 8px 18px;
          border-radius: 9px;
          font-size: 0.875rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .zs-btn-logout:hover {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.5);
        }

        .zs-mobile-toggle {
          display: none;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          flex-direction: column;
          gap: 5px;
          transition: all 0.2s ease;
        }

        .zs-mobile-toggle:hover {
          background: rgba(255,255,255,0.06);
        }

        .zs-hamburger-line {
          width: 22px;
          height: 2px;
          background: rgba(255,255,255,0.8);
          border-radius: 2px;
          transition: all 0.3s ease;
          display: block;
        }

        .zs-hamburger-line.open:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .zs-hamburger-line.open:nth-child(2) {
          opacity: 0;
        }
        .zs-hamburger-line.open:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .zs-mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          background: rgba(5, 18, 10, 0.95);
          border-bottom: 1px solid rgba(74, 147, 82, 0.15);
          padding: 1rem 2rem 1.5rem;
          animation: slideDown 0.3s ease;
        }

        .zs-mobile-menu.open {
          display: block;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .zs-mobile-links {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .zs-mobile-link {
          display: block;
          padding: 10px 12px;
          border-radius: 8px;
          color: rgba(255,255,255,0.75);
          font-size: 0.9rem;
          font-weight: 400;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .zs-mobile-link:hover, .zs-mobile-link.active {
          background: rgba(74, 147, 82, 0.1);
          color: #6bc97a;
        }

        .zs-mobile-actions {
          display: flex;
          gap: 10px;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        @media (max-width: 900px) {
          .zs-nav-links, .zs-nav-actions { display: none; }
          .zs-mobile-toggle { display: flex; }
          .zs-mobile-menu { display: none; }
          .zs-mobile-menu.open { display: block; }
        }
      `}</style>

      <nav className={`zs-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="zs-nav-inner">
          <div className="zs-container">
            {/* Logo */}
            <Link to="/" className="zs-logo">
              <div className="zs-logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8 2 4 5.5 4 9c0 2.5 1.5 4.5 3 6l5 7 5-7c1.5-1.5 3-3.5 3-6 0-3.5-4-7-8-7z" fill="rgba(255,255,255,0.9)"/>
                  <circle cx="12" cy="9" r="2.5" fill="rgba(5,18,10,0.6)"/>
                </svg>
              </div>
              <span className="zs-logo-text">ZooSync<span>.LK</span></span>
            </Link>

            {/* Desktop Nav */}
            <ul className="zs-nav-links">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`zs-nav-link ${isActive(to) ? 'active' : ''}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop Actions */}
            <div className="zs-nav-actions">
              {user ? (
                <>
                  <Link to="/dashboard" className="zs-btn-ghost">Dashboard</Link>
                  <button onClick={handleLogout} className="zs-btn-logout">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="zs-btn-ghost">Login</Link>
                  <Link to="/register" className="zs-btn-primary">Get Started</Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="zs-mobile-toggle"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
            >
              <span className={`zs-hamburger-line ${isOpen ? 'open' : ''}`} />
              <span className={`zs-hamburger-line ${isOpen ? 'open' : ''}`} />
              <span className={`zs-hamburger-line ${isOpen ? 'open' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`zs-mobile-menu ${isOpen ? 'open' : ''}`}>
          <ul className="zs-mobile-links">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`zs-mobile-link ${isActive(to) ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="zs-mobile-actions">
            {user ? (
              <button onClick={handleLogout} className="zs-btn-logout">Logout</button>
            ) : (
              <>
                <Link to="/login" className="zs-btn-ghost" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="zs-btn-primary" onClick={() => setIsOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
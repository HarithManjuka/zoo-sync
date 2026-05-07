import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .zs-footer {
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(180deg, #050f08 0%, #030c06 60%, #020a04 100%);
          position: relative;
          overflow: hidden;
        }

        .zs-footer-canopy {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(180deg, rgba(74,147,82,0.04) 0%, transparent 100%);
          pointer-events: none;
        }

        /* Jungle silhouette SVG background */
        .zs-footer-silhouette {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          opacity: 0.04;
          pointer-events: none;
          overflow: hidden;
        }

        .zs-footer-grid-line {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, rgba(74,147,82,0.15) 0%, transparent 100%);
          pointer-events: none;
        }

        .zs-footer-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 5rem 2rem 3rem;
          position: relative;
          z-index: 1;
        }

        .zs-footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem;
          padding-bottom: 3.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .zs-footer-brand .zs-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          margin-bottom: 1.25rem;
        }

        .zs-logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #4a9352, #2d6b35);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(74, 147, 82, 0.2);
          flex-shrink: 0;
        }

        .zs-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
        }

        .zs-logo-text span {
          color: #6bc97a;
        }

        .zs-footer-desc {
          color: rgba(255,255,255,0.42);
          font-size: 0.875rem;
          line-height: 1.75;
          margin-bottom: 1.5rem;
          max-width: 280px;
        }

        .zs-social-row {
          display: flex;
          gap: 10px;
        }

        .zs-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .zs-social-btn:hover {
          background: rgba(74,147,82,0.15);
          border-color: rgba(74,147,82,0.3);
          color: #6bc97a;
          transform: translateY(-2px);
        }

        .zs-footer-col h4 {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 1.25rem;
        }

        .zs-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .zs-footer-link {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .zs-footer-link:hover {
          color: #6bc97a;
          transform: translateX(3px);
        }

        .zs-contact-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .zs-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: rgba(255,255,255,0.5);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .zs-contact-icon {
          width: 16px;
          height: 16px;
          color: #4a9352;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .zs-newsletter-col h4 {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 0.75rem;
        }

        .zs-newsletter-desc {
          color: rgba(255,255,255,0.42);
          font-size: 0.83rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .zs-newsletter-form {
          display: flex;
          gap: 8px;
        }

        .zs-newsletter-input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          padding: 9px 14px;
          color: #fff;
          font-size: 0.85rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s ease;
        }

        .zs-newsletter-input::placeholder {
          color: rgba(255,255,255,0.25);
        }

        .zs-newsletter-input:focus {
          border-color: rgba(74,147,82,0.4);
          background: rgba(74,147,82,0.05);
        }

        .zs-newsletter-btn {
          background: linear-gradient(135deg, #4a9352, #2d6b35);
          border: none;
          border-radius: 9px;
          padding: 9px 16px;
          color: #fff;
          font-size: 0.85rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .zs-newsletter-btn:hover {
          background: linear-gradient(135deg, #5aaa63, #3a7d43);
          transform: translateY(-1px);
        }

        .zs-subscribe-success {
          color: #6bc97a;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Glassmorphism badge */
        .zs-footer-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 100px;
          background: rgba(74,147,82,0.08);
          border: 1px solid rgba(74,147,82,0.2);
          color: rgba(107,201,122,0.8);
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 1rem;
          letter-spacing: 0.02em;
        }

        .zs-footer-bottom {
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .zs-copyright {
          color: rgba(255,255,255,0.28);
          font-size: 0.8rem;
        }

        .zs-footer-bottom-links {
          display: flex;
          gap: 20px;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .zs-footer-bottom-link {
          color: rgba(255,255,255,0.28);
          font-size: 0.8rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .zs-footer-bottom-link:hover {
          color: rgba(107,201,122,0.7);
        }

        /* Wildlife silhouette */
        .zs-wildlife-svg {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          opacity: 0.025;
          pointer-events: none;
        }

        @media (max-width: 1024px) {
          .zs-footer-top {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          .zs-footer-top {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .zs-footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <footer className="zs-footer">
        <div className="zs-footer-canopy" />
        <div className="zs-footer-grid-line" />

        {/* Wildlife silhouette */}
        <svg className="zs-wildlife-svg" viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax meet" fill="currentColor" color="white">
          <path d="M0,200 L0,140 Q20,120 40,130 Q60,140 80,110 Q100,80 120,100 L140,90 Q160,70 180,85 Q200,100 220,80 Q240,60 260,75 L280,65 Q290,55 310,70 Q330,85 350,60 Q370,35 390,55 L420,45 Q440,30 460,50 Q480,70 500,45 Q520,20 540,40 L560,30 Q580,15 600,35 Q620,55 640,30 Q660,5 680,25 L700,15 Q720,0 740,20 Q760,40 780,15 Q800,0 820,20 L840,10 Q860,0 880,18 Q900,36 920,12 Q940,0 960,18 L980,8 Q1000,0 1020,16 Q1040,32 1060,10 L1080,0 Q1100,10 1120,30 Q1140,50 1160,25 Q1180,10 1200,28 L1220,18 Q1240,8 1260,25 Q1280,42 1300,22 L1320,15 Q1360,5 1400,30 L1440,15 L1440,200 Z"/>
        </svg>

        <div className="zs-footer-main">
          <div className="zs-footer-top">
            {/* Brand */}
            <div className="zs-footer-brand">
              <div className="zs-footer-badge">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <circle cx="5" cy="5" r="4"/>
                </svg>
                Smart Zoo Management
              </div>
              <Link to="/" className="zs-logo">
                <div className="zs-logo-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8 2 4 5.5 4 9c0 2.5 1.5 4.5 3 6l5 7 5-7c1.5-1.5 3-3.5 3-6 0-3.5-4-7-8-7z" fill="rgba(255,255,255,0.9)"/>
                    <circle cx="12" cy="9" r="2.5" fill="rgba(5,18,10,0.6)"/>
                  </svg>
                </div>
                <span className="zs-logo-text">ZooSync<span>.LK</span></span>
              </Link>
              <p className="zs-footer-desc">
                A modern zoo management platform designed to streamline animal care, staff operations, enclosure management, and visitor experience across Sri Lanka.
              </p>
              <div className="zs-social-row">
                {/* Twitter/X */}
                <a href="#" className="zs-social-btn" aria-label="Twitter">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.734-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="zs-social-btn" aria-label="LinkedIn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                {/* Instagram */}
                <a href="#" className="zs-social-btn" aria-label="Instagram">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                {/* Facebook */}
                <a href="#" className="zs-social-btn" aria-label="Facebook">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="zs-footer-col">
              <h4>Platform</h4>
              <ul className="zs-footer-links">
                {[
                  { to: '/features', label: 'Features' },
                  { to: '/animals', label: 'Animals' },
                  { to: '/enclosures', label: 'Enclosures' },
                  { to: '/dashboard', label: 'Dashboard' },
                  { to: '/register', label: 'Get Started' },
                  { to: '/login', label: 'Login' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="zs-footer-link">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{color:'#4a9352', flexShrink:0}}>
                        <path d="M1 4h6M4 1l3 3-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      </svg>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="zs-footer-col">
              <h4>Company</h4>
              <ul className="zs-footer-links">
                {[
                  { to: '/about', label: 'About ZooSync' },
                  { to: '/contact', label: 'Contact Us' },
                  { to: '/privacy', label: 'Privacy Policy' },
                  { to: '/terms', label: 'Terms of Use' },
                  { to: '/support', label: 'Support' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="zs-footer-link">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{color:'#4a9352', flexShrink:0}}>
                        <path d="M1 4h6M4 1l3 3-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      </svg>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact mini */}
              <h4 style={{marginTop:'1.75rem'}}>Contact</h4>
              <div className="zs-contact-items">
                <div className="zs-contact-item">
                  <svg className="zs-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
                  </svg>
                  +94 78 856 2080
                </div>
                <div className="zs-contact-item">
                  <svg className="zs-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  zoosyncofficial@gmail.com
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="zs-newsletter-col">
              <h4>Newsletter</h4>
              <p className="zs-newsletter-desc">
                Get updates on new features, wildlife stories, and platform announcements.
              </p>
              {subscribed ? (
                <div className="zs-subscribe-success">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  You're subscribed!
                </div>
              ) : (
                <form className="zs-newsletter-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    className="zs-newsletter-input"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="zs-newsletter-btn">Subscribe</button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="zs-footer-bottom">
            <p className="zs-copyright">
              © 2026 ZooSync.LK - Smart Zoo Management System. All rights reserved.
            </p>
            <ul className="zs-footer-bottom-links">
              <li><Link to="/privacy" className="zs-footer-bottom-link">Privacy</Link></li>
              <li><Link to="/terms" className="zs-footer-bottom-link">Terms</Link></li>
              <li><Link to="/sitemap" className="zs-footer-bottom-link">Sitemap</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
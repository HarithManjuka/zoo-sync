import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

/* ─── Helpers ─────────────────────────────────────────────── */
const useCountUp = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, target, duration]);
  return count;
};

const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
};

/* ─── Feature Data ─────────────────────────────────────────── */
const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: 'Animal Management',
    desc: 'Full lifecycle tracking — from intake to health history, species data, weight, diet, and transfer across enclosures.',
    tag: 'Core',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="3" y1="15" x2="21" y2="15"/>
        <line x1="9" y1="3" x2="9" y2="21"/>
        <line x1="15" y1="3" x2="15" y2="21"/>
      </svg>
    ),
    title: 'Enclosure Tracking',
    desc: 'Manage enclosure capacity, environment type, assigned animals, and zookeeper responsibilities in real time.',
    tag: 'Operations',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: 'Veterinary Health Records',
    desc: 'Comprehensive medical history, vaccination tracking, treatment logs, and vet-assigned care plans per animal.',
    tag: 'Health',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    title: 'Inventory Management',
    desc: 'Track food stock, medical supplies, and equipment. Auto-trigger low-stock alerts and manage purchase orders.',
    tag: 'Resources',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V22H4V12"/>
        <path d="M22 7H2v5h20V7z"/>
        <path d="M12 22V7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
    title: 'Ticket Booking',
    desc: 'Online booking portal for visitors — adult, child, and group pricing, event registration, and seat management.',
    tag: 'Visitors',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    title: 'AI Wildlife Assistant',
    desc: 'Integrated chatbot answering visitor queries about animals, zoo routes, events, and species origins in real time.',
    tag: 'AI',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: 'QR Animal Info System',
    desc: 'Every enclosure has a smart QR code — scan to reveal species data, health status, diet, fun facts, and audio clips.',
    tag: 'Innovation',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Staff Scheduling',
    desc: 'Assign zookeepers, schedule feeding tasks, manage cleaning rosters, and track daily activity completion.',
    tag: 'Operations',
  },
];

/* ─── Animal Data ──────────────────────────────────────────── */
const animals = [
  {
    name: 'Sri Lankan Leopard',
    species: 'Panthera pardus kotiya',
    health: 'Excellent',
    habitat: 'Tropical Rainforest',
    feeding: '08:00 & 18:00',
    image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=600&q=80',
    tag: 'Endangered',
    tagColor: '#e74c3c',
  },
  {
    name: 'Asian Elephant',
    species: 'Elephas maximus',
    health: 'Good',
    habitat: 'Savanna & Forest',
    feeding: '07:00, 12:00 & 17:00',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    tag: 'Vulnerable',
    tagColor: '#f39c12',
  },
  {
    name: 'Saltwater Crocodile',
    species: 'Crocodylus porosus',
    health: 'Healthy',
    habitat: 'Wetlands & Estuaries',
    feeding: '10:00 & 16:00',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80',
    tag: 'Stable',
    tagColor: '#27ae60',
  },
];

/* ─── Stats Data ───────────────────────────────────────────── */
const statsData = [
  { label: 'Animals Registered', value: 847, suffix: '+', icon: '🦁' },
  { label: 'Annual Visitors', value: 250000, suffix: '+', icon: '👥' },
  { label: 'Staff Members', value: 124, suffix: '', icon: '👷' },
  { label: 'Enclosures', value: 68, suffix: '', icon: '🏡' },
  { label: 'Daily Activities', value: 320, suffix: '+', icon: '📋' },
];

/* ─── Testimonials ─────────────────────────────────────────── */
const testimonials = [
  {
    name: 'Dr. Amara Perera',
    role: 'Chief Veterinarian, Colombo Zoo',
    text: 'ZooSync has completely transformed how we manage animal health records. Everything from vaccination schedules to treatment logs is now one click away.',
    rating: 5,
  },
  {
    name: 'Kasun Jayawardena',
    role: 'Head Zookeeper',
    text: 'The feeding schedule system and enclosure management features have reduced our daily coordination overhead by at least 60%. Incredibly well built.',
    rating: 5,
  },
  {
    name: 'Nishara Wickramasinghe',
    role: 'Visitor Experience Manager',
    text: 'Our visitors love the QR scanning experience. The ticket booking module has been seamless since day one — no more queues at the gate.',
    rating: 5,
  },
];

/* ═══════════════════════════════════════════════════════════ */
/*  HOMEPAGE COMPONENT                                         */
/* ═══════════════════════════════════════════════════════════ */
const Homepage = () => {
  const [statsRef, statsVisible] = useInView(0.3);
  const [featRef, featVisible] = useInView(0.1);
  const [animalsRef, animalsVisible] = useInView(0.1);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const StatCounter = ({ target, suffix }) => {
    const val = useCountUp(target, 2200, statsVisible);
    return <span>{val.toLocaleString()}{suffix}</span>;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .zs-home {
          font-family: 'DM Sans', sans-serif;
          background: #060d08;
          color: #e8f0ea;
          overflow-x: hidden;
        }

        /* ── HERO ────────────────────────────────────── */
        .zs-hero {
          position: relative;
          height: 100svh;
          min-height: 680px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .zs-hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.45;
          transform: scale(1.05);
          transition: opacity 1.5s ease;
        }

        .zs-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(4, 12, 6, 0.55) 0%,
            rgba(4, 12, 6, 0.35) 40%,
            rgba(4, 12, 6, 0.7) 80%,
            rgba(4, 12, 6, 0.95) 100%
          );
        }

        .zs-hero-radial {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 60% at 50% 45%, rgba(74,147,82,0.08) 0%, transparent 70%);
        }

        .zs-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0 1.5rem;
          max-width: 860px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s ease 0.3s, transform 1s ease 0.3s;
        }

        .zs-hero-content.loaded {
          opacity: 1;
          transform: translateY(0);
        }

        .zs-hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 100px;
          background: rgba(74, 147, 82, 0.12);
          border: 1px solid rgba(74, 147, 82, 0.25);
          color: #8fd49a;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 1.75rem;
          backdrop-filter: blur(8px);
        }

        .zs-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.02em;
          color: #fff;
          margin-bottom: 1.5rem;
        }

        .zs-hero-title em {
          font-style: italic;
          color: #6bc97a;
        }

        .zs-hero-sub {
          font-size: clamp(0.95rem, 1.8vw, 1.1rem);
          color: rgba(255,255,255,0.55);
          line-height: 1.75;
          max-width: 580px;
          margin: 0 auto 2.5rem;
          font-weight: 300;
        }

        .zs-hero-ctas {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .zs-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4a9352, #2d6b35);
          color: #fff;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 24px rgba(74, 147, 82, 0.35);
        }

        .zs-cta-primary:hover {
          background: linear-gradient(135deg, #5aaa63, #3a7d43);
          box-shadow: 0 8px 32px rgba(74, 147, 82, 0.5);
          transform: translateY(-2px);
        }

        .zs-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.85);
          font-size: 0.95rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.25s ease;
        }

        .zs-cta-secondary:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-2px);
        }

        .zs-scroll-indicator {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.45;
          animation: fadeInUp 1s ease 1.2s both;
        }

        .zs-scroll-mouse {
          width: 22px;
          height: 36px;
          border: 1.5px solid rgba(255,255,255,0.5);
          border-radius: 100px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 6px;
        }

        .zs-scroll-dot {
          width: 3px;
          height: 8px;
          background: rgba(255,255,255,0.8);
          border-radius: 100px;
          animation: scrollDot 2s ease infinite;
        }

        .zs-scroll-label {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(6px); opacity: 0.3; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to { opacity: 0.45; transform: translateX(-50%) translateY(0); }
        }

        /* ── SECTION WRAPPER ─────────────────────────── */
        .zs-section {
          padding: 6rem 2rem;
          max-width: 1280px;
          margin: 0 auto;
        }

        .zs-section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #4a9352;
          margin-bottom: 1rem;
        }

        .zs-section-label::before {
          content: '';
          width: 20px;
          height: 1px;
          background: #4a9352;
        }

        .zs-section-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.9rem, 3.5vw, 2.8rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: #f0f5f1;
          margin-bottom: 0.75rem;
        }

        .zs-section-sub {
          color: rgba(255,255,255,0.42);
          font-size: 0.95rem;
          line-height: 1.7;
          max-width: 520px;
        }

        .zs-section-header {
          margin-bottom: 3.5rem;
        }

        /* ── FEATURES ────────────────────────────────── */
        .zs-features-bg {
          background: linear-gradient(180deg, #060d08 0%, #07110a 50%, #060d08 100%);
          position: relative;
        }

        .zs-features-pattern {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 50%, rgba(74,147,82,0.04) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(74,147,82,0.03) 0%, transparent 35%);
          pointer-events: none;
        }

        .zs-feat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5px;
          border: 1.5px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          overflow: hidden;
        }

        .zs-feat-card {
          padding: 2.25rem 2rem;
          background: rgba(10, 22, 13, 0.6);
          border: 1px solid rgba(255,255,255,0.04);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: default;
        }

        .zs-feat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(74,147,82,0.07) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .zs-feat-card:hover {
          background: rgba(15, 32, 18, 0.8);
          transform: translateY(-2px);
        }

        .zs-feat-card:hover::before {
          opacity: 1;
        }

        .zs-feat-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: rgba(74, 147, 82, 0.1);
          border: 1px solid rgba(74, 147, 82, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6bc97a;
          margin-bottom: 1.25rem;
          transition: all 0.3s ease;
        }

        .zs-feat-card:hover .zs-feat-icon {
          background: rgba(74, 147, 82, 0.18);
          box-shadow: 0 0 20px rgba(74, 147, 82, 0.2);
        }

        .zs-feat-tag {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(107,201,122,0.5);
          font-weight: 600;
        }

        .zs-feat-title {
          font-size: 1rem;
          font-weight: 600;
          color: #e8f0ea;
          margin-bottom: 0.6rem;
          letter-spacing: -0.01em;
        }

        .zs-feat-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.65;
        }

        /* ── ANIMALS ─────────────────────────────────── */
        .zs-animals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .zs-animal-card {
          border-radius: 18px;
          overflow: hidden;
          background: #0a1610;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.35s ease;
          cursor: default;
        }

        .zs-animal-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.5);
          border-color: rgba(74,147,82,0.2);
        }

        .zs-animal-img-wrap {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .zs-animal-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .zs-animal-card:hover .zs-animal-img {
          transform: scale(1.08);
        }

        .zs-animal-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(10,22,16,0.9) 100%);
        }

        .zs-animal-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #fff;
        }

        .zs-animal-name-overlay {
          position: absolute;
          bottom: 1rem;
          left: 1.25rem;
          right: 1.25rem;
        }

        .zs-animal-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 2px;
        }

        .zs-animal-species {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.55);
          font-style: italic;
        }

        .zs-animal-stats {
          padding: 1.25rem 1.25rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .zs-astat {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .zs-astat-label {
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-weight: 600;
        }

        .zs-astat-val {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.75);
          font-weight: 400;
        }

        .zs-health-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4a9352;
          margin-right: 5px;
          vertical-align: middle;
        }

        /* ── STATS ───────────────────────────────────── */
        .zs-stats-bg {
          background: linear-gradient(135deg, #071209 0%, #0a1a0d 50%, #071209 100%);
          border-top: 1px solid rgba(74,147,82,0.08);
          border-bottom: 1px solid rgba(74,147,82,0.08);
        }

        .zs-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
        }

        .zs-stat-item {
          padding: 3.5rem 2rem;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.04);
          position: relative;
          transition: background 0.3s ease;
        }

        .zs-stat-item:last-child {
          border-right: none;
        }

        .zs-stat-item:hover {
          background: rgba(74,147,82,0.04);
        }

        .zs-stat-emoji {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          filter: grayscale(0.3);
        }

        .zs-stat-number {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 700;
          color: #e8f0ea;
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .zs-stat-label {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.35);
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        /* ── TESTIMONIALS ────────────────────────────── */
        .zs-testi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .zs-testi-card {
          padding: 2rem;
          border-radius: 16px;
          background: rgba(10, 22, 13, 0.5);
          border: 1px solid rgba(255,255,255,0.06);
          position: relative;
          transition: all 0.3s ease;
        }

        .zs-testi-card:hover {
          border-color: rgba(74,147,82,0.18);
          transform: translateY(-4px);
          background: rgba(14, 28, 17, 0.7);
        }

        .zs-testi-quote {
          font-size: 2.5rem;
          line-height: 1;
          color: rgba(74,147,82,0.2);
          font-family: Georgia, serif;
          margin-bottom: 1rem;
        }

        .zs-testi-text {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.58);
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }

        .zs-testi-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 1rem;
          color: #f4a520;
          font-size: 0.85rem;
        }

        .zs-testi-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .zs-testi-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2d6b35, #4a9352);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }

        .zs-testi-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
        }

        .zs-testi-role {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.35);
        }

        /* ── CTA BANNER ──────────────────────────────── */
        .zs-cta-banner {
          background: linear-gradient(135deg, #0d2010 0%, #142b18 50%, #0d2010 100%);
          border: 1px solid rgba(74,147,82,0.12);
          border-radius: 24px;
          padding: 5rem 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          margin: 0 2rem 6rem;
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
        }

        .zs-cta-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(74,147,82,0.1) 0%, transparent 70%);
        }

        .zs-cta-banner-content {
          position: relative;
          z-index: 1;
        }

        .zs-cta-banner h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 700;
          color: #fff;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .zs-cta-banner p {
          color: rgba(255,255,255,0.48);
          font-size: 1rem;
          margin-bottom: 2.5rem;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        /* ── ANIMATIONS ──────────────────────────────── */
        .zs-fade-in {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .zs-fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .zs-fade-in:nth-child(2) { transition-delay: 0.1s; }
        .zs-fade-in:nth-child(3) { transition-delay: 0.2s; }
        .zs-fade-in:nth-child(4) { transition-delay: 0.3s; }
        .zs-fade-in:nth-child(5) { transition-delay: 0.4s; }
        .zs-fade-in:nth-child(6) { transition-delay: 0.5s; }
        .zs-fade-in:nth-child(7) { transition-delay: 0.6s; }
        .zs-fade-in:nth-child(8) { transition-delay: 0.7s; }

        /* ── DIVIDER ─────────────────────────────────── */
        .zs-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.04);
          margin: 0;
        }

        /* ── RESPONSIVE ──────────────────────────────── */
        @media (max-width: 900px) {
          .zs-stats-grid { grid-template-columns: repeat(3, 1fr); }
          .zs-stat-item:nth-child(3) { border-right: none; }
          .zs-stat-item:nth-child(4) { border-right: 1px solid rgba(255,255,255,0.04); }
          .zs-feat-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .zs-section { padding: 4rem 1.25rem; }
          .zs-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .zs-stat-item { border-right: 1px solid rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.04); }
          .zs-feat-grid { grid-template-columns: 1fr; }
          .zs-animals-grid { grid-template-columns: 1fr; }
          .zs-cta-banner { padding: 3rem 1.5rem; margin: 0 1rem 4rem; }
        }
      `}</style>

      <Navbar />

      <div className="zs-home">
        {/* ═══ HERO ═══════════════════════════════════════════════ */}
        <section className="zs-hero">
          <video
            ref={videoRef}
            className="zs-hero-video"
            src="/assets/zoo-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="zs-hero-overlay" />
          <div className="zs-hero-radial" />

          <div className={`zs-hero-content ${heroLoaded ? 'loaded' : ''}`}>
            <div className="zs-hero-pill">
              <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3.5" fill="#6bc97a"/></svg>
              Now available in Sri Lanka
            </div>

            <h1 className="zs-hero-title">
              Where Wildlife Syncs<br />
              & <em>Zoo Life Flows</em>
            </h1>

            <p className="zs-hero-sub">
              A modern zoo management platform designed to streamline animal care, staff operations, enclosure management, visitor experience, and wildlife health tracking.
            </p>

            <div className="zs-hero-ctas">
              <Link to="/register" className="zs-cta-primary">
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link to="/features" className="zs-cta-secondary">
                Explore Features
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </Link>
            </div>
          </div>

          <div className="zs-scroll-indicator">
            <div className="zs-scroll-mouse">
              <div className="zs-scroll-dot" />
            </div>
            <span className="zs-scroll-label">Scroll</span>
          </div>
        </section>

        {/* ═══ FEATURES ════════════════════════════════════════════ */}
        <div className="zs-features-bg">
          <div className="zs-features-pattern" />
          <div className="zs-section" ref={featRef}>
            <div className="zs-section-header">
              <div className="zs-section-label">Platform Features</div>
              <h2 className="zs-section-heading">Everything your zoo needs,<br />in one place</h2>
              <p className="zs-section-sub">
                Purpose-built modules for every role from veterinarians and zookeepers to inventory managers and visitor experience teams.
              </p>
            </div>

            <div className="zs-feat-grid">
              {features.map((f, i) => (
                <div key={i} className={`zs-feat-card zs-fade-in ${featVisible ? 'visible' : ''}`}>
                  <div className="zs-feat-tag">{f.tag}</div>
                  <div className="zs-feat-icon">{f.icon}</div>
                  <div className="zs-feat-title">{f.title}</div>
                  <p className="zs-feat-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="zs-divider" />

        {/* ═══ ANIMAL SHOWCASE ═════════════════════════════════════ */}
        <div className="zs-section" ref={animalsRef}>
          <div className="zs-section-header">
            <div className="zs-section-label">Animal Showcase</div>
            <h2 className="zs-section-heading">Meet the residents</h2>
            <p className="zs-section-sub">
              Each animal profile is a living record of health data, feeding schedules, habitat notes, and care history all in one dashboard.
            </p>
          </div>

          <div className="zs-animals-grid">
            {animals.map((a, i) => (
              <div key={i} className={`zs-animal-card zs-fade-in ${animalsVisible ? 'visible' : ''}`}>
                <div className="zs-animal-img-wrap">
                  <img src={a.image} alt={a.name} className="zs-animal-img" loading="lazy" />
                  <div className="zs-animal-img-overlay" />
                  <div className="zs-animal-badge" style={{ background: `${a.tagColor}cc` }}>
                    {a.tag}
                  </div>
                  <div className="zs-animal-name-overlay">
                    <div className="zs-animal-name">{a.name}</div>
                    <div className="zs-animal-species">{a.species}</div>
                  </div>
                </div>
                <div className="zs-animal-stats">
                  <div className="zs-astat">
                    <div className="zs-astat-label">Health Status</div>
                    <div className="zs-astat-val">
                      <span className="zs-health-dot" />
                      {a.health}
                    </div>
                  </div>
                  <div className="zs-astat">
                    <div className="zs-astat-label">Habitat</div>
                    <div className="zs-astat-val">{a.habitat}</div>
                  </div>
                  <div className="zs-astat" style={{ gridColumn: '1 / -1' }}>
                    <div className="zs-astat-label">Feeding Schedule</div>
                    <div className="zs-astat-val">{a.feeding}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ STATS ═══════════════════════════════════════════════ */}
        <div className="zs-stats-bg" ref={statsRef}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div className="zs-stats-grid">
              {statsData.map((s, i) => (
                <div key={i} className="zs-stat-item">
                  <div className="zs-stat-emoji">{s.icon}</div>
                  <div className="zs-stat-number">
                    {statsVisible ? <StatCounter target={s.value} suffix={s.suffix} /> : '0'}
                  </div>
                  <div className="zs-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ TESTIMONIALS ════════════════════════════════════════ */}
        <div className="zs-section">
          <div className="zs-section-header">
            <div className="zs-section-label">Testimonials</div>
            <h2 className="zs-section-heading">Trusted by wildlife professionals</h2>
            <p className="zs-section-sub">
              From veterinarians to zookeepers — see how ZooSync has changed daily operations across Sri Lanka's zoos.
            </p>
          </div>

          <div className="zs-testi-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="zs-testi-card">
                <div className="zs-testi-quote">"</div>
                <div className="zs-testi-stars">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="zs-testi-text">{t.text}</p>
                <div className="zs-testi-author">
                  <div className="zs-testi-avatar">
                    {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="zs-testi-name">{t.name}</div>
                    <div className="zs-testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ CTA BANNER ══════════════════════════════════════════ */}
        <div className="zs-cta-banner">
          <div className="zs-cta-banner-content">
            <h2>Ready to modernise your zoo?</h2>
            <p>Join the growing network of zoos and wildlife parks across Sri Lanka using ZooSync every day.</p>
            <div className="zs-hero-ctas">
              <Link to="/register" className="zs-cta-primary">
                Start for Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link to="/contact" className="zs-cta-secondary">Contact Sales</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />

    </>
  );
};

export default Homepage;
import React, { useState, useEffect } from 'react';
import { Menu, X, Cpu, Sparkles, ArrowRight, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeColorSwitcher } from './ThemeColorSwitcher';
import { GithubIcon, LinkedinIcon } from './Icons';
import { BackgroundAnimationMode, ThemeId } from '../types';

interface NavbarProps {
  currentTheme: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  currentAnimation: BackgroundAnimationMode;
  onSelectAnimation: (mode: BackgroundAnimationMode) => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  onSelectTheme,
  currentAnimation,
  onSelectAnimation,
  onReplayIntro,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const navItems = [
    { href: '#about', label: 'About', num: '01' },
    { href: '#skills', label: 'Skills', num: '02' },
    { href: '#projects', label: 'Projects', num: '03' },
    { href: '#sensors-lab', label: 'Sensors Lab', num: '04', badge: '22' },
    { href: '#timeline', label: 'Milestones', num: '05' },
    { href: '#contact', label: 'Contact', num: '06', cta: true },
  ];

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="nav-container">
          <a href="#hero" className="brand-logo" onClick={closeMobile}>
            <span className="logo-box">A</span>
            <span className="logo-text">
              Aariz<span className="accent-dot">.</span>
            </span>
          </a>

          {/* Center / Right Toolbar Controls */}
          <div className="nav-actions-group">
            {/* Theme & 3D Background Animation Switcher */}
            <ThemeColorSwitcher
              currentTheme={currentTheme}
              onSelectTheme={onSelectTheme}
              currentAnimation={currentAnimation}
              onSelectAnimation={onSelectAnimation}
            />

            {onReplayIntro && (
              <button
                className="replay-intro-nav-btn"
                onClick={onReplayIntro}
                title="Replay Fullscreen Typewriter Intro Sequence"
                aria-label="Replay intro"
              >
                <Sparkles size={13} />
                <span>Intro</span>
              </button>
            )}

            <a href="#sensors-lab" className="sensors-nav-badge-link" onClick={closeMobile}>
              <Cpu size={14} />
              <span>Sensors Lab</span>
              <span className="nav-badge-pulse">22</span>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <ul className="nav-links desktop-only" id="navLinks">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`nav-link ${item.cta ? 'cta-link' : ''}`}
                  onClick={closeMobile}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="menu-toggle"
            id="menuToggle"
            aria-label={mobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Enhanced Mobile Drawer Navigation with Slide-in & Glassmorphic Background Blur */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="mobile-nav-root-portal">
            {/* Darkened Backdrop with High-Fidelity Gaussian Blur */}
            <motion.div
              className="mobile-nav-backdrop-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              onClick={closeMobile}
            />

            {/* Slide-in Mobile Drawer */}
            <motion.div
              className="mobile-nav-drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 300,
                mass: 0.85,
              }}
            >
              {/* Drawer Top Header */}
              <div className="mobile-drawer-header">
                <a href="#hero" className="brand-logo" onClick={closeMobile}>
                  <span className="logo-box">A</span>
                  <span className="logo-text">
                    Aariz<span className="accent-dot">.</span>
                  </span>
                </a>
                <button
                  className="mobile-drawer-close-btn"
                  onClick={closeMobile}
                  aria-label="Close navigation"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status Indicator */}
              <div className="mobile-drawer-status">
                <span className="status-dot-pulse" />
                <span>Available for New Roles & Projects</span>
              </div>

              {/* Staggered Links List */}
              <ul className="mobile-drawer-links">
                {navItems.map((item, idx) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.08 + idx * 0.045,
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <a
                      href={item.href}
                      className={`mobile-drawer-link ${item.cta ? 'cta' : ''}`}
                      onClick={closeMobile}
                    >
                      <span className="link-num">{item.num}</span>
                      <span className="link-label">{item.label}</span>
                      {item.badge && (
                        <span className="link-badge">
                          <Cpu size={12} /> {item.badge} Modules
                        </span>
                      )}
                      <ArrowRight size={16} className="link-arrow" />
                    </a>
                  </motion.li>
                ))}
              </ul>

              {/* Drawer Bottom Actions & Socials */}
              <div className="mobile-drawer-footer">
                {onReplayIntro && (
                  <button
                    className="mobile-drawer-intro-replay"
                    onClick={() => {
                      closeMobile();
                      onReplayIntro();
                    }}
                  >
                    <Sparkles size={15} />
                    <span>Replay Fullscreen Intro Sequence</span>
                  </button>
                )}

                <div className="mobile-drawer-socials">
                  <a
                    href="https://github.com/aarizzzcodes"
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon-btn"
                    title="GitHub"
                  >
                    <GithubIcon size={18} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sheik-ali-aariz-315261353?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon-btn"
                    title="LinkedIn"
                  >
                    <LinkedinIcon size={18} />
                  </a>
                  <a
                    href="mailto:asheikQBTECH26@stu.alliance.edu.in"
                    className="social-icon-btn"
                    title="Email"
                  >
                    <Mail size={18} />
                  </a>
                </div>

                <p className="mobile-drawer-copyright">
                  &copy; {new Date().getFullYear()} Aariz. All rights reserved.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

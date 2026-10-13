import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
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

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <a href="#hero" className="brand-logo" onClick={closeMobile}>
          <span className="logo-box">A</span>
          <span className="logo-text">
            Aariz<span className="accent-dot">.</span>
          </span>
        </a>

        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`} id="navLinks">
          <li>
            <a href="#about" className="nav-link" onClick={closeMobile}>
              About
            </a>
          </li>
          <li>
            <a href="#skills" className="nav-link" onClick={closeMobile}>
              Skills
            </a>
          </li>
          <li>
            <a href="#projects" className="nav-link" onClick={closeMobile}>
              Projects
            </a>
          </li>
          <li>
            <a href="#timeline" className="nav-link" onClick={closeMobile}>
              Milestones
            </a>
          </li>
          <li>
            <a href="#contact" className="nav-btn" onClick={closeMobile}>
              Get In Touch
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          id="mobileToggle"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

import React from 'react';
import { ChevronUp, Mail, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { DotMatrixBrand } from './DotMatrixBrand';
import { ScrollReveal } from './ScrollReveal';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-inner-container">
        {/* Main Footer Card with Watermark Dot-Matrix AARIZ Embedded in Background */}
        <ScrollReveal direction="up" distance={25} threshold={0.08}>
          <div className="footer-content-card">
            {/* 1. Subtle, Low-Contrast Dot-Matrix Watermark (Matching Wafer Reference 2) */}
            <DotMatrixBrand text="AARIZ" watermark={true} />

            {/* 2. Foreground Content Grid (Z-Index: 10, Intact Pointer Events) */}
            <div className="footer-top-grid">
              {/* Col 1: Identity & Bio */}
              <div className="footer-col footer-col-brand">
                <a href="#hero" className="footer-brand-logo">
                  <span className="logo-box">A</span>
                  <span className="logo-text">
                    Aariz<span className="accent-dot">.</span>
                  </span>
                </a>
                <p className="footer-brand-tagline">
                  Software Engineer specializing in scalable full-stack web architectures, IoT sensor telemetry systems, and interactive experiences.
                </p>
                <div className="footer-availability-chip">
                  <span className="availability-dot" />
                  <span>Available for engineering ventures & roles</span>
                </div>
              </div>

              {/* Col 2: Navigation Links */}
              <div className="footer-col footer-col-links">
                <h4 className="footer-col-title">Navigation</h4>
                <ul className="footer-nav-list">
                  <li>
                    <a href="#about" className="footer-nav-link">About & Story</a>
                  </li>
                  <li>
                    <a href="#skills" className="footer-nav-link">Technical Stack</a>
                  </li>
                  <li>
                    <a href="#projects" className="footer-nav-link">Featured Projects</a>
                  </li>
                  <li>
                    <a href="#gallery" className="footer-nav-link">Hardware Photo Gallery</a>
                  </li>
                  <li>
                    <a href="#sensors-lab" className="footer-nav-link">22-Sensor Hardware Lab</a>
                  </li>
                  <li>
                    <a href="#timeline" className="footer-nav-link">Experience & Milestones</a>
                  </li>
                  <li>
                    <a href="#contact" className="footer-nav-link">Get In Touch</a>
                  </li>
                </ul>
              </div>

              {/* Col 3: Social & Connect */}
              <div className="footer-col footer-col-connect">
                <h4 className="footer-col-title">Connect</h4>
                <div className="footer-social-links-grid">
                  <a
                    href="https://github.com/aarizzzcodes"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-card"
                    title="GitHub @aarizzzcodes"
                  >
                    <div className="social-card-icon">
                      <GithubIcon size={18} />
                    </div>
                    <div className="social-card-text">
                      <span className="social-platform">GitHub</span>
                      <span className="social-handle">@aarizzzcodes</span>
                    </div>
                    <ArrowUpRight size={14} className="social-arrow" />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/sheik-ali-aariz-315261353?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-card"
                    title="LinkedIn Sheik Ali Aariz"
                  >
                    <div className="social-card-icon">
                      <LinkedinIcon size={18} />
                    </div>
                    <div className="social-card-text">
                      <span className="social-platform">LinkedIn</span>
                      <span className="social-handle">Sheik Ali Aariz</span>
                    </div>
                    <ArrowUpRight size={14} className="social-arrow" />
                  </a>

                  <a
                    href="mailto:asheikQBTECH26@stu.alliance.edu.in"
                    className="footer-social-card"
                    title="Email Aariz"
                  >
                    <div className="social-card-icon">
                      <Mail size={18} />
                    </div>
                    <div className="social-card-text">
                      <span className="social-platform">Direct Email</span>
                      <span className="social-handle">asheikQBTECH26@stu...</span>
                    </div>
                    <ArrowUpRight size={14} className="social-arrow" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom Bar: Copyright & Back To Top */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            &copy; {currentYear} <span className="highlight-name">Sheik Ali Aariz</span>. All rights reserved.
          </p>
          <p className="footer-craft-text">
            Crafted with React, TypeScript, Three.js & Tailwind
          </p>
          <a href="#hero" className="footer-back-to-top" title="Back to top">
            <span>Top</span>
            <ChevronUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

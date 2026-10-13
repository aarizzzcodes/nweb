import React from 'react';
import { ChevronUp, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { ScrollReveal } from './ScrollReveal';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <ScrollReveal direction="up" distance={15} threshold={0.05}>
      <footer className="footer">
        <p>
          &copy; <span id="currentYear">{currentYear}</span> Aariz. Crafted with precision & code.
        </p>

        <div className="footer-socials" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a
            href="https://github.com/aarizzzcodes"
            target="_blank"
            rel="noreferrer"
            className="icon-btn"
            title="GitHub (aarizzzcodes)"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/sheik-ali-aariz-315261353?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
            target="_blank"
            rel="noreferrer"
            className="icon-btn"
            title="LinkedIn (Sheik Ali Aariz)"
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href="mailto:asheikQBTECH26@stu.alliance.edu.in"
            className="icon-btn"
            title="Email (asheikQBTECH26@stu.alliance.edu.in)"
          >
            <Mail size={18} />
          </a>
        </div>

        <a href="#hero" className="back-to-top" title="Back to top">
          <ChevronUp size={20} />
        </a>
      </footer>
    </ScrollReveal>
  );
};

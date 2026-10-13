import React from 'react';
import { ChevronUp } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <ScrollReveal direction="up" distance={15} threshold={0.05}>
      <footer className="footer">
        <p>
          &copy; <span id="currentYear">{currentYear}</span> Aariz. Crafted with precision & code.
        </p>
        <a href="#hero" className="back-to-top" title="Back to top">
          <ChevronUp size={20} />
        </a>
      </footer>
    </ScrollReveal>
  );
};

import React, { useState, useEffect } from 'react';
import { ArrowRight, Copy, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon } from './Icons';

interface HeroProps {
  onCopyEmail: (email: string) => void;
}

const TYPEWRITER_PHRASES = [
  'Scalable Web Architectures.',
  'Hardware IoT Telemetry Systems.',
  'Distributed High-Performance Code.',
  'Creative Interactive Experiences.',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const Hero: React.FC<HeroProps> = ({ onCopyEmail }) => {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
    let timeout: number;

    if (!isDeleting) {
      if (charIndex < currentPhrase.length) {
        timeout = window.setTimeout(() => {
          setDisplayText(currentPhrase.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 70);
      } else {
        timeout = window.setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (charIndex > 0) {
        timeout = window.setTimeout(() => {
          setDisplayText(currentPhrase.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 35);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
        timeout = window.setTimeout(() => {}, 400);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <section className="hero-section" id="hero">
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={itemVariants} className="status-pill">
          <span className="pulse-dot" />
          <span>Available for New Ventures & Engineering Roles</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="hero-title">
          Hey, I'm <span className="gradient-text">Aariz</span>.
        </motion.h1>

        <motion.p variants={itemVariants} className="hero-subtitle">
          I build <span className="typewriter-text">{displayText}</span>
          <span className="cursor-blink">|</span>
        </motion.p>

        <motion.p variants={itemVariants} className="hero-description">
          A passionate software engineer specializing in scalable full-stack applications, intelligent IoT systems, and high-performance algorithms. Turning ideas into elegant code.
        </motion.p>

        <motion.div variants={itemVariants} className="hero-actions">
          <a href="#projects" className="btn btn-primary">
            Explore Work <ArrowRight size={18} />
          </a>
          <button
            className="btn btn-secondary"
            id="copyEmailBtn"
            onClick={() => onCopyEmail('aariz@example.com')}
          >
            <Copy size={18} /> Copy Email
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="social-links">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="social-link"
            title="GitHub"
          >
            <GithubIcon size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="social-link"
            title="LinkedIn"
          >
            <LinkedinIcon size={20} />
          </a>
          <a
            href="mailto:aariz@example.com"
            className="social-link"
            title="Email Aariz"
          >
            <Mail size={20} />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

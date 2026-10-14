import React, { useEffect, useState } from 'react';
import { ArrowDown, Copy, ArrowRight, Sparkles, Terminal, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon } from './Icons';
import { OrganicAmberOrb } from './OrganicAmberOrb';
import { useTextScramble } from '../hooks/useTextScramble';

/**
 * =========================================================================
 * HERO CUSTOMIZATION CONFIGURATION
 * Edit the values below to customize the headline text, scramble characters,
 * timing, badge label, subtitle, and corner metadata.
 * =========================================================================
 */
export const HERO_CONFIG = {
  // Primary headline (2 lines like in the reference video: "BETWEEN AI" / "AND HUMANS")
  headlineLine1: 'BETWEEN CODE',
  headlineLine2: 'AND REALITY',

  // Top badge text & category
  badgeText: 'FULL-STACK SYSTEMS & HARDWARE LAB',

  // Subtitle (Japanese minimal accent + English narrative)
  subtitleJapanese: 'アイデアを洗練されたコードと電子工作へ',
  subtitleEnglish: 'Engineering scalable web architectures, IoT sensor telemetry, and high-performance algorithms.',

  // Corner metadata tags
  locationTag: 'BENGALURU, 2026',
  explorePrompt: 'SCROLL TO EXPLORE ↓',

  // Scramble animation speed (in ms per shuffle) and reveal delay
  scrambleSpeed: 28,
  scrambleDelayLine1: 150,
  scrambleDelayLine2: 380,
};

interface HeroProps {
  onCopyEmail: (email: string) => void;
  // Triggered when the intro sequence upward wipe starts revealing the page
  introFinished?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onCopyEmail,
  introFinished = true,
}) => {
  // Scramble hooks for Line 1 and Line 2
  const {
    displayText: line1Text,
    trigger: triggerLine1,
    isScrambling: isLine1Scrambling,
  } = useTextScramble(HERO_CONFIG.headlineLine1, {
    speed: HERO_CONFIG.scrambleSpeed,
    revealDelay: HERO_CONFIG.scrambleDelayLine1,
  });

  const {
    displayText: line2Text,
    trigger: triggerLine2,
    isScrambling: isLine2Scrambling,
  } = useTextScramble(HERO_CONFIG.headlineLine2, {
    speed: HERO_CONFIG.scrambleSpeed,
    revealDelay: HERO_CONFIG.scrambleDelayLine2,
  });

  // Trigger text scramble as soon as the intro overlay wipes upward
  useEffect(() => {
    if (introFinished) {
      triggerLine1();
      triggerLine2();
    }
  }, [introFinished, triggerLine1, triggerLine2]);

  const handleManualReScramble = () => {
    triggerLine1();
    triggerLine2();
  };

  return (
    <section className="hero-reference-container" id="hero">
      {/* 3D Organic Amber Orb with Inner Cavity sits directly behind the headline */}
      <OrganicAmberOrb className="hero-orb-backdrop" />

      {/* Hero Foreground Content */}
      <div className="hero-reference-content">
        {/* Top Minimal Badge / Geometric Emblem */}
        <motion.div
          className="hero-reference-badge"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="hero-emblem-ring">
            <svg viewBox="0 0 24 24" fill="none" className="emblem-svg" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="1.2" />
              <polygon points="12,5 18,17 6,17" strokeWidth="1.2" />
              <circle cx="12" cy="13" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <span className="hero-badge-label">{HERO_CONFIG.badgeText}</span>
        </motion.div>

        {/* Central Scrambling Headline */}
        <motion.div
          className="hero-headline-wrapper"
          onClick={handleManualReScramble}
          title="Click to re-scramble headline"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <h1 className="hero-reference-title">
            <span className="title-line line-1">
              {line1Text}
            </span>
            <span className="title-line line-2">
              {line2Text}
            </span>
          </h1>
        </motion.div>

        {/* Japanese Accent & English Narrative Subtitle */}
        <motion.div
          className="hero-reference-subtitle-box"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <p className="subtitle-japanese">{HERO_CONFIG.subtitleJapanese}</p>
          <p className="subtitle-english">{HERO_CONFIG.subtitleEnglish}</p>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          className="hero-reference-actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <a href="#projects" className="btn btn-primary hero-cta-btn">
            Explore Portfolio <ArrowRight size={17} />
          </a>
          <a href="#sensors-lab" className="btn btn-secondary hero-cta-btn">
            <Sparkles size={16} /> Sensors Lab (22 Modules)
          </a>
          <button
            className="btn btn-secondary hero-cta-btn"
            onClick={() => onCopyEmail('asheikQBTECH26@stu.alliance.edu.in')}
            title="Copy email to clipboard"
          >
            <Copy size={16} /> Copy Email
          </button>
        </motion.div>
      </div>

      {/* Corner Minimal Metadata Tags (matching 0:01 - 0:13 in reference video) */}
      <div className="hero-corner-meta left-corner">
        <span className="meta-pulse-dot" />
        <span className="meta-text">{HERO_CONFIG.locationTag}</span>
      </div>

      <a href="#about" className="hero-corner-meta right-corner" title="Scroll down to explore">
        <span className="meta-text">{HERO_CONFIG.explorePrompt}</span>
      </a>
    </section>
  );
};

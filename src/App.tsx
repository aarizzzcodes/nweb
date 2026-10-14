import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { ThreeBackground } from './components/ThreeBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Timeline } from './components/Timeline';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { FloatingBackToTop } from './components/FloatingBackToTop';
import { IntroSequence } from './components/IntroSequence';
import { useLenisScroll } from './hooks/useLenisScroll';
import { THEMES, applyThemeToCSS } from './utils/theme';
import { BackgroundAnimationMode, ThemeId } from './types';

const THEME_STORAGE_KEY = 'aariz_portfolio_theme';
const ANIM_STORAGE_KEY = 'aariz_portfolio_animation';

import { SectionDivider } from './components/SectionDivider';

export const App: React.FC = () => {
  // Smooth inertia scrolling via Lenis (matching 0:13 - 0:25 reference video behavior)
  useLenisScroll();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  // Fullscreen Typewriter Intro Sequence State
  const [showIntro, setShowIntro] = useState(true);
  const [introFinished, setIntroFinished] = useState(false);

  // Theme selection state with localStorage memory
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
      return saved && THEMES[saved] ? saved : 'cyan';
    } catch {
      return 'cyan';
    }
  });

  // Background animation mode state with localStorage memory (default 'circuit' for 3D Holographic Quantum Core wow factor)
  const [currentAnimation, setCurrentAnimation] = useState<BackgroundAnimationMode>(() => {
    try {
      const saved = localStorage.getItem(ANIM_STORAGE_KEY) as BackgroundAnimationMode;
      return saved || 'circuit';
    } catch {
      return 'circuit';
    }
  });

  // Sync theme variables into root CSS
  useEffect(() => {
    applyThemeToCSS(THEMES[currentTheme]);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch {}
  }, [currentTheme]);

  // Sync animation mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ANIM_STORAGE_KEY, currentAnimation);
    } catch {}
  }, [currentAnimation]);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const handleCopyEmail = useCallback(
    (email: string) => {
      navigator.clipboard
        .writeText(email)
        .then(() => {
          showToast("✓ Aariz's email copied to clipboard!");
        })
        .catch(() => {
          showToast(`✓ Aariz's email: ${email}`);
        });
    },
    [showToast]
  );

  const handleIntroComplete = useCallback(() => {
    setIntroFinished(true);
  }, []);

  const handleReplayIntro = useCallback(() => {
    setIntroFinished(false);
    setShowIntro(false);
    setTimeout(() => {
      setShowIntro(true);
    }, 50);
  }, []);

  return (
    <>
      {/* 1. Fullscreen Typewriter Intro Sequence (0:02 - 0:05 in reference video) */}
      {showIntro && (
        <IntroSequence onComplete={handleIntroComplete} />
      )}

      {/* Custom Glowing Cursor */}
      <CustomCursor />

      {/* 3D WebGL Background Animation with High-Impact Wow Factor */}
      <ThreeBackground
        mode={currentAnimation}
        theme={THEMES[currentTheme]}
      />

      {/* Navigation Bar with Theme & Background Switcher + Replay Intro */}
      <Navbar
        currentTheme={currentTheme}
        onSelectTheme={(t) => {
          setCurrentTheme(t);
          showToast(`Switched theme to ${THEMES[t].name}`);
        }}
        currentAnimation={currentAnimation}
        onSelectAnimation={(a) => {
          setCurrentAnimation(a);
          showToast(`3D Background: ${a}`);
        }}
        onReplayIntro={handleReplayIntro}
      />

      {/* Main Content Container with Smooth Scroll Flow */}
      <main>
        {/* 2 & 3. Hero Reveal with Matrix Text Scramble & 3D Organic Amber Orb */}
        <Hero
          onCopyEmail={handleCopyEmail}
          introFinished={introFinished}
        />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Timeline />
        <SectionDivider />
        <Contact onShowToast={showToast} />
      </main>

      {/* Footer with Massive Dot-Matrix Typography */}
      <Footer />

      {/* Floating Back To Top Button */}
      <FloatingBackToTop />

      {/* Toast Notification element */}
      <Toast message={toastMessage} />
    </>
  );
};

export default App;

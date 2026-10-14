import React, { useState, useEffect, useRef } from 'react';

/**
 * =========================================================================
 * INTRO SEQUENCE CUSTOMIZATION CONFIGURATION
 * Edit the values below to customize the intro typewriter text,
 * typing speed, pause duration, and overlay upward wipe timing.
 * =========================================================================
 */
export const INTRO_CONFIG = {
  // Line 1 and Line 2 text strings
  greeting: 'Hello,',
  brandName: "I'm Aariz", // Customize: "I'm AI COMMON", "I'm Aariz. Engineer & Builder", etc.
  
  // Speed of typewriter in milliseconds per character
  typeSpeed: 60,

  // Pause duration after typing completes before upward wipe starts (in ms)
  pauseBeforeExit: 550,

  // Duration of upward curtain wipe transition (in ms)
  wipeDuration: 950,
};

interface IntroSequenceProps {
  onComplete: () => void;
  // Optional override for custom text
  customGreeting?: string;
  customBrandName?: string;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({
  onComplete,
  customGreeting = INTRO_CONFIG.greeting,
  customBrandName = INTRO_CONFIG.brandName,
}) => {
  const [displayTextLine1, setDisplayTextLine1] = useState('');
  const [displayTextLine2, setDisplayTextLine2] = useState('');
  const [phase, setPhase] = useState<'typing1' | 'typing2' | 'paused' | 'exiting' | 'finished'>('typing1');
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 450);
    return () => clearInterval(blinkInterval);
  }, []);

  // Typewriter sequence
  useEffect(() => {
    let timeoutId: number;

    if (phase === 'typing1') {
      if (displayTextLine1.length < customGreeting.length) {
        timeoutId = window.setTimeout(() => {
          setDisplayTextLine1(customGreeting.slice(0, displayTextLine1.length + 1));
        }, INTRO_CONFIG.typeSpeed);
      } else {
        timeoutId = window.setTimeout(() => {
          setPhase('typing2');
        }, 180);
      }
    } else if (phase === 'typing2') {
      if (displayTextLine2.length < customBrandName.length) {
        timeoutId = window.setTimeout(() => {
          setDisplayTextLine2(customBrandName.slice(0, displayTextLine2.length + 1));
        }, INTRO_CONFIG.typeSpeed);
      } else {
        timeoutId = window.setTimeout(() => {
          setPhase('paused');
        }, INTRO_CONFIG.pauseBeforeExit);
      }
    } else if (phase === 'paused') {
      timeoutId = window.setTimeout(() => {
        setPhase('exiting');
        // Notify parent slightly before or at wipe end to trigger hero scramble
        setTimeout(() => {
          onComplete();
        }, Math.floor(INTRO_CONFIG.wipeDuration * 0.45));

        setTimeout(() => {
          setPhase('finished');
        }, INTRO_CONFIG.wipeDuration);
      }, 100);
    }

    return () => clearTimeout(timeoutId);
  }, [phase, displayTextLine1, displayTextLine2, customGreeting, customBrandName, onComplete]);

  // Handle skip with Escape or Click
  const handleSkip = () => {
    setPhase('exiting');
    onComplete();
    setTimeout(() => {
      setPhase('finished');
    }, 400);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase !== 'finished') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  if (phase === 'finished') return null;

  return (
    <div
      className={`intro-sequence-overlay ${phase === 'exiting' ? 'wiping-up' : ''}`}
      onClick={handleSkip}
      title="Click or press Esc to skip intro"
    >
      <div className={`intro-text-center ${phase === 'exiting' ? 'fade-out' : ''}`}>
        <p className="intro-line line-1">{displayTextLine1}</p>
        <p className="intro-line line-2">
          {displayTextLine2}
          {phase !== 'paused' && phase !== 'exiting' && (
            <span className={`intro-cursor ${cursorVisible ? 'visible' : ''}`}>|</span>
          )}
        </p>
      </div>

      <div className="intro-skip-hint">
        <span>Click anywhere to skip</span>
      </div>
    </div>
  );
};

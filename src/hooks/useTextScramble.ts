import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * =========================================================================
 * CUSTOMIZATION OPTIONS FOR TEXT SCRAMBLE:
 * - chars: Characters used during the glitch / decode scramble animation.
 * - speed: Frame rate speed (in ms) between character shuffles.
 * - duration: How many steps each character scrambles before locking.
 * =========================================================================
 */
const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>[]{}~+=-_';

interface UseTextScrambleOptions {
  chars?: string;
  speed?: number; // lower = faster cycling (e.g. 25-40ms)
  revealDelay?: number; // delay before locking starts
}

export function useTextScramble(targetText: string, options: UseTextScrambleOptions = {}) {
  const {
    chars = DEFAULT_CHARS,
    speed = 30,
    revealDelay = 200,
  } = options;

  const [displayText, setDisplayText] = useState(targetText);
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef<number | null>(null);

  const trigger = useCallback(() => {
    setIsScrambling(true);
    const length = targetText.length;
    let iteration = 0;
    const startTime = Date.now();

    const update = () => {
      const elapsed = Date.now() - startTime;
      
      // Calculate how many characters are locked in based on elapsed time
      const lockThreshold = Math.max(0, Math.floor((elapsed - revealDelay) / 45));

      const scrambled = targetText
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === '\n') return char;
          if (index < lockThreshold) {
            return targetText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      setDisplayText(scrambled);

      if (lockThreshold >= length) {
        setDisplayText(targetText);
        setIsScrambling(false);
      } else {
        frameRef.current = window.setTimeout(update, speed);
      }
    };

    update();
  }, [targetText, chars, speed, revealDelay]);

  useEffect(() => {
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, []);

  return { displayText, trigger, isScrambling };
}

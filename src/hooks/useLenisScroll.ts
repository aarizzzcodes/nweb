import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * =========================================================================
 * SMOOTH INERTIA SCROLL (LENIS) HOOK
 * Provides smooth momentum scrolling with zero stutter or layout shift
 * matching the 0:13 - 0:25 page scroll behavior from the reference video.
 * =========================================================================
 */
export function useLenisScroll() {
  useEffect(() => {
    // Initialize Lenis with optimized inertia parameters
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Make lenis accessible globally if needed
    (window as any).__lenis = lenis;

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);
}

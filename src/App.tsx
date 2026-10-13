import React, { useState, useCallback, useRef } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { ConstellationCanvas } from './components/ConstellationCanvas';
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

export const App: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

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

  return (
    <>
      {/* Custom Glowing Cursor */}
      <CustomCursor />

      {/* Background Particle Constellation Canvas & Glows */}
      <ConstellationCanvas />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Container */}
      <main>
        <Hero onCopyEmail={handleCopyEmail} />
        <About />
        <Skills />
        <Projects />
        <Timeline />
        <Contact onShowToast={showToast} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Back To Top Button */}
      <FloatingBackToTop />

      {/* Toast Notification element */}
      <Toast message={toastMessage} />
    </>
  );
};

export default App;

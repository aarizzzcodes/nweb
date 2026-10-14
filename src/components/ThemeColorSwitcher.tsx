import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Zap,
  Activity,
  Compass,
  Check,
  ChevronDown,
  X,
  Box,
  Radio,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from '../utils/theme';
import { BackgroundAnimationMode, ThemeId } from '../types';

interface ThemeColorSwitcherProps {
  currentTheme: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  currentAnimation: BackgroundAnimationMode;
  onSelectAnimation: (mode: BackgroundAnimationMode) => void;
}

export const ThemeColorSwitcher: React.FC<ThemeColorSwitcherProps> = ({
  currentTheme,
  onSelectTheme,
  currentAnimation,
  onSelectAnimation,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const themesList = Object.values(THEMES);

  const animationsList: { id: BackgroundAnimationMode; label: string; desc: string; icon: any; wow?: boolean }[] = [
    {
      id: 'circuit',
      label: '3D Holographic Quantum Core',
      desc: 'Orbital gimbal rings & 3D geodesic lattice with mouse parallax',
      icon: Box,
      wow: true,
    },
    {
      id: 'warp',
      label: '3D Hyper-Warp Starstream',
      desc: 'Cosmic relativistic warp flight at speed of light',
      icon: Compass,
      wow: true,
    },
    {
      id: 'constellation',
      label: '3D Neural Starfield',
      desc: 'Luminous particle galaxy drifting with depth fog',
      icon: Sparkles,
    },
    {
      id: 'waves',
      label: '3D Cyber Horizon Grid',
      desc: 'Holographic perspective grid with glowing telemetry nodes',
      icon: Activity,
    },
  ];

  return (
    <div className="theme-switcher-container">
      {/* Floating Toggle Pill */}
      <button
        className="theme-switcher-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Customize Theme Colors & 3D Background Animations"
        aria-label="Theme & Animation Switcher"
      >
        <span
          className="theme-indicator-dot"
          style={{ backgroundColor: THEMES[currentTheme]?.previewColor || '#00f2fe' }}
        />
        <Palette size={16} />
        <span className="theme-toggle-label">{THEMES[currentTheme]?.name || 'Theme'}</span>
        <ChevronDown size={14} className={`toggle-chevron ${isOpen ? 'rotated' : ''}`} />
      </button>

      {/* Dropdown Customizer Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="theme-panel-backdrop" onClick={() => setIsOpen(false)} />
            <motion.div
              className="theme-panel-modal"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="theme-panel-header">
                <div className="header-left">
                  <Palette size={18} className="panel-title-icon" />
                  <h4>Style & 3D Atmosphere</h4>
                </div>
                <button
                  className="close-panel-btn"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close theme panel"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Theme Colors Grid */}
              <div className="theme-section">
                <label className="theme-section-label">Cybernetic Color Palette</label>
                <div className="themes-palette-grid">
                  {themesList.map((t) => {
                    const isSelected = t.id === currentTheme;
                    return (
                      <button
                        key={t.id}
                        className={`theme-option-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => onSelectTheme(t.id)}
                      >
                        <span
                          className="swatch-circle"
                          style={{
                            background: `linear-gradient(135deg, ${t.accentCyan}, ${t.accentViolet})`,
                            boxShadow: isSelected ? `0 0 14px ${t.previewColor}` : 'none',
                          }}
                        >
                          {isSelected && <Check size={12} color="#07090e" strokeWidth={3} />}
                        </span>
                        <div className="theme-text">
                          <span className="theme-name">{t.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background Animations Selector */}
              <div className="theme-section">
                <div className="section-label-row">
                  <label className="theme-section-label">3D Background Animation (Wow Factor)</label>
                  <span className="gpu-badge">GPU Accelerated</span>
                </div>
                <div className="animation-options-list">
                  {animationsList.map((anim) => {
                    const isSelected = anim.id === currentAnimation;
                    const IconComponent = anim.icon;
                    return (
                      <button
                        key={anim.id}
                        className={`anim-option-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => onSelectAnimation(anim.id)}
                      >
                        <div className="anim-icon-box">
                          <IconComponent size={16} />
                        </div>
                        <div className="anim-info">
                          <div className="anim-title-line">
                            <span className="anim-label">{anim.label}</span>
                            {anim.wow && <span className="wow-badge">WOW FX</span>}
                          </div>
                          <span className="anim-desc">{anim.desc}</span>
                        </div>
                        {isSelected && <Check size={16} className="anim-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="theme-panel-footer-note">
                <Radio size={13} color="var(--accent-cyan)" />
                <span>Responsive to mouse velocity & real-time telemetry</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

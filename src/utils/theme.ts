import { ThemeConfig, ThemeId } from '../types';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  cyan: {
    id: 'cyan',
    name: 'Cyber Cyan',
    tagline: 'Futuristic telemetry & electric blue glow',
    previewColor: '#00f2fe',
    accentCyan: '#00f2fe',
    accentViolet: '#8a2be2',
    accentEmerald: '#10b981',
    accentGradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 50%, #8a2be2 100%)',
    bgDeep: '#07090e',
    borderGlow: 'rgba(0, 242, 254, 0.4)',
  },
  emerald: {
    id: 'emerald',
    name: 'Matrix Emerald',
    tagline: 'High-tech terminal green & bio-luminescence',
    previewColor: '#10b981',
    accentCyan: '#10b981',
    accentViolet: '#059669',
    accentEmerald: '#34d399',
    accentGradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #022c22 100%)',
    bgDeep: '#050c08',
    borderGlow: 'rgba(16, 185, 129, 0.45)',
  },
  violet: {
    id: 'violet',
    name: 'Quantum Violet',
    tagline: 'Deep neon amethyst & cosmic purple radiance',
    previewColor: '#a855f7',
    accentCyan: '#c084fc',
    accentViolet: '#7e22ce',
    accentEmerald: '#ec4899',
    accentGradient: 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #3b0764 100%)',
    bgDeep: '#0c0714',
    borderGlow: 'rgba(192, 132, 252, 0.45)',
  },
  amber: {
    id: 'amber',
    name: 'Solar Amber',
    tagline: 'Warm plasma gold & cybernetic industrial glow',
    previewColor: '#f59e0b',
    accentCyan: '#fbbf24',
    accentViolet: '#d97706',
    accentEmerald: '#10b981',
    accentGradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #b45309 100%)',
    bgDeep: '#0e0b06',
    borderGlow: 'rgba(251, 191, 36, 0.45)',
  },
  crimson: {
    id: 'crimson',
    name: 'Neon Crimson',
    tagline: 'High-alert synthwave red & fiery energy pulse',
    previewColor: '#ff0055',
    accentCyan: '#ff0055',
    accentViolet: '#ff5500',
    accentEmerald: '#ec4899',
    accentGradient: 'linear-gradient(135deg, #ff0055 0%, #ff3366 50%, #7f002b 100%)',
    bgDeep: '#0f0609',
    borderGlow: 'rgba(255, 0, 85, 0.45)',
  },
  midnight: {
    id: 'midnight',
    name: 'Stealth Sapphire',
    tagline: 'Deep oceanic abyss & precision ice indigo',
    previewColor: '#38bdf8',
    accentCyan: '#38bdf8',
    accentViolet: '#6366f1',
    accentEmerald: '#06b6d4',
    accentGradient: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #1e1b4b 100%)',
    bgDeep: '#050811',
    borderGlow: 'rgba(56, 189, 248, 0.45)',
  },
};

export const applyThemeToCSS = (theme: ThemeConfig) => {
  const root = document.documentElement;
  root.style.setProperty('--accent-cyan', theme.accentCyan);
  root.style.setProperty('--accent-violet', theme.accentViolet);
  root.style.setProperty('--accent-emerald', theme.accentEmerald);
  root.style.setProperty('--accent-gradient', theme.accentGradient);
  root.style.setProperty('--bg-deep', theme.bgDeep);
  root.style.setProperty('--border-glow', theme.borderGlow);
  root.setAttribute('data-theme', theme.id);
};

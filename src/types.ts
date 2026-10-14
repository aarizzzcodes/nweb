export type ProjectCategory = 'all' | 'sensors' | 'web' | 'iot' | 'systems';

export interface Project {
  id: string;
  category: 'web' | 'iot' | 'systems';
  categoryLabel: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  demoUrl: string;
}

export type SensorCategory =
  | 'all'
  | 'environmental'
  | 'motion'
  | 'acoustic'
  | 'optical'
  | 'physical'
  | 'magnetic'
  | 'electrical';

export interface SensorPin {
  name: string;
  type: 'Power' | 'Ground' | 'Digital' | 'Analog' | 'I2C' | 'Signal';
  description: string;
}

export interface SensorItem {
  id: string;
  name: string;
  model: string;
  category: SensorCategory;
  categoryLabel: string;
  voltage: string;
  interfaceType: string;
  workingPrinciple: string;
  summary: string;
  pins: SensorPin[];
  applications: string[];
  codeSnippet: string;
  recommendedPhoto: string;
  recommendedPhoto2?: string;
  userUploadedFilename1?: string;
  userUploadedFilename2?: string;
  photos?: string[];
  recommendedVideo: string;
  simulation?: {
    type: 'slider' | 'toggle' | 'trigger';
    label: string;
    unit?: string;
    min?: number;
    max?: number;
    initialValue?: number | boolean;
    formatValue?: (val: number | boolean) => string;
  };
}

export interface SkillCategory {
  title: string;
  description: string;
  iconName: 'code-2' | 'layout' | 'server' | 'cpu';
  tags: string[];
}

export interface Milestone {
  period: string;
  title: string;
  description: string;
}

export type ThemeId =
  | 'cyan'       // Cyber Cyan (Original default)
  | 'emerald'    // Matrix / Emerald Green
  | 'violet'     // Quantum Violet / Neon Purple
  | 'amber'      // Solar Flare / Amber Gold
  | 'crimson'    // Synthwave / Neon Crimson
  | 'midnight';  // Stealth Midnight Sapphire

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  previewColor: string;
  accentCyan: string;
  accentViolet: string;
  accentEmerald: string;
  accentGradient: string;
  bgDeep: string;
  borderGlow: string;
}

export type BackgroundAnimationMode =
  | 'constellation' // Particle network physics
  | 'circuit'       // Cybernetic animated circuit grid & data pulses
  | 'warp'          // Deep space hyper-drive warp streams
  | 'waves';        // Flowing harmonic cyber sine waves


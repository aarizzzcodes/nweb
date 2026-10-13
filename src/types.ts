export type ProjectCategory = 'all' | 'web' | 'iot' | 'systems';

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

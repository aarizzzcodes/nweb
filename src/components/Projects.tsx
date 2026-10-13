import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GithubIcon } from './Icons';
import { TiltCard } from './TiltCard';
import { ScrollReveal } from './ScrollReveal';
import { Project, ProjectCategory } from '../types';

const PROJECTS: Project[] = [
  {
    id: 'pulseflow',
    category: 'web',
    categoryLabel: 'Web Application',
    title: 'PulseFlow Analytics Dashboard',
    description: 'Real-time metrics visualization with live charts, WebSocket updates, and customizable widgets.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Chart.js'],
    githubUrl: 'https://github.com',
    demoUrl: '#',
  },
  {
    id: 'aqua-sentinel',
    category: 'iot',
    categoryLabel: 'IoT & Embedded',
    title: 'Smart Aqua Sentinel',
    description: 'Microcontroller system with ultrasonic level sensing, automated flow alerts, and cloud telemetry.',
    tags: ['Arduino', 'C++', 'Sensors', 'Telemetry'],
    githubUrl: 'https://github.com',
    demoUrl: '#',
  },
  {
    id: 'neuralvision',
    category: 'systems',
    categoryLabel: 'Systems & Python',
    title: 'NeuralVision Pipeline',
    description: 'Automated visual detection pipeline with high-throughput batching and inference streaming.',
    tags: ['Python', 'OpenCV', 'PyTorch', 'FastAPI'],
    githubUrl: 'https://github.com',
    demoUrl: '#',
  },
];

export const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');

  const filteredProjects = PROJECTS.filter((project) => {
    if (activeFilter === 'all') return true;
    return project.category === activeFilter;
  });

  return (
    <section className="section-container" id="projects">
      <ScrollReveal direction="up" distance={25} className="section-header">
        <span className="section-tag">Portfolio</span>
        <h2 className="section-title">Featured Creations</h2>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1} distance={20} className="filter-bar">
        <button
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Projects
        </button>
        <button
          className={`filter-btn ${activeFilter === 'web' ? 'active' : ''}`}
          onClick={() => setActiveFilter('web')}
        >
          Web & Apps
        </button>
        <button
          className={`filter-btn ${activeFilter === 'iot' ? 'active' : ''}`}
          onClick={() => setActiveFilter('iot')}
        >
          IoT & Hardware
        </button>
        <button
          className={`filter-btn ${activeFilter === 'systems' ? 'active' : ''}`}
          onClick={() => setActiveFilter('systems')}
        >
          Systems & Python
        </button>
      </ScrollReveal>

      <motion.div layout className="projects-grid">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                duration: 0.45,
                delay: idx * 0.08,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <TiltCard className="project-card" data-category={project.category}>
                <div>
                  <div className="project-header">
                    <span className="category-badge">{project.categoryLabel}</span>
                    <div className="project-links">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="icon-btn"
                        title="View Source"
                      >
                        <GithubIcon size={18} />
                      </a>
                      <a
                        href={project.demoUrl}
                        className="icon-btn"
                        title="Live Demo"
                        onClick={(e) => {
                          if (project.demoUrl === '#') e.preventDefault();
                        }}
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="tag-group">
                  {project.tags.map((tag) => (
                    <span key={tag} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

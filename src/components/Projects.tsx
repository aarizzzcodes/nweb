import React, { useState } from 'react';
import { ExternalLink, Cpu, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GithubIcon } from './Icons';
import { TiltCard } from './TiltCard';
import { ScrollReveal } from './ScrollReveal';
import { SensorsLab } from './SensorsLab';
import { Project, ProjectCategory } from '../types';

const PROJECTS: Project[] = [
  {
    id: 'sensors-lab-project',
    category: 'iot',
    categoryLabel: 'IoT & Embedded Sensors',
    title: 'Multi-Sensor Microcontroller Telemetry Suite',
    description: 'Hardware testbench & driver framework integrating 22 distinct sensors for environmental, acoustic, optical, and Hall magnetic measurements.',
    tags: ['22 Sensors', 'Arduino', 'ESP32', 'I2C/SPI/1-Wire', 'Telemetry'],
    githubUrl: 'https://github.com/aarizzzcodes',
    demoUrl: '#',
  },
  {
    id: 'pulseflow',
    category: 'web',
    categoryLabel: 'Web Application',
    title: 'PulseFlow Analytics Dashboard',
    description: 'Real-time metrics visualization with live charts, WebSocket updates, and customizable widgets.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Chart.js'],
    githubUrl: 'https://github.com/aarizzzcodes',
    demoUrl: '#',
  },
  {
    id: 'aqua-sentinel',
    category: 'iot',
    categoryLabel: 'IoT & Embedded',
    title: 'Smart Aqua Sentinel',
    description: 'Microcontroller system with ultrasonic level sensing, automated flow alerts, and cloud telemetry.',
    tags: ['Arduino', 'C++', 'Sensors', 'Telemetry'],
    githubUrl: 'https://github.com/aarizzzcodes',
    demoUrl: '#',
  },
  {
    id: 'neuralvision',
    category: 'systems',
    categoryLabel: 'Systems & Python',
    title: 'NeuralVision Pipeline',
    description: 'Automated visual detection pipeline with high-throughput batching and inference streaming.',
    tags: ['Python', 'OpenCV', 'PyTorch', 'FastAPI'],
    githubUrl: 'https://github.com/aarizzzcodes',
    demoUrl: '#',
  },
];

export const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');

  const filteredProjects = PROJECTS.filter((project) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'sensors') return false;
    return project.category === activeFilter;
  });

  return (
    <section className="section-container" id="projects">
      <ScrollReveal direction="up" distance={25} className="section-header">
        <span className="section-tag">Portfolio & Laboratory</span>
        <h2 className="section-title">Featured Creations & Hardware</h2>
      </ScrollReveal>

      {/* Filter Bar with dedicated Sensors Lab button */}
      <ScrollReveal direction="up" delay={0.1} distance={20} className="filter-bar">
        <button
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Projects
        </button>
        <button
          className={`filter-btn sensor-filter-btn ${activeFilter === 'sensors' ? 'active' : ''}`}
          onClick={() => setActiveFilter('sensors')}
        >
          <Cpu size={15} style={{ marginRight: '6px' }} />
          Sensors Lab (22 Modules)
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

      {/* When Sensors subpart is selected */}
      {activeFilter === 'sensors' ? (
        <SensorsLab />
      ) : (
        <>
          {/* Spotlight banner inside Projects linking to the Sensors Workbench */}
          <div className="sensor-spotlight-banner">
            <div className="spotlight-left">
              <span className="spotlight-badge">
                <Sparkles size={14} /> Hardware Workbench Subpart
              </span>
              <h3>Physical Computing & 22-Sensor Laboratory</h3>
              <p>
                Worked with 22 distinct microcontrollers and analog/digital sensors including Ultrasonic, Barometric BMP280, PIR Motion, Soil Moisture, Laser, and Hall sensors.
              </p>
            </div>
            <button
              className="btn btn-primary spotlight-cta-btn"
              onClick={() => setActiveFilter('sensors')}
            >
              Enter Sensors Lab <ArrowRight size={18} />
            </button>
          </div>

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
                          {project.id === 'sensors-lab-project' ? (
                            <button
                              className="icon-btn"
                              title="Open Sensors Lab"
                              onClick={() => setActiveFilter('sensors')}
                              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              <Cpu size={18} />
                            </button>
                          ) : (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="icon-btn"
                              title="View Source"
                            >
                              <GithubIcon size={18} />
                            </a>
                          )}

                          <a
                            href={project.demoUrl}
                            className="icon-btn"
                            title={project.id === 'sensors-lab-project' ? 'Launch Lab' : 'Live Demo'}
                            onClick={(e) => {
                              if (project.id === 'sensors-lab-project') {
                                e.preventDefault();
                                setActiveFilter('sensors');
                              } else if (project.demoUrl === '#') {
                                e.preventDefault();
                              }
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

                    {project.id === 'sensors-lab-project' && (
                      <button
                        className="btn btn-secondary"
                        style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                        onClick={() => setActiveFilter('sensors')}
                      >
                        Explore All 22 Sensors & Pinouts <ArrowRight size={16} />
                      </button>
                    )}
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </section>
  );
};

import React from 'react';
import { Code2, Layout, Server, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { TiltCard } from './TiltCard';
import { ScrollReveal } from './ScrollReveal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const Skills: React.FC = () => {
  return (
    <section className="section-container" id="skills">
      <ScrollReveal direction="up" distance={25} className="section-header">
        <span className="section-tag">Capabilities</span>
        <h2 className="section-title">Technical Toolbelt</h2>
      </ScrollReveal>

      <motion.div
        className="skills-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.div variants={cardVariants}>
          <TiltCard className="skill-card">
            <div className="skill-icon-wrapper">
              <Code2 size={24} />
            </div>
            <h3>Languages</h3>
            <p>Writing expressive, performant code across various abstraction levels.</p>
            <div className="tag-group">
              <span className="badge">TypeScript</span>
              <span className="badge">JavaScript</span>
              <span className="badge">Python</span>
              <span className="badge">C++</span>
              <span className="badge">SQL</span>
            </div>
          </TiltCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <TiltCard className="skill-card">
            <div className="skill-icon-wrapper">
              <Layout size={24} />
            </div>
            <h3>Frontend Systems</h3>
            <p>Modern interactive user interfaces built for responsiveness and speed.</p>
            <div className="tag-group">
              <span className="badge">React</span>
              <span className="badge">HTML5/CSS3</span>
              <span className="badge">Tailwind CSS</span>
              <span className="badge">Vite</span>
            </div>
          </TiltCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <TiltCard className="skill-card">
            <div className="skill-icon-wrapper">
              <Server size={24} />
            </div>
            <h3>Backend & Storage</h3>
            <p>RESTful APIs, asynchronous services, and secure persistent databases.</p>
            <div className="tag-group">
              <span className="badge">Node.js</span>
              <span className="badge">Express</span>
              <span className="badge">PostgreSQL</span>
              <span className="badge">MongoDB</span>
              <span className="badge">REST APIs</span>
            </div>
          </TiltCard>
        </motion.div>

        <motion.div variants={cardVariants}>
          <TiltCard className="skill-card">
            <div className="skill-icon-wrapper">
              <Cpu size={24} />
            </div>
            <h3>IoT & Hardware</h3>
            <p>Bridging physical reality with software via microcontrollers and telemetry.</p>
            <div className="tag-group">
              <span className="badge">Arduino</span>
              <span className="badge">ESP32 / WiFi</span>
              <span className="badge">Ultrasonic Sensors</span>
              <span className="badge">Git / GitHub</span>
            </div>
          </TiltCard>
        </motion.div>
      </motion.div>
    </section>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from './TiltCard';
import { ScrollReveal } from './ScrollReveal';
import { Milestone } from '../types';

const MILESTONES: Milestone[] = [
  {
    period: '2026 - Present',
    title: 'Senior Systems & Full-Stack Architect',
    description:
      'Directing modular microservice pipelines, hardware IoT sensor integrations, and fluid user experiences.',
  },
  {
    period: '2024 - 2025',
    title: 'Open Source & Independent Engineering',
    description:
      'Authored high-performance utilities, contributed to developer toolchains, and constructed automated IoT monitors.',
  },
  {
    period: '2022 - 2024',
    title: 'Foundational Explorations in Computing',
    description:
      'Mastered data structures, algorithmic problem solving, modern web APIs, and low-level firmware engineering.',
  },
];

export const Timeline: React.FC = () => {
  return (
    <section className="section-container" id="timeline">
      <ScrollReveal direction="up" distance={25} className="section-header">
        <span className="section-tag">Milestones</span>
        <h2 className="section-title">The Journey</h2>
      </ScrollReveal>

      <div className="timeline-container">
        {MILESTONES.map((item, idx) => (
          <motion.div
            key={idx}
            className="timeline-item"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.55,
              delay: idx * 0.15,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
          >
            <motion.div
              className="timeline-marker"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 18,
                delay: idx * 0.15 + 0.1,
              }}
            />
            <TiltCard className="timeline-content">
              <span className="timeline-date">{item.period}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

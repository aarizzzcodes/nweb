import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from './TiltCard';
import { ScrollReveal } from './ScrollReveal';

export const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dev' | 'specs'>('dev');

  return (
    <section className="section-container" id="about">
      <ScrollReveal direction="up" distance={25} className="section-header">
        <span className="section-tag">Overview</span>
        <h2 className="section-title">Engineering with Purpose</h2>
      </ScrollReveal>

      <div className="about-grid">
        <ScrollReveal direction="up" delay={0.1} distance={30}>
          <TiltCard className="about-card">
            <h3>The Narrative</h3>
            <p>
              I'm a computer science and electronics enthusiast who loves crafting reliable web architectures and hardware-integrated software. Whether it's writing multi-threaded algorithms, designing responsive user interfaces, or calibrating IoT microcontrollers, I focus on clean maintainability and performance.
            </p>
            <div className="metrics-row">
              <motion.div
                className="metric-box"
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="metric-number">20+</span>
                <span className="metric-label">Completed Builds</span>
              </motion.div>
              <motion.div
                className="metric-box"
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="metric-number">99.9%</span>
                <span className="metric-label">Precision Focused</span>
              </motion.div>
              <motion.div
                className="metric-box"
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="metric-number">100%</span>
                <span className="metric-label">Problem Solver</span>
              </motion.div>
            </div>
          </TiltCard>
        </ScrollReveal>

        {/* Interactive Terminal Card */}
        <ScrollReveal direction="up" delay={0.2} distance={30}>
          <div className="terminal-card">
            <div className="terminal-header">
              <div className="terminal-buttons">
                <span className="term-btn btn-red" />
                <span className="term-btn btn-yellow" />
                <span className="term-btn btn-green" />
              </div>
              <div className="terminal-tabs">
                <button
                  className={`tab-btn ${activeTab === 'dev' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dev')}
                >
                  aariz.ts
                </button>
                <button
                  className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('specs')}
                >
                  specs.json
                </button>
              </div>
            </div>

            {activeTab === 'dev' && (
              <motion.div
                key="dev"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="terminal-body"
                id="tab-dev"
              >
                <pre>
                  <code>
                    <span className="c-keyword">interface</span> <span className="c-type">Engineer</span> {'{\n'}
                    {'  '}name: <span className="c-string">"Aariz"</span>;{'\n'}
                    {'  '}role: <span className="c-string">"Full-Stack & Systems Craftsman"</span>;{'\n'}
                    {'  '}loves: [<span className="c-string">"Performant UIs"</span>, <span className="c-string">"Hardware IoT"</span>, <span className="c-string">"Clean Code"</span>];{'\n'}
                    {'  '}status: <span className="c-string">"Building the future 🚀"</span>;{'\n'}
                    {'}'}{'\n\n'}
                    <span className="c-keyword">const</span> developer = <span className="c-keyword">new</span> <span className="c-func">Engineer</span>();{'\n'}
                    developer.<span className="c-func">deployPassion</span>();
                  </code>
                </pre>
              </motion.div>
            )}

            {activeTab === 'specs' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="terminal-body"
                id="tab-specs"
              >
                <pre>
                  <code>
                    {'{'}{'\n'}
                    {'  '}<span className="c-string">"architecture"</span>: <span className="c-string">"Distributed & Modular"</span>,{'\n'}
                    {'  '}<span className="c-string">"primaryTools"</span>: [<span className="c-string">"Node.js"</span>, <span className="c-string">"Python"</span>, <span className="c-string">"C++"</span>],{'\n'}
                    {'  '}<span className="c-string">"coffeeConsumed"</span>: <span className="c-keyword">Infinity</span>,{'\n'}
                    {'  '}<span className="c-string">"status"</span>: <span className="c-string">"Online"</span>{'\n'}
                    {'}'}
                  </code>
                </pre>
              </motion.div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

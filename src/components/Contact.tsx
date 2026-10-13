import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { TiltCard } from './TiltCard';
import { ScrollReveal } from './ScrollReveal';

interface ContactProps {
  onShowToast: (message: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onShowToast(`⚡ Thanks ${name.trim()}! Your transmission has reached Aariz.`);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section className="section-container" id="contact">
      <ScrollReveal direction="up" distance={30}>
        <TiltCard className="contact-box">
          <div className="section-header" style={{ marginBottom: '1.5rem' }}>
            <span className="section-tag">Connect</span>
            <h2 className="section-title">Let's Build Something Exceptional</h2>
          </div>
          <p className="contact-lead">
            Have a vision for a project or looking to collaborate? Drop me a message below.
          </p>

          <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="alex@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                required
                placeholder="Hey Aariz, let's team up on..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <motion.button
              type="submit"
              className="btn btn-primary btn-submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Message <Send size={18} />
            </motion.button>
          </form>
        </TiltCard>
      </ScrollReveal>
    </section>
  );
};

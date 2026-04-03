import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Code, Globe } from 'lucide-react';

const About = () => {
  return (
    <motion.div 
      className="page flex-center col"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ padding: '100px 24px', minHeight: '100vh', textAlign: 'center' }}
    >
      <Hexagon size={64} color="var(--primary)" style={{ marginBottom: '20px' }} />
      <h2>About Aura Travel</h2>
      <p className="text-muted" style={{ maxWidth: '500px', margin: '20px auto', lineHeight: '1.6' }}>
        Aura is a minimalist, fully-functional modern travel gallery built to preserve your memories. 
        Unlike traditional booking systems, Aura focuses heavily on your subjective experiences—allowing you 
        to capture, upload, and organize your trip memories sequentially.
      </p>

      <div className="glass-panel" style={{ padding: '30px', marginTop: '30px', borderRadius: '16px', maxWidth: '400px' }}>
        <h4>Developer Info</h4>
        <p className="text-muted" style={{ fontSize: '13px', margin: '10px 0 20px' }}>
          Engineered as a high-performance React PWA integrated directly with a local Express MongoDB pipeline.
        </p>
        <div className="flex-center" style={{ gap: '15px' }}>
          <button className="icon-btn-small" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>
            <Code size={18} />
          </button>
          <button className="icon-btn-small" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>
            <Globe size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default About;

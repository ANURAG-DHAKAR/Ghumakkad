import React from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <motion.div 
      className="page"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ padding: '100px var(--app-padding)', minHeight: '100vh' }}
    >
      <h2>Contact Us</h2>
      <p className="text-muted" style={{ marginBottom: '40px' }}>We'd love to hear about your travels.</p>

      <div style={{ display: 'grid', gap: '30px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px' }}>
          <form className="col" style={{ gap: '15px' }} onSubmit={e => e.preventDefault()}>
            <div className="col" style={{ gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Name</label>
              <input type="text" placeholder="Your name" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--bg-secondary)', outline: 'none' }} />
            </div>
            <div className="col" style={{ gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Email</label>
              <input type="email" placeholder="Your email" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--bg-secondary)', outline: 'none' }} />
            </div>
            <div className="col" style={{ gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Message</label>
              <textarea placeholder="How can we help?" rows="4" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--bg-secondary)', outline: 'none', resize: 'none' }} />
            </div>
            <button className="btn-primary" style={{ marginTop: '10px' }}>
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>

        <div className="col" style={{ gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ padding: '10px', background: 'rgba(248, 58, 89, 0.1)', borderRadius: '10px', color: 'var(--primary)' }}>
              <MapPin size={24} />
            </div>
            <div>
              <h4>Headquarters</h4>
              <p className="text-muted" style={{ fontSize: '13px' }}>123 Explorer Lane, Travel City</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ padding: '10px', background: 'rgba(248, 58, 89, 0.1)', borderRadius: '10px', color: 'var(--primary)' }}>
              <Phone size={24} />
            </div>
            <div>
              <h4>Phone</h4>
              <p className="text-muted" style={{ fontSize: '13px' }}>+1 (555) 000-0000</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;

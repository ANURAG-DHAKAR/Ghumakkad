import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Sparkles, Send } from 'lucide-react';
import './TripPlanner.css';

const TripPlanner = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hey! I'm Aura. Where are we heading to?" }
  ]);
  const [inputVal, setInputVal] = useState('');

  const submitChat = (e) => {
    e.preventDefault();
    if(!inputVal.trim()) return;

    setMessages([...messages, { id: Date.now(), sender: 'user', text: inputVal }]);
    setInputVal('');

    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now(), sender: 'ai', text: "Wow, that sounds phenomenal. Let me start putting an itinerary together with a few localized gems..." }]);
    }, 1000);
  };

  return (
    <motion.div 
      className="page planner-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="planner-header">
        <div className="flex-center col gap-1">
          <div className="ai-icon-pulse flex-center">
            <Sparkles size={24} color="#00d2ff" />
          </div>
          <h2>AI Trip Architect</h2>
          <p className="text-muted">Generate a complete vibe matched itinerary</p>
        </div>
      </div>

      <div className="chat-container glass-panel">
        <div className="chat-history">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div 
                key={m.id} 
                className={`chat-bubble ${m.sender}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {m.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <form className="chat-input-area" onSubmit={submitChat}>
          <input 
            type="text" 
            placeholder="e.g. 5 days in Tokyo under $2000" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" className="glass-pill btn-send">
            <Send size={18} color="var(--primary)" />
          </button>
        </form>
      </div>
      
      {/* Spacer */}
      <div style={{ height: '100px' }}></div>
    </motion.div>
  );
};

export default TripPlanner;

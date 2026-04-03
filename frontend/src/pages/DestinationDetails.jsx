import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Calendar } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <motion.div 
      className="page details-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ padding: '80px var(--app-padding) 100px', width: '100%' }}
    >
      <div className="back-btn" onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer', color: 'var(--primary)' }}>
        &larr; Back
      </div>

      <div className="gallery" style={{ width: '100%', height: '250px', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}>
        <img src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=600&q=80" alt="Destination" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>

      <h2>Santorini Overview</h2>
      <div className="flex-center" style={{ gap: '15px', marginTop: '10px', marginBottom: '20px', color: 'var(--text-muted)' }}>
        <span className="flex-center gap-1"><MapPin size={16} color="var(--primary)"/> Greece</span>
        <span className="flex-center gap-1"><Star size={16} color="#FFD700"/> 4.9</span>
      </div>

      <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
        A stunning volcanic island in the Cyclades group of the Greek islands, renowned for its dramatic views, stunning sunsets, and white-washed cubic houses leaning on the caldera cliff.
      </p>

      <div className="glass-panel" style={{ padding: '15px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="flex-between">
          <span className="text-muted flex-center gap-1"><Calendar size={16} /> Best Time</span>
          <span>May - October</span>
        </div>
        <div className="flex-between">
          <span className="text-muted">Avg. Budget</span>
          <span className="text-gradient" style={{fontWeight: 'bold'}}>$1,200</span>
        </div>
      </div>
      
      <h3>Reviews</h3>
      <div className="glass-panel" style={{ padding: '15px', marginTop: '10px' }}>
        <p className="text-muted">"Absolutely breathtaking sunsets..."</p>
        <span style={{ fontSize: '12px', color: 'var(--primary)' }}>- Alex Wanderer</span>
      </div>

    </motion.div>
  );
};

export default DestinationDetails;

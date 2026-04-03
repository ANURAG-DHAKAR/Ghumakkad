import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, Heart } from 'lucide-react';
import './DestinationCard.css';

const DestinationCard = ({ dest, index }) => {
  const [isLiked, setIsLiked] = useState(dest.liked || false);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,     
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="destination-card-3d"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="card-image-box">
        <img src={dest.img} alt={dest.name} />
        <button
          className="like-btn glass-pill"
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
        >
          <Heart size={18} color={isLiked ? "var(--danger)" : "white"} fill={isLiked ? "var(--danger)" : "none"} />
        </button>
        <div className="rating-badge glass-pill">
          <Star size={12} color="#FFD700" fill="#FFD700" />
          <span>{dest.rating}</span>
        </div>
      </div>

      <div className="card-info glass-panel">
        <div className="flex-between">
          <h3>{dest.name}</h3>
          <span className="price">${dest.budgetEstimate}</span>
        </div>
        <p className="location flex-center">
          <MapPin size={14} color="var(--primary)" /> {dest.location}
        </p>
        <div className="tags">
          <span className="tag-city">{dest.category}</span>
          <span className="tag-details flex-center gap-1">
            <Clock size={12} /> {dest.bestTimeToVisit}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;

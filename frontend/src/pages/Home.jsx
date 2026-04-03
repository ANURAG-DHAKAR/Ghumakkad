import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, PlayCircle, ArrowRight } from 'lucide-react';
import useDestinationStore from '../context/destinationStore';
import useGalleryStore from '../context/galleryStore';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const slideImages = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
];

const Home = () => {
  const { destinations, fetchDestinations, isLoading } = useDestinationStore();
  const { photos } = useGalleryStore();
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // Slideshow Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const travelVideos = [
    { id: 1, title: 'Kyoto in Autumn', duration: '3:45', img: 'https://images.unsplash.com/photo-1493976040373-c1c5005be4b2?auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: 'Scuba Diving Bali', duration: '5:20', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'Walking through Santorini', duration: '12:00', img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=400&q=80' }
  ];

  return (
    <motion.div 
      className="page home-page"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section className="hero-section">
        <div className="hero-background">
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={currentSlide}
              src={slideImages[currentSlide]}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              alt="Travel view slideshow" 
            />
          </AnimatePresence>
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="hero-badge">Discover the World</span>
            <h1>Travel With Me</h1>
            <p className="hero-subline">Create albums, upload memories, and organize your favorite travel experiences seamlessly.</p>
            
            <div className="flex-center" style={{gap: '15px', justifyContent: 'flex-start'}}>
              <button className="btn-primary" onClick={() => navigate('/destinations')}>
                Explore <ArrowRight size={18}/>
              </button>
              <button className="btn-secondary" style={{background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white'}} onClick={() => navigate('/trips/new')}>
                Create Trip
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Trips */}
      <section className="featured-section">
        <div className="section-header flex-between">
          <h3>Trending Destinations</h3>
          <span className="see-all text-gradient" onClick={() => navigate('/destinations')}>See All</span>
        </div>

        <div className="horizontal-scroll">
          {isLoading ? <p className="text-muted">Loading trendy spots...</p> : destinations.slice(0, 5).map((dest, i) => (
            <motion.div 
              key={dest._id} 
              className="dest-card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              onClick={() => navigate('/destinations')}
            >
              <div className="card-img-wrapper">
                <img src={dest.images && dest.images.length > 0 ? dest.images[0] : 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=400&q=80'} alt={dest.name} loading="lazy" />
                <div className="card-overlay glass-panel">
                  <div className="flex-between">
                    <div>
                      <h4>{dest.name}</h4>
                      <p className="flex-center gap-1">
                        <MapPin size={12} color="var(--primary)" /> {dest.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="featured-section" style={{background: 'var(--surface)', padding: '30px var(--app-padding)'}}>
        <div className="section-header flex-between">
          <h3>Your Recent Memories</h3>
          <span className="see-all text-gradient" onClick={() => navigate('/gallery')}>Open Gallery</span>
        </div>
        
        <div className="gallery-preview-grid">
          {photos && photos.length > 0 ? photos.slice(0, 4).map((photo, i) => (
            <motion.div 
              key={photo._id || photo.id}
              className={`preview-photo ${i === 0 ? 'large' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (0.1 * i) }}
              onClick={() => navigate('/gallery')}
            >
              <img src={photo.url} alt="Memory" loading="lazy" />
            </motion.div>
          )) : (
            <p className="text-muted" style={{gridColumn: '1 / -1'}}>No recent memories. Head to Upload to add some!</p>
          )}
        </div>
      </section>

      {/* Travel Videos Reel */}
      <section className="featured-section">
        <div className="section-header">
          <h3>Travel Reels</h3>
        </div>

        <div className="horizontal-scroll">
          {travelVideos.map((video, i) => (
            <motion.div 
              key={video.id} 
              className="video-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
            >
              <img src={video.img} alt={video.title} loading="lazy" />
              <div className="video-overlay">
                <PlayCircle size={40} color="white" className="play-icon" />
              </div>
              <div className="video-info">
                <h4>{video.title}</h4>
                <span className="duration">{video.duration}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div style={{ height: '100px' }}></div>
    </motion.div>
  );
};

export default Home;

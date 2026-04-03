import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import DestinationCard from '../components/DestinationCard';
import useDestinationStore from '../context/destinationStore';
import './Destinations.css';

const Destinations = () => {
  const { destinations, fetchDestinations, searchDestinations, filterByCategory, isLoading } = useDestinationStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleFilter = (f) => {
    setActiveFilter(f);
    filterByCategory(f);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchDestinations(searchQuery);
  };

  const filters = ['All', 'mountain', 'beach', 'city']; // matches backend enums

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div 
      className="page destinations-page"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h2>Explore</h2>
        <p className="text-muted">Find your next adventure</p>
      </div>

      <form className="search-container" onSubmit={handleSearch}>
        <div className="search-bar glass-panel flex-center">
          <Search size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search destinations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="filter-btn glass-panel">
          <SlidersHorizontal size={20} color="var(--primary)" />
        </button>
      </form>

      <div className="pill-filters horizontal-scroll">
        {filters.map(f => (
          <button 
            key={f} 
            className={`glass-pill feature-pill ${activeFilter === f ? 'active' : ''}`}
            onClick={() => handleFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex-center" style={{marginTop: '50px'}}>Loading destinations...</div>
      ) : (
        <motion.div 
          className="destinations-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {destinations.map((dest, i) => (
            <DestinationCard key={dest._id} dest={{
              id: dest._id,
              name: dest.name,
              location: dest.location,
              category: dest.category,
              budgetEstimate: dest.budgetEstimate,
              rating: dest.rating,
              img: dest.images && dest.images.length > 0 ? dest.images[0] : 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=400&q=80',
              bestTimeToVisit: dest.bestTimeToVisit
            }} index={i} />
          ))}
        </motion.div>
      )}
      
      {/* Spacer for bottom nav */}
      <div style={{ height: '100px' }}></div>
    </motion.div>
  );
};

export default Destinations;

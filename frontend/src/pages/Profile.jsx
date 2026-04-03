import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, LogOut, Heart, Image as ImageIcon, Briefcase, ChevronRight, Info, Mail } from 'lucide-react';
import useAuthStore from '../context/authStore';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, fetchProfile, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!user) {
    return (
      <div className="page flex-center" style={{height: '100vh'}}>
        <p>Please login to view profile.</p>
        <button className="btn-primary" onClick={() => navigate('/auth')} style={{marginLeft: '10px'}}>Login</button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <motion.div 
      className="page profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="profile-header flex-center col">
        <div className="profile-avatar-large">
          <img src={user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200"} alt="Profile" />
        </div>
        <h2>{user.name}</h2>
        <p className="text-muted">{user.email}</p>
        
        <div className="profile-stats flex-center">
          <div className="stat-item">
            <h4>{user.travelStats?.totalTrips || 0}</h4>
            <span className="text-muted">Trips</span>
          </div>
          <div className="stat-item">
            <h4>{user.travelStats?.citiesVisited || 0}</h4>
            <span className="text-muted">Cities</span>
          </div>
        </div>
      </div>

      <div className="profile-sections">
        {/* Core Capabilities */}
        <div className="settings-group">
          <h4 className="section-label">Your Content</h4>
          
          <div className="setting-item glass-panel" onClick={() => navigate('/trips')}>
            <div className="flex-center" style={{ gap: '15px' }}>
              <div className="icon-box" style={{ background: 'rgba(255, 212, 59, 0.12)', color: '#f59e0b' }}>
                <Briefcase size={20} />
              </div>
              <span>My Trips</span>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </div>

          <div className="setting-item glass-panel" onClick={() => navigate('/gallery')}>
            <div className="flex-center" style={{ gap: '15px' }}>
              <div className="icon-box" style={{ background: 'rgba(255, 107, 107, 0.1)', color: '#FF6B6B' }}>
                <ImageIcon size={20} />
              </div>
              <span>My Gallery (Albums)</span>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </div>

          <div className="setting-item glass-panel" onClick={() => navigate('/destinations')}>
            <div className="flex-center" style={{ gap: '15px' }}>
              <div className="icon-box" style={{ background: 'rgba(78, 205, 196, 0.1)', color: '#4ECDC4' }}>
                <Heart size={20} />
              </div>
              <span>Exploration Wishlist</span>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </div>
        </div>

        {/* Global Nav */}
        <div className="settings-group">
          <h4 className="section-label">Aura Platform</h4>

          <div className="setting-item glass-panel" onClick={() => navigate('/about')}>
            <div className="flex-center" style={{ gap: '15px' }}>
              <div className="icon-box" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-main)' }}>
                <Info size={20} />
              </div>
              <span>About Us</span>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </div>

          <div className="setting-item glass-panel" onClick={() => navigate('/contact')}>
            <div className="flex-center" style={{ gap: '15px' }}>
              <div className="icon-box" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-main)' }}>
                <Mail size={20} />
              </div>
              <span>Contact Support</span>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </div>
        </div>

        <div className="settings-group">
          <button className="setting-item danger glass-panel" onClick={handleLogout} style={{ width: '100%', border: 'none' }}>
            <div className="flex-center" style={{ gap: '15px' }}>
              <div className="icon-box" style={{ background: 'transparent', color: 'var(--danger)' }}>
                <LogOut size={20} />
              </div>
              <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Log Out</span>
            </div>
          </button>
        </div>
      </div>
      
      <div style={{ height: '100px' }}></div>
    </motion.div>
  );
};

export default Profile;

import React, { useState } from 'react';
import { Bell, Search, Hexagon, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import './Navbar.css';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="navbar">
      <Link to="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
        <h2 className="text-gradient">Ghumakkad</h2>
      </Link>
      <div className="navbar-actions" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {/* <button className="icon-btn">
          <Search size={22} color="var(--text-main)" />
        </button> */}

        <div style={{ position: 'relative' }}>
          <button className="icon-btn notification" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={22} color="var(--text-main)" />
            <span className="badge"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                style={{ position: 'absolute', top: '40px', right: '-20px', background: 'var(--surface)', width: '280px', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid var(--surface-border)', zIndex: 1000 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>Notifications</h4>
                <div style={{ fontSize: '13px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px', marginBottom: '10px' }}>
                  <p><strong>Ravi Hikes</strong></p>
                  <p className="text-muted">Welcome to the new Gallery!</p>
                </div>
                <div style={{ fontSize: '13px' }}>
                  <p><strong>Upload Success</strong></p>
                  <p className="text-muted">Your memories were safely stored.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {user ? (
          <>
            <button className="icon-btn" onClick={() => navigate('/profile')} title="Profile">
              <User size={22} color="var(--text-main)" />
            </button>
            <button className="icon-btn" onClick={handleLogout} title="Logout">
              <LogOut size={22} color="var(--danger)" />
            </button>
          </>
        ) : (
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => navigate('/auth')}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;

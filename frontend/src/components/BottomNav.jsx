import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, PlusSquare, Image as ImageIcon, User, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { id: 'home', icon: Home, path: '/' },
    { id: 'destinations', icon: Compass, path: '/destinations' },
    { id: 'createTrip', icon: PlusSquare, path: '/trips/new' },
    { id: 'trips', icon: Briefcase, path: '/trips' },
    { id: 'gallery', icon: ImageIcon, path: '/gallery' },
    { id: 'profile', icon: User, path: '/profile' }
  ];

  return (
    <div className="bottom-nav-container glass-panel">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;

        return (
          <Link to={item.path} key={item.id} className={`nav-item ${item.special ? 'special' : ''}`}>
            {item.special ? (
              <div className="special-icon-wrapper">
                <Icon size={24} color="#050505" />
              </div>
            ) : (
              <div className="icon-wrapper">
                <Icon size={24} className={isActive ? 'active-icon' : 'inactive-icon'} />
                {isActive && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className="nav-indicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import useAuthStore from '../context/authStore';
import { useNavigate, Navigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  const { login, register, isLoading, error, user } = useAuthStore();
  const navigate = useNavigate();

  // If already logged in, redirect to profile immediately
  if (user) {
    return <Navigate to="/profile" />;
  }

  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    
    if (isLogin) {
      success = await login(formData.email, formData.password);
    } else {
      success = await register(formData.name, formData.email, formData.password);
    }

    if (success) {
      navigate('/profile');
    }
  };

  return (
    <motion.div 
      className="page auth-page flex-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="auth-card glass-panel col">
        <div className="auth-header text-center">
          <h2>{isLogin ? 'Welcome Back' : 'Join Aura'}</h2>
          <p className="text-muted">
            {isLogin ? 'Sign in to access your gallery' : 'Start saving your travel memories'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form col">
          <AnimatePresence>
            {!isLogin && (
              <motion.div 
                className="input-group"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <User size={18} color="var(--text-muted)" className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="input-group">
            <Mail size={18} color="var(--text-muted)" className="input-icon" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="input-group">
            <Lock size={18} color="var(--text-muted)" className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
            {isLoading ? <div className="spinner" /> : (isLogin ? 'Sign In' : 'Create Account')}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="auth-switch text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="text-gradient" onClick={toggleMode}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default Auth;

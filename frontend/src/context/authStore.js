import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('aura_user')) || null,
  token: localStorage.getItem('aura_token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('aura_token', token);
      localStorage.setItem('aura_user', JSON.stringify(userData));
      
      set({ user: userData, token, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('aura_token', token);
      localStorage.setItem('aura_user', JSON.stringify(userData));
      
      set({ user: userData, token, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn("Logout ping failed", e);
    } finally {
      localStorage.removeItem('aura_token');
      localStorage.removeItem('aura_user');
      set({ user: null, token: null });
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/user/update', data);
      localStorage.setItem('aura_user', JSON.stringify(response.data));
      set({ user: response.data });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  fetchProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      localStorage.setItem('aura_user', JSON.stringify(response.data));
      set({ user: response.data });
    } catch (error) {
      console.error(error);
    }
  }
}));

export default useAuthStore;

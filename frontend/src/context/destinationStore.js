import { create } from 'zustand';
import api from '../services/api';

const useDestinationStore = create((set, get) => ({
  destinations: [],
  activeDestination: null,
  isLoading: false,
  error: null,

  fetchDestinations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/destinations');
      set({ destinations: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  searchDestinations: async (keyword) => {
    if (!keyword) return get().fetchDestinations();
    
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/destinations/search?q=${keyword}`);
      set({ destinations: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  filterByCategory: async (category) => {
    if (category === 'All') return get().fetchDestinations();
    
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/destinations/filter?category=${category}`);
      set({ destinations: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getDestination: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/destinations/${id}`);
      set({ activeDestination: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));

export default useDestinationStore;

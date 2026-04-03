import { create } from 'zustand';
import api from '../services/api';

const useTripStore = create((set, get) => ({
  trips: [],
  activeTrip: null,
  isLoading: false,
  error: null,

  fetchTrips: async () => {
    if (!localStorage.getItem('aura_token')) return;
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/trips');
      set({ trips: data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to load trips',
        isLoading: false
      });
    }
  },

  fetchTripById: async (id) => {
    if (!localStorage.getItem('aura_token')) return null;
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/trips/${id}`);
      set({ activeTrip: data, isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to load trip',
        isLoading: false
      });
      return null;
    }
  },

  createTrip: async (payload) => {
    if (!localStorage.getItem('aura_token')) return null;
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/trips', payload);
      set((state) => ({ trips: [data, ...state.trips], isLoading: false }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create trip',
        isLoading: false
      });
      return null;
    }
  },

  updateTrip: async (id, payload) => {
    if (!localStorage.getItem('aura_token')) return null;
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put(`/trips/${id}`, payload);
      set((state) => ({
        trips: state.trips.map((t) => (t._id === id ? data : t)),
        activeTrip: state.activeTrip?._id === id ? data : state.activeTrip,
        isLoading: false
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update trip',
        isLoading: false
      });
      return null;
    }
  },

  deleteTrip: async (id) => {
    if (!localStorage.getItem('aura_token')) return false;
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/trips/${id}`);
      set((state) => ({
        trips: state.trips.filter((t) => t._id !== id),
        activeTrip: state.activeTrip?._id === id ? null : state.activeTrip,
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete trip',
        isLoading: false
      });
      return false;
    }
  },

  clearActiveTrip: () => set({ activeTrip: null })
}));

export default useTripStore;


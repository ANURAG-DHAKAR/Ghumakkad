import { create } from 'zustand';
import api from '../services/api';

const useGalleryStore = create((set, get) => ({
  albums: [],
  photos: [],
  isLoading: false,
  error: null,

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/gallery/albums');
      set({ albums: data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to load albums', isLoading: false });
    }
  },

  fetchPhotos: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/gallery/photos');
      set({ photos: data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to load photos', isLoading: false });
    }
  },

  createAlbum: async (name, date) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/gallery/albums', { name });
      set(state => ({ albums: [data, ...state.albums], isLoading: false }));
      return data._id;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create album', isLoading: false });
      return null;
    }
  },

  uploadPhotos: async (albumId, files) => {
    if (!localStorage.getItem('aura_token')) return;
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('images', file);
      }
      if (albumId) formData.append('albumId', albumId);

      const { data } = await api.post('/gallery/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update states properly mapping array returns
      set(state => {
        const updatedAlbums = state.albums.map(a => 
          a._id === albumId 
            ? { ...a, photoCount: (a.photoCount || 0) + data.length, cover: (!a.cover || a.cover.includes('unsplash') || a.cover.includes('default')) ? data[0].url : a.cover } 
            : a
        );
        return { 
          photos: [...data, ...state.photos],
          albums: updatedAlbums,
          isLoading: false
        };
      });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to upload photo', isLoading: false });
      return false;
    }
  },

  deletePhoto: (photoId) => {
    set(state => ({
      photos: state.photos.filter(p => p._id !== photoId)
    }));
  },

  toggleLike: (photoId) => {
    set(state => ({
      photos: state.photos.map(p => {
        if (p._id === photoId) {
          return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
        }
        return p;
      })
    }));
  }
}));

export default useGalleryStore;

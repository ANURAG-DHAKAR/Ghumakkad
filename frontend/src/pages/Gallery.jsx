import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Heart, X, ChevronLeft, FolderPlus } from 'lucide-react';
import useGalleryStore from '../context/galleryStore';
import { useNavigate } from 'react-router-dom';
import './Gallery.css';

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="100%" height="100%" fill="#0f172a"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="20">
        Image not available
      </text>
    </svg>`
  );

const Gallery = () => {
  const { albums, photos, deletePhoto, toggleLike, fetchAlbums, fetchPhotos } = useGalleryStore();
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
    fetchPhotos();
  }, [fetchAlbums, fetchPhotos]);

  const handlePhotoClick = (photo) => setSelectedPhoto(photo);

  const albumPhotos = activeAlbum 
    ? photos.filter(p => p.albumId === activeAlbum._id)
    : [];

  return (
    <motion.div 
      className="page gallery-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="gallery-header">
        <div className="flex-between">
          <div className="flex-center" style={{gap: '10px'}}>
            {activeAlbum && (
              <button className="icon-btn" onClick={() => setActiveAlbum(null)}>
                <ChevronLeft size={24} />
              </button>
            )}
            <h2>{activeAlbum ? activeAlbum.name : 'Trip Albums'}</h2>
          </div>
          <button className="btn-primary upload-btn" onClick={() => navigate('/upload')}>
            <Upload size={18} /> Upload
          </button>
        </div>
        <p className="text-muted">
          {activeAlbum ? `${albumPhotos.length} memory found` : 'Organize and view your travel memories'}
        </p>
      </div>

      {!activeAlbum ? (
        // Albums View
        <div className="albums-grid">
          {albums.map(album => (
            <motion.div 
              key={album._id} 
              className="album-card"
              onClick={() => setActiveAlbum(album)}
              whileHover={{ y: -5 }}
            >
              <div className="album-cover">
                <img
                  src={album.cover || FALLBACK_IMG}
                  alt={album.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />
                <div className="album-meta-overlay">
                  <span className="photo-count">{album.photoCount} photos</span>
                </div>
              </div>
              <div className="album-info">
                <h3>{album.name}</h3>
                <p className="text-muted">{album.date}</p>
              </div>
            </motion.div>
          ))}
          <motion.div 
            className="album-card create-album-card flex-center col"
            onClick={() => navigate('/upload')}
            whileHover={{ scale: 1.02 }}
          >
            <FolderPlus size={32} color="var(--primary)" style={{marginBottom: '10px'}}/>
            <h4>New Trip Album</h4>
          </motion.div>
        </div>
      ) : (
        // Photos View inside Active Album
        <div className="masonry-grid">
          {albumPhotos.map((photo) => (
            <motion.div 
              key={photo._id} 
              layoutId={`photo-${photo._id}`}
              className="masonry-item" 
              onClick={() => handlePhotoClick(photo)}
            >
              <img
                src={photo.url || FALLBACK_IMG}
                alt="Travel memory"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMG;
                }}
              />
              <div className="photo-overlay">
                <div className="photo-actions">
                  <button className="icon-btn-small" onClick={(e) => { e.stopPropagation(); toggleLike(photo._id); }}>
                    <Heart size={16} fill={photo.liked ? 'white' : 'transparent'} color="white" />
                    <span className="like-count">{photo.likes}</span>
                  </button>
                  <button className="icon-btn-small delete" onClick={(e) => { e.stopPropagation(); deletePhoto(photo._id); }}>
                    <Trash2 size={16} color="white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {albumPhotos.length === 0 && (
            <div className="empty-state text-center" style={{padding: '50px', gridColumn: '1 / -1'}}>
              <p className="text-muted">No photos yet. Upload some memories!</p>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            className="fullscreen-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-backdrop" onClick={() => setSelectedPhoto(null)} />
            <div className="modal-controls">
              <button className="icon-btn modal-btn" onClick={() => setSelectedPhoto(null)}>
                <X size={24} />
              </button>
            </div>
            
            <motion.div 
              className="modal-content"
              layoutId={`photo-${selectedPhoto._id}`}
            >
              <img
                src={selectedPhoto.url || FALLBACK_IMG}
                alt="Fullscreen travel"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMG;
                }}
              />
              <div className="modal-caption glass-panel">
                <p>Location Tag Placeholder</p>
                <button className="icon-btn-small" onClick={(e) => { toggleLike(selectedPhoto._id); setSelectedPhoto({...selectedPhoto, liked: !selectedPhoto.liked}); }}>
                  <Heart size={20} fill={selectedPhoto.liked ? 'var(--primary)' : 'transparent'} color={selectedPhoto.liked ? 'var(--primary)' : 'white'} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ height: '100px' }}></div>
    </motion.div>
  );
};

export default Gallery;

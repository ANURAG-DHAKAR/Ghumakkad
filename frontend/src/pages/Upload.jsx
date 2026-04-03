import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, FolderPlus } from 'lucide-react';
import useGalleryStore from '../context/galleryStore';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [newAlbumName, setNewAlbumName] = useState('');
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);

  const { albums, createAlbum, uploadPhotos, fetchAlbums } = useGalleryStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  });

  const removeFile = (name) => {
    setFiles(files.filter(file => file.name !== name));
  };

  const handleCreateAlbumConfirm = async () => {
    if (!newAlbumName) return;
    const newId = await createAlbum(newAlbumName);
    if (newId) {
      setSelectedAlbum(newId);
      setIsCreatingAlbum(false);
      setNewAlbumName('');
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    if (!selectedAlbum) {
      alert('Please select or create an album.');
      return;
    }

    // Bulk upload them as one massive array
    await uploadPhotos(selectedAlbum, files);
    navigate('/gallery');
  };

  return (
    <motion.div 
      className="page upload-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="page-header text-center">
        <h2>Upload Memories</h2>
        <p className="text-muted">Save your travel photos to the gallery</p>
      </div>

      <div className="upload-container glass-panel">
        <label className="section-label">Select Album</label>
        <div className="album-selector">
          {!isCreatingAlbum ? (
            <div className="flex-between">
              <select 
                value={selectedAlbum} 
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="select-dropdown"
              >
                <option value="">-- Choose Album --</option>
                {albums.map(a => (
                  <option key={a._id} value={a._id}>{a.name}</option>
                ))}
              </select>
              <button 
                className="btn-secondary" 
                onClick={() => setIsCreatingAlbum(true)}
                style={{ padding: '10px', marginLeft: '10px' }}
              >
                <FolderPlus size={18} /> New
              </button>
            </div>
          ) : (
            <div className="flex-between gap-10">
              <input 
                type="text" 
                placeholder="New album name..." 
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                className="create-input"
                autoFocus
              />
              <div className="flex-center" style={{gap: '10px'}}>
                <button className="btn-primary" onClick={handleCreateAlbumConfirm}>OK</button>
                <button className="btn-secondary" onClick={() => { setIsCreatingAlbum(false); setNewAlbumName(''); }}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <UploadCloud size={40} color={isDragActive ? 'var(--primary)' : 'var(--text-muted)'} />
          {isDragActive ? (
            <p className="text-gradient">Drop the files here...</p>
          ) : (
            <p>Drag & drop travel photos here, or click to select</p>
          )}
        </div>

        {files.length > 0 && (
          <div className="preview-section">
            <h4>Ready to Upload ({files.length})</h4>
            <div className="preview-grid">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div 
                    key={file.name}
                    className="preview-item"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <img src={file.preview} alt="preview" />
                    <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}>
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {files.length > 0 && (
          <button className="btn-primary upload-submit" onClick={handleUpload}>
            <UploadCloud size={18} /> Upload to Gallery
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Upload;

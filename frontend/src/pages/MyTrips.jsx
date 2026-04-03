import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Pencil, MapPin, Calendar, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useTripStore from '../context/tripStore';
import useAuthStore from '../context/authStore';
import './Trips.css';

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString();
}

const MyTrips = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { trips, fetchTrips, deleteTrip, isLoading, error } = useTripStore();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  if (!user) {
    return (
      <div className="page trips-page">
        <div className="page-header">
          <h2>My Trips</h2>
          <p className="text-muted">Login to create and manage trips.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/auth')}>Login</button>
      </div>
    );
  }

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this trip? This cannot be undone.');
    if (!ok) return;
    await deleteTrip(id);
  };

  return (
    <motion.div
      className="page trips-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="trips-header flex-between">
        <div>
          <h2>My Trips</h2>
          <p className="text-muted">Create, edit, and organize your itineraries.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/trips/new')}>
          <Plus size={18} /> Add Trip
        </button>
      </div>

      {error && (
        <div className="glass-panel trip-alert" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-muted" style={{ marginTop: 20 }}>Loading trips...</div>
      ) : trips.length === 0 ? (
        <div className="glass-panel empty-trips">
          <p className="text-muted">No trips yet. Create your first one.</p>
          <button className="btn-primary" onClick={() => navigate('/trips/new')}>
            <Plus size={18} /> Create Trip
          </button>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((t) => (
            <div key={t._id} className="glass-panel trip-card">
              <div className="trip-card-top" onClick={() => navigate(`/trips/${t._id}`)} role="button" tabIndex={0}>
                <div className="trip-title">
                  <MapPin size={18} color="var(--primary)" />
                  <h3>{t.destination}</h3>
                </div>
                <div className="trip-meta">
                  <div className="meta-row">
                    <Calendar size={14} color="var(--text-muted)" />
                    <span className="text-muted">{formatDate(t.startDate)} – {formatDate(t.endDate)}</span>
                  </div>
                  <div className="meta-row">
                    <IndianRupee size={14} color="var(--text-muted)" />
                    <span className="text-muted">{Number(t.budget).toLocaleString()}</span>
                    <span className="text-muted">· {t.days} days</span>
                  </div>
                </div>
              </div>

              <div className="trip-card-actions">
                <button className="btn-secondary" onClick={() => navigate(`/trips/${t._id}?edit=1`)}>
                  <Pencil size={16} /> Edit
                </button>
                <button className="btn-secondary danger" onClick={() => handleDelete(t._id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ height: '100px' }} />
    </motion.div>
  );
};

export default MyTrips;


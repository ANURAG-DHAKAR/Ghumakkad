import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Pencil, Trash2, Calendar, IndianRupee, MapPin } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import useTripStore from '../context/tripStore';
import useAuthStore from '../context/authStore';
import './Trips.css';

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString();
}

const TripDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const edit = searchParams.get('edit') === '1';

  const { user } = useAuthStore();
  const { activeTrip, fetchTripById, deleteTrip, isLoading, error } = useTripStore();
  const [localTrip, setLocalTrip] = useState(null);

  useEffect(() => {
    (async () => {
      const t = await fetchTripById(id);
      setLocalTrip(t);
    })();
  }, [id, fetchTripById]);

  useEffect(() => {
    if (edit) navigate(`/trips/${id}/edit`);
  }, [edit, id, navigate]);

  const trip = localTrip || activeTrip;

  const itinerary = useMemo(() => {
    if (!trip?.itinerary || !Array.isArray(trip.itinerary)) return [];
    return [...trip.itinerary].sort((a, b) => (a.day || 0) - (b.day || 0));
  }, [trip]);

  if (!user) {
    return (
      <div className="page trips-page">
        <div className="page-header">
          <h2>Trip Details</h2>
          <p className="text-muted">Login to view your trips.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/auth')}>Login</button>
      </div>
    );
  }

  const handleDelete = async () => {
    const ok = window.confirm('Delete this trip? This cannot be undone.');
    if (!ok) return;
    const success = await deleteTrip(id);
    if (success) navigate('/trips');
  };

  return (
    <motion.div
      className="page trips-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="trips-header flex-between">
        <button className="btn-secondary" onClick={() => navigate('/trips')}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex-center" style={{ gap: 10 }}>
          <button className="btn-secondary" onClick={() => navigate(`/trips/${id}/edit`)}>
            <Pencil size={16} /> Edit
          </button>
          <button className="btn-secondary danger" onClick={handleDelete}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-panel trip-alert" role="alert">
          {error}
        </div>
      )}

      {!trip || isLoading ? (
        <div className="text-muted" style={{ marginTop: 20 }}>Loading trip...</div>
      ) : (
        <>
          <div className="glass-panel trip-details">
            <div className="trip-title">
              <MapPin size={20} color="var(--primary)" />
              <h2 style={{ margin: 0 }}>{trip.destination}</h2>
            </div>

            <div className="trip-detail-grid">
              <div className="detail-item">
                <Calendar size={16} color="var(--text-muted)" />
                <div>
                  <div className="detail-label text-muted">Dates</div>
                  <div className="detail-value">{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</div>
                </div>
              </div>

              <div className="detail-item">
                <IndianRupee size={16} color="var(--text-muted)" />
                <div>
                  <div className="detail-label text-muted">Budget</div>
                  <div className="detail-value">{Number(trip.budget).toLocaleString()}</div>
                </div>
              </div>

              <div className="detail-item">
                <div style={{ width: 16 }} />
                <div>
                  <div className="detail-label text-muted">Days</div>
                  <div className="detail-value">{trip.days}</div>
                </div>
              </div>
            </div>

            {trip.description ? (
              <div style={{ marginTop: 14 }}>
                <div className="detail-label text-muted">Description</div>
                <div className="detail-value">{trip.description}</div>
              </div>
            ) : null}
          </div>

          <div className="glass-panel itinerary-panel">
            <h3 style={{ marginTop: 0 }}>Itinerary</h3>
            {itinerary.length === 0 ? (
              <p className="text-muted">No itinerary yet. Edit the trip to add one (or enable auto-generate).</p>
            ) : (
              <div className="itinerary-list">
                {itinerary.map((d, idx) => (
                  <div key={`${d.day}-${idx}`} className="itinerary-day">
                    <div className="itinerary-day-head">
                      <span className="day-pill">Day {d.day}</span>
                      <span className="text-muted">{d.title || ''}</span>
                    </div>
                    {Array.isArray(d.activities) && d.activities.length > 0 ? (
                      <ul className="itinerary-activities">
                        {d.activities.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted" style={{ margin: '8px 0 0' }}>No activities set.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div style={{ height: '100px' }} />
    </motion.div>
  );
};

export default TripDetails;


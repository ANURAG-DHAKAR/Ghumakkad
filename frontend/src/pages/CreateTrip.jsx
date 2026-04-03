import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Save, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import useTripStore from '../context/tripStore';
import useAuthStore from '../context/authStore';
import './Trips.css';

function isValidDate(value) {
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

function daysInclusive(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const ms = e.getTime() - s.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000)) + 1;
}

const CreateTrip = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthStore();
  const { createTrip, updateTrip, fetchTripById, activeTrip, clearActiveTrip, isLoading, error } = useTripStore();

  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [useAi, setUseAi] = useState(false);

  const computedDays = useMemo(() => {
    if (!startDate || !endDate) return '';
    if (!isValidDate(startDate) || !isValidDate(endDate)) return '';
    const d = daysInclusive(startDate, endDate);
    return d > 0 ? d : '';
  }, [startDate, endDate]);

  useEffect(() => {
    if (mode !== 'edit') return;
    if (!id) return;

    (async () => {
      const t = await fetchTripById(id);
      if (!t) return;
      setDestination(t.destination || '');
      setBudget(t.budget ?? '');
      setStartDate(t.startDate ? String(t.startDate).slice(0, 10) : '');
      setEndDate(t.endDate ? String(t.endDate).slice(0, 10) : '');
      setDescription(t.description || '');
    })();

    return () => clearActiveTrip();
  }, [mode, id, fetchTripById, clearActiveTrip]);

  if (!user) {
    return (
      <div className="page trips-page">
        <div className="page-header">
          <h2>Create Trip</h2>
          <p className="text-muted">Login to create trips.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/auth')}>Login</button>
      </div>
    );
  }

  const validate = () => {
    if (!destination.trim()) return 'Destination is required';
    const b = Number(budget);
    if (!Number.isFinite(b)) return 'Budget must be a number';
    if (!startDate || !endDate) return 'Start and end dates are required';
    if (!isValidDate(startDate) || !isValidDate(endDate)) return 'Dates must be valid';
    if (new Date(endDate) < new Date(startDate)) return 'End date must be on or after start date';
    return null;
  };

  const generateItineraryStub = () => {
    // Optional AI placeholder: we generate a simple day-wise skeleton.
    const d = Number(computedDays) || 0;
    if (!d) return [];
    return Array.from({ length: d }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}`,
      activities: ['Morning: Explore local area', 'Afternoon: Main attraction', 'Evening: Food + rest']
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    const payload = {
      destination: destination.trim(),
      budget: Number(budget),
      startDate,
      endDate,
      days: Number(computedDays) || undefined,
      description,
      itinerary: useAi ? generateItineraryStub() : []
    };

    if (mode === 'edit') {
      const updated = await updateTrip(id, payload);
      if (updated) navigate(`/trips/${updated._id}`);
      return;
    }

    const created = await createTrip(payload);
    if (created) navigate(`/trips/${created._id}`);
  };

  return (
    <motion.div
      className="page trips-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="trips-header flex-between">
        <button className="btn-secondary" onClick={() => navigate('/trips')}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ textAlign: 'right' }}>
          <h2>{mode === 'edit' ? 'Edit Trip' : 'Create Trip'}</h2>
          <p className="text-muted">Plan your trip with dates, budget, and notes.</p>
        </div>
      </div>

      {error && (
        <div className="glass-panel trip-alert" role="alert">
          {error}
        </div>
      )}

      <form className="glass-panel trip-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Destination *</label>
          <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Manali, Himachal Pradesh" />
        </div>

        <div className="form-grid">
          <div className="form-row">
            <label>Budget *</label>
            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              inputMode="decimal"
              placeholder="e.g. 25000"
            />
          </div>

          <div className="form-row">
            <label>Start Date *</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="form-row">
            <label>End Date *</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="form-row">
            <label>Days</label>
            <input value={computedDays} readOnly placeholder="Auto" />
          </div>
        </div>

        <div className="form-row">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Notes, preferences, goals..." rows={4} />
        </div>

        <div className="form-row">
          <label className="checkbox-row">
            <input type="checkbox" checked={useAi} onChange={(e) => setUseAi(e.target.checked)} />
            <span className="flex-center" style={{ gap: 8 }}>
              <Sparkles size={16} color="var(--primary)" />
              Auto-generate itinerary (basic)
            </span>
          </label>
          <p className="text-muted" style={{ marginTop: 6 }}>
            This is a simple generator stub for now. We can wire real AI later.
          </p>
        </div>

        <button className="btn-primary" type="submit" disabled={isLoading}>
          <Save size={18} /> {isLoading ? 'Saving...' : 'Save Trip'}
        </button>
      </form>

      <div style={{ height: '100px' }} />
    </motion.div>
  );
};

export default CreateTrip;


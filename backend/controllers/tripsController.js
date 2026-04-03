const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Trip = require('../models/Trip');

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  // Invalid Date check
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function computeDaysInclusive(startDate, endDate) {
  const ms = endDate.getTime() - startDate.getTime();
  const days = Math.floor(ms / (24 * 60 * 60 * 1000)) + 1;
  return days;
}

// @desc    Create trip
// @route   POST /api/trips
// @access  Private
const createTrip = asyncHandler(async (req, res) => {
  const { destination, budget, startDate, endDate, days, description, itinerary } = req.body;

  if (!destination || !String(destination).trim()) {
    res.status(400);
    throw new Error('Destination is required');
  }

  const parsedBudget = Number(budget);
  if (!Number.isFinite(parsedBudget) || parsedBudget < 0) {
    res.status(400);
    throw new Error('Budget must be a valid number');
  }

  const parsedStart = parseDate(startDate);
  const parsedEnd = parseDate(endDate);
  if (!parsedStart || !parsedEnd) {
    res.status(400);
    throw new Error('Start date and end date must be valid');
  }
  if (parsedEnd < parsedStart) {
    res.status(400);
    throw new Error('End date must be on or after start date');
  }

  const computedDays = computeDaysInclusive(parsedStart, parsedEnd);
  const parsedDays = days === undefined || days === null || days === '' ? computedDays : Number(days);
  if (!Number.isFinite(parsedDays) || parsedDays <= 0) {
    res.status(400);
    throw new Error('Days must be a valid number');
  }

  const normalizedItinerary = Array.isArray(itinerary)
    ? itinerary
        .filter(Boolean)
        .map((d) => ({
          day: Number(d.day) || 1,
          title: typeof d.title === 'string' ? d.title : '',
          activities: Array.isArray(d.activities) ? d.activities.filter((a) => typeof a === 'string') : []
        }))
    : [];

  const trip = await Trip.create({
    userId: req.user._id,
    destination: String(destination).trim(),
    budget: parsedBudget,
    startDate: parsedStart,
    endDate: parsedEnd,
    days: parsedDays,
    description: typeof description === 'string' ? description : '',
    itinerary: normalizedItinerary
  });

  res.status(201).json(trip);
});

// @desc    Get current user's trips
// @route   GET /api/trips
// @access  Private
const getTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(trips);
});

// @desc    Get trip by id (user scoped)
// @route   GET /api/trips/:id
// @access  Private
const getTripById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error('Invalid trip id');
  }

  const trip = await Trip.findOne({ _id: id, userId: req.user._id });
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  res.status(200).json(trip);
});

// @desc    Update trip (user scoped)
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error('Invalid trip id');
  }

  const existing = await Trip.findOne({ _id: id, userId: req.user._id });
  if (!existing) {
    res.status(404);
    throw new Error('Trip not found');
  }

  const next = { ...req.body };

  if (next.destination !== undefined) {
    if (!next.destination || !String(next.destination).trim()) {
      res.status(400);
      throw new Error('Destination is required');
    }
    existing.destination = String(next.destination).trim();
  }

  if (next.budget !== undefined) {
    const parsedBudget = Number(next.budget);
    if (!Number.isFinite(parsedBudget) || parsedBudget < 0) {
      res.status(400);
      throw new Error('Budget must be a valid number');
    }
    existing.budget = parsedBudget;
  }

  if (next.startDate !== undefined) {
    const parsedStart = parseDate(next.startDate);
    if (!parsedStart) {
      res.status(400);
      throw new Error('Start date must be valid');
    }
    existing.startDate = parsedStart;
  }

  if (next.endDate !== undefined) {
    const parsedEnd = parseDate(next.endDate);
    if (!parsedEnd) {
      res.status(400);
      throw new Error('End date must be valid');
    }
    existing.endDate = parsedEnd;
  }

  if (existing.startDate && existing.endDate && existing.endDate < existing.startDate) {
    res.status(400);
    throw new Error('End date must be on or after start date');
  }

  // If days explicitly provided, validate it; otherwise keep existing days.
  if (next.days !== undefined) {
    const parsedDays = Number(next.days);
    if (!Number.isFinite(parsedDays) || parsedDays <= 0) {
      res.status(400);
      throw new Error('Days must be a valid number');
    }
    existing.days = parsedDays;
  } else if (next.startDate !== undefined || next.endDate !== undefined) {
    // Auto-recompute days if dates changed and days not explicitly provided.
    existing.days = computeDaysInclusive(existing.startDate, existing.endDate);
  }

  if (next.description !== undefined) {
    existing.description = typeof next.description === 'string' ? next.description : '';
  }

  if (next.itinerary !== undefined) {
    existing.itinerary = Array.isArray(next.itinerary)
      ? next.itinerary
          .filter(Boolean)
          .map((d) => ({
            day: Number(d.day) || 1,
            title: typeof d.title === 'string' ? d.title : '',
            activities: Array.isArray(d.activities) ? d.activities.filter((a) => typeof a === 'string') : []
          }))
      : [];
  }

  const saved = await existing.save();
  res.status(200).json(saved);
});

// @desc    Delete trip (user scoped)
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error('Invalid trip id');
  }

  const trip = await Trip.findOne({ _id: id, userId: req.user._id });
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }

  await trip.deleteOne();
  res.status(200).json({ message: 'Trip deleted' });
});

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip
};


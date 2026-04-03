const asyncHandler = require('express-async-handler');
const Trip = require('../models/Trip');

// @desc    Create a new trip
// @route   POST /api/trip/create
// @access  Private
const createTrip = asyncHandler(async (req, res) => {
  const { destination, days, budget, itinerary, startDate, endDate, description } = req.body;

  if (!destination || !days || !budget) {
    res.status(400);
    throw new Error('Please provide destination, days, and budget');
  }

  const trip = await Trip.create({
    userId: req.user._id,
    destination,
    days,
    budget,
    startDate: startDate || new Date(),
    endDate: endDate || new Date(),
    description: description || '',
    itinerary: itinerary || []
  });

  res.status(201).json(trip);
});

// @desc    Get user trips
// @route   GET /api/trip/user
// @access  Private
const getUserTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(trips);
});

// @desc    Delete a trip
// @route   DELETE /api/trip/:id
// @access  Private
const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (trip) {
    // Check if the trip belongs to the user
    if (trip.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this trip');
    }

    await trip.deleteOne();
    res.json({ message: 'Trip removed' });
  } else {
    res.status(404);
    throw new Error('Trip not found');
  }
});

module.exports = {
  createTrip,
  getUserTrips,
  deleteTrip
};

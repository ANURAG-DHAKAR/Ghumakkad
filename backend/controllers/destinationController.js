const asyncHandler = require('express-async-handler');
const Destination = require('../models/Destination');

// @desc    Fetch all destinations
// @route   GET /api/destinations
// @access  Public
const getDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find({});
  res.json(destinations);
});

// @desc    Search destinations by text
// @route   GET /api/destinations/search?q=
// @access  Public
const searchDestinations = asyncHandler(async (req, res) => {
  const keyword = req.query.q;
  if (!keyword) {
    res.json([]);
    return;
  }
  
  // Using $text for full-text search as configured in the schema
  const destinations = await Destination.find({
    $text: { $search: keyword }
  }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
  
  res.json(destinations);
});

// @desc    Filter destinations
// @route   GET /api/destinations/filter
// @access  Public
const filterDestinations = asyncHandler(async (req, res) => {
  const { category, minBudget, maxBudget, minRating } = req.query;
  
  let filter = {};
  if (category) filter.category = category;
  if (minBudget || maxBudget) {
    filter.budgetEstimate = {};
    if (minBudget) filter.budgetEstimate.$gte = Number(minBudget);
    if (maxBudget) filter.budgetEstimate.$lte = Number(maxBudget);
  }
  if (minRating) {
    filter.rating = { $gte: Number(minRating) };
  }

  const destinations = await Destination.find(filter);
  res.json(destinations);
});

// @desc    Fetch single destination
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (destination) {
    res.json(destination);
  } else {
    res.status(404);
    throw new Error('Destination not found');
  }
});

module.exports = {
  getDestinations,
  getDestinationById,
  searchDestinations,
  filterDestinations
};

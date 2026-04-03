const asyncHandler = require('express-async-handler');
const Destination = require('../models/Destination');

// @desc    Plan trip using AI (Placeholder)
// @route   POST /api/ai/plan-trip
// @access  Private
const planTripAI = asyncHandler(async (req, res) => {
  // Integration with OpenAI/Gemini goes here
  const { destination, days, budget } = req.body;
  res.json({ message: `AI planned a ${days}-day trip to ${destination} with a budget of ${budget}` });
});

// @desc    Chat with travel AI (Placeholder)
// @route   POST /api/ai/chat
// @access  Private
const chatAI = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  res.json({ reply: `AI response to: ${prompt}` });
});

// @desc    Get nearby locations (Geolocation queries)
// @route   GET /api/location/nearby
// @access  Public
const getNearbyLocations = asyncHandler(async (req, res) => {
  const { lat, lng, maxDistance = 50 } = req.query; // maxDistance in miles or km

  if (!lat || !lng) {
    res.status(400);
    throw new Error('Please provide lat and lng');
  }

  // Using MongoDB $geoWithin or $nearSphere. 
  // Wait, our schema currently uses a 2d index on `coordinates.lat` / `coordinates.lng`.
  // Here we use standard $near query. 
  const distanceMultiplier = 1 / 69; // rough approx miles to coordinate degrees
  
  const destinations = await Destination.find({
    coordinates: {
      $near: [Number(lng), Number(lat)],
      $maxDistance: Number(maxDistance) * distanceMultiplier
    }
  });

  res.json(destinations);
});

// @desc    Get weather (Placeholder)
// @route   GET /api/weather
// @access  Public
const getWeather = asyncHandler(async (req, res) => {
  const { targetLocation } = req.query;
  res.json({ location: targetLocation, temperature: 72, condition: 'Sunny' });
});

// @desc    Calculate budget (Placeholder)
// @route   POST /api/budget/calculate
// @access  Private
const calculateBudget = asyncHandler(async (req, res) => {
  const { tripConfiguration } = req.body;
  res.json({ estimatedCost: 1500, currency: 'USD', breakdown: { flight: 500, hotel: 700, food: 300 } });
});

module.exports = {
  planTripAI,
  chatAI,
  getNearbyLocations,
  getWeather,
  calculateBudget
};

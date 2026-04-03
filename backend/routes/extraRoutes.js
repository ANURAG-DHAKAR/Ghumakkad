const express = require('express');
const router = express.Router();
const {
  planTripAI,
  chatAI,
  getNearbyLocations,
  getWeather,
  calculateBudget
} = require('../controllers/extraController');
const { protect } = require('../middleware/authMiddleware');

// AI Routes
router.post('/ai/plan-trip', protect, planTripAI);
router.post('/ai/chat', protect, chatAI);

// Location Routes
router.get('/location/nearby', getNearbyLocations);

// Utility Routes
router.get('/weather', getWeather);
router.post('/budget/calculate', protect, calculateBudget);

module.exports = router;

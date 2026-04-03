const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip
} = require('../controllers/tripsController');

router.route('/').post(protect, createTrip).get(protect, getTrips);
router.route('/:id').get(protect, getTripById).put(protect, updateTrip).delete(protect, deleteTrip);

module.exports = router;


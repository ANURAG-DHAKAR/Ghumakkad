const express = require('express');
const router = express.Router();
const {
  createTrip,
  getUserTrips,
  deleteTrip
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.route('/create').post(protect, createTrip);
router.route('/user').get(protect, getUserTrips);
router.route('/:id').delete(protect, deleteTrip);

module.exports = router;

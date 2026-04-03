const express = require('express');
const router = express.Router();
const { createReview, getDestinationReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createReview);
router.route('/:destinationId').get(getDestinationReviews);

module.exports = router;

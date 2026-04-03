const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Destination = require('../models/Destination');

// @desc    Create a review for a destination
// @route   POST /api/review
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { destinationId, rating, comment } = req.body;

  if (!destinationId || !rating) {
    res.status(400);
    throw new Error('Please provide destinationId and rating');
  }

  const destination = await Destination.findById(destinationId);
  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }

  // Optional: check if user already reviewed
  const alreadyReviewed = await Review.findOne({ userId: req.user._id, destinationId });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this destination');
  }

  const review = await Review.create({
    userId: req.user._id,
    destinationId,
    rating,
    comment
  });

  // Basic update of Destination rating
  const reviews = await Review.find({ destinationId });
  const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
  destination.rating = Number((totalRating / reviews.length).toFixed(1));
  await destination.save();

  res.status(201).json(review);
});

// @desc    Get reviews for a destination
// @route   GET /api/review/:destinationId
// @access  Public
const getDestinationReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ destinationId: req.params.destinationId }).populate('userId', 'name profileImage');
  res.json(reviews);
});

module.exports = {
  createReview,
  getDestinationReviews
};

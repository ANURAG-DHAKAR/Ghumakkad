const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/user/update
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.profileImage = req.body.profileImage || user.profileImage;
    
    // Updates for travelStats if provided
    if (req.body.travelStats) {
      if (req.body.travelStats.citiesVisited !== undefined) {
        user.travelStats.citiesVisited = req.body.travelStats.citiesVisited;
      }
      if (req.body.travelStats.totalTrips !== undefined) {
        user.travelStats.totalTrips = req.body.travelStats.totalTrips;
      }
      if (req.body.travelStats.distance !== undefined) {
        user.travelStats.distance = req.body.travelStats.distance;
      }
    }

    if (req.body.password) {
      user.password = req.body.password; // pre-save hook will hash it
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
      travelStats: updatedUser.travelStats
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user wishlist
// @route   GET /api/user/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add to wishlist
// @route   POST /api/user/wishlist/add
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { destinationId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    if (!user.wishlist.includes(destinationId)) {
      user.wishlist.push(destinationId);
      await user.save();
    }
    // Populate to return updated full wishlist data
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json(updatedUser.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Remove from wishlist
// @route   DELETE /api/user/wishlist/remove
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { destinationId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    user.wishlist = user.wishlist.filter(id => id.toString() !== destinationId);
    await user.save();
    
    // Populate to return updated full wishlist data
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json(updatedUser.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist
};

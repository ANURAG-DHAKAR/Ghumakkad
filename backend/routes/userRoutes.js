const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  updateUserProfile, 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, getUserProfile);
router.route('/update').put(protect, updateUserProfile);

router.route('/wishlist').get(protect, getWishlist);
router.route('/wishlist/add').post(protect, addToWishlist);
// Optional: If you prefer route params, it would be /wishlist/:id, but prompt says /wishlist/remove
router.route('/wishlist/remove').delete(protect, removeFromWishlist);

module.exports = router;

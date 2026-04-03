const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getDestinationById,
  searchDestinations,
  filterDestinations
} = require('../controllers/destinationController');

router.route('/').get(getDestinations);

// Notice: 'search' and 'filter' must come before '/:id' to prevent them from being treated as an id
router.route('/search').get(searchDestinations);
router.route('/filter').get(filterDestinations);

router.route('/:id').get(getDestinationById);

module.exports = router;

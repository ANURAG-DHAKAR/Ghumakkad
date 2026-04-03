const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  budgetEstimate: {
    type: Number
  },
  bestTimeToVisit: {
    type: String
  },
  category: {
    type: String,
    enum: ['mountain', 'beach', 'city']
  },
  coordinates: {
    // MongoDB supports '2d' index on objects with two numeric fields like lon/lat
    lng: { type: Number },
    lat: { type: Number }
  }
}, { timestamps: true });

// Text index for full-text search on name
destinationSchema.index({ name: 'text' });

// 2d Index for geolocation queries (nearby places)
destinationSchema.index({ coordinates: '2d' });

const Destination = mongoose.model('Destination', destinationSchema);
module.exports = Destination;

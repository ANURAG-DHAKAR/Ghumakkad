const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  days: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  itinerary: [{
    day: { type: Number, required: true },
    title: { type: String, default: '' },
    activities: [{ type: String }]
  }],
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;

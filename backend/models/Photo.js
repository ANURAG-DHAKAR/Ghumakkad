const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  },
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  locationTag: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);

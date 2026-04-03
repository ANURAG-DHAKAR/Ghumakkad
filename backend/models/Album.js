const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cover: {
    type: String,
    default: 'https://images.unsplash.com/photo-1493976040373-c1c5005be4b2?auto=format&fit=crop&w=600&q=80'
  },
  photoCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);

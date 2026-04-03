const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    index: true // added index for email as requested
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  profileImage: {
    type: String
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }],
  savedTrips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  }],
  travelStats: {
    citiesVisited: {
      type: Number,
      default: 0
    },
    totalTrips: {
      type: Number,
      default: 0
    },
    distance: {
      type: Number,
      default: 0
    }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;

const mongoose = require('mongoose');

const homeSchema = mongoose.Schema({
  houseName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  photo: String,
  rules: String,
  description: String,
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  maxGuests: {
    type: Number,
    default: 4,
    min: 1,
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
});

module.exports = mongoose.model('Home', homeSchema);
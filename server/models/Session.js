const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    default: 'anonymous'
  },
  audioFileName: String,
  audioSize: Number,
  transcript: String,
  isUrgent: {
    type: Boolean,
    default: false
  },
  safetyFlags: [String],
  botResponse: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Session', sessionSchema);
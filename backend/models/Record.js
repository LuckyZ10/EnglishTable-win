const mongoose = require('mongoose');
const recordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true
  },
  translation: {
    type: String,
    trim: true
  },
  example: {
    type: String,
    trim: true
  },
  note: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Record', recordSchema);
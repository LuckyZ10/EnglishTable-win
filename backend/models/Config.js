const mongoose = require('mongoose');
const configSchema = new mongoose.Schema({
  userRole: {
    type: String,
    default: 'admin'
  },
  theme: {
    type: String,
    default: 'light'
  },
  provider: {
    type: String,
    default: 'local'
  },
  key: {
    type: String,
    trim: true
  },
  deepseekModelType: {
    type: String,
    default: 'chat'
  }
});

module.exports = mongoose.model('Config', configSchema);
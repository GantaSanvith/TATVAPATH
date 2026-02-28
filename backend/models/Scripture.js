const mongoose = require('mongoose');

const scriptureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true       // e.g. "Bhagavad Gita"
  },
  description: {
    type: String         // Short intro about the scripture
  },
  icon: {
    type: String         // Emoji icon e.g. "🕉️"
  },
  totalVerses: {
    type: Number,
    default: 0
  },
  totalAdhyayas: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Scripture', scriptureSchema);
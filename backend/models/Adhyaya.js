const mongoose = require('mongoose');

const adhyayaSchema = new mongoose.Schema({
  scriptureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scripture',    // Links to Scripture model
    required: true
  },
  number: {
    type: Number,
    required: true       // Chapter number e.g. 1, 2, 3
  },
  title: {
    type: String,
    required: true       // e.g. "Arjuna Vishada Yoga"
  },
  description: {
    type: String
  },
  totalVerses: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Adhyaya', adhyayaSchema);
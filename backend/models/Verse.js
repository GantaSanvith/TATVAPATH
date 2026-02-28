const mongoose = require('mongoose');

const verseSchema = new mongoose.Schema({
  adhyayaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adhyaya',
    required: true
  },
  scriptureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scripture',
    required: true
  },
  verseNumber: {
    type: Number,
    required: true
  },
  sanskrit: {
    type: String,        // Original Sanskrit text
    required: true
  },
  transliteration: {
    type: String         // Roman script pronunciation
  },
  meaning: {
    type: String,        // English meaning
    required: true
  },
  meaningHindi: {
    type: String         // Hindi meaning (optional)
  },
  audioUrl: {
    type: String         // URL to audio recitation file
  }
}, { timestamps: true });

module.exports = mongoose.model('Verse', verseSchema);
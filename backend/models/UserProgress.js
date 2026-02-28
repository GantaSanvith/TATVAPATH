const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Verse',
    required: true
  },
  scriptureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scripture',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  attemptedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Prevent duplicate entries — one record per user per verse
userProgressSchema.index({ userId: 1, verseId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
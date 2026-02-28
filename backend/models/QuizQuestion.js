const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  verseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Verse',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  optionA: { type: String, required: true },
  optionB: { type: String, required: true },
  optionC: { type: String, required: true },
  optionD: { type: String, required: true },
  correctOption: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],  // Only these values allowed
    required: true
  },
  points: {
    type: Number,
    default: 50              // Each correct answer = 50 points
  }
}, { timestamps: true });

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
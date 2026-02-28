const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,       // Can't register without a name
      trim: true            // Removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,         // No two users can have same email
      lowercase: true       // Stores email in lowercase always
    },
    password: {
      type: String,
      required: true
    },
    totalPoints: {
      type: Number,
      default: 0            // New users start with 0 points
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,           // Track last day user completed a verse
      default: null
    },
    isAdmin: {
  type: Boolean,
  default: false
}
  },
  {
    timestamps: true        // Auto adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('User', userSchema);
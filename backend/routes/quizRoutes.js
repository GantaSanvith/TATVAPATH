const express = require('express');
const router = express.Router();
const { getQuizQuestions, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

// ✅ Specific routes FIRST
router.post('/submit', protect, submitQuiz);

// ✅ Dynamic routes LAST
router.get('/:verseId', protect, getQuizQuestions);

module.exports = router;

const mongoose = require('mongoose');
const QuizQuestion = require('../models/QuizQuestion');
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');
const Verse = require('../models/Verse');

// GET quiz questions for a verse
const getQuizQuestions = async (req, res) => {
  try {
    const verseId = req.params.verseId;

    // Validate ID format before using it
    if (!mongoose.Types.ObjectId.isValid(verseId)) {
      return res.status(400).json({ message: 'Invalid verse ID format' });
    }

    const questions = await QuizQuestion.aggregate([
      { $match: { verseId: new mongoose.Types.ObjectId(verseId) } },
      { $sample: { size: 3 } }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this verse' });
    }

    // Remove correct answer before sending to frontend
    const safeQuestions = questions.map(q => ({
      _id: q._id,
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      points: q.points
    }));

    res.json(safeQuestions);

  } catch (error) {
    console.error('getQuizQuestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST submit quiz answer
const submitQuiz = async (req, res) => {
  try {
    const { questionId, selectedOption, verseId } = req.body;
    const userId = req.user._id;

    // Clean the IDs
    const cleanVerseId = verseId.trim();
    const cleanQuestionId = questionId.trim();

    // 1. Find the question
    const question = await QuizQuestion.findById(cleanQuestionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // 2. Find the verse
    const verse = await Verse.findById(cleanVerseId);
    if (!verse) {
      return res.status(404).json({ message: 'Verse not found' });
    }

    // 3. Check answer
    const isCorrect = question.correctOption === selectedOption.trim();

    if (!isCorrect) {
      return res.json({
        correct: false,
        pointsEarned: 0,
        message: 'Incorrect. Try again!'
      });
    }

    // 4. Convert to ObjectId for queries
    const verseObjectId = new mongoose.Types.ObjectId(cleanVerseId);

    // 5. Check if already completed
    const existingProgress = await UserProgress.findOne({
      userId,
      verseId: verseObjectId
    });

    if (existingProgress && existingProgress.completed) {
      return res.json({
        correct: true,
        pointsEarned: 0,
        message: 'Already completed this verse!'
      });
    }

    // 6. Save progress
    await UserProgress.findOneAndUpdate(
      { userId, verseId: verseObjectId },
      {
        userId,
        verseId: verseObjectId,
        scriptureId: verse.scriptureId,
        completed: true,
        pointsEarned: question.points,
        attemptedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // 7. Add points to user
    await User.findByIdAndUpdate(userId, {
      $inc: { totalPoints: question.points }
    });

    // 8. Update streak
    await updateStreak(userId);

    return res.json({
      correct: true,
      pointsEarned: question.points,
      message: `Correct! +${question.points} points`
    });

  } catch (error) {
    console.error('submitQuiz error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper — update streak
const updateStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = user.lastActiveDate
      ? new Date(user.lastActiveDate)
      : null;

    if (!lastActive) {
      await User.findByIdAndUpdate(userId, {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: new Date()
      });
      return;
    }

    lastActive.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (today - lastActive) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return; // Already active today, no change
    } else if (diffDays === 1) {
      // Continue streak
      const newStreak = user.currentStreak + 1;
      await User.findByIdAndUpdate(userId, {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, user.longestStreak),
        lastActiveDate: new Date()
      });
    } else {
      // Missed a day, reset streak
      await User.findByIdAndUpdate(userId, {
        currentStreak: 1,
        lastActiveDate: new Date()
      });
    }
  } catch (error) {
    console.error('updateStreak error:', error);
  }
};

module.exports = { getQuizQuestions, submitQuiz };
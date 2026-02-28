const Scripture = require('../models/Scripture');
const Adhyaya = require('../models/Adhyaya');
const Verse = require('../models/Verse');
const QuizQuestion = require('../models/QuizQuestion');
const User = require('../models/User');

// GET dashboard stats
const getStats = async (req, res) => {
  try {
    const [scriptures, adhyayas, verses, questions, users] = await Promise.all([
      Scripture.countDocuments(),
      Adhyaya.countDocuments(),
      Verse.countDocuments(),
      QuizQuestion.countDocuments(),
      User.countDocuments()
    ]);
    res.json({ scriptures, adhyayas, verses, questions, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET all scriptures
const getScriptures = async (req, res) => {
  try {
    const scriptures = await Scripture.find();
    res.json(scriptures);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET all adhyayas
const getAdhyayas = async (req, res) => {
  try {
    const adhyayas = await Adhyaya.find().populate('scriptureId', 'title');
    res.json(adhyayas);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET all verses
const getVerses = async (req, res) => {
  try {
    const verses = await Verse.find()
      .populate('adhyayaId', 'title number')
      .populate('scriptureId', 'title');
    res.json(verses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD scripture
const addScripture = async (req, res) => {
  try {
    const { title, description, icon, totalAdhyayas, totalVerses } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const scripture = await Scripture.create({ title, description, icon, totalAdhyayas, totalVerses });
    res.status(201).json(scripture);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD adhyaya
const addAdhyaya = async (req, res) => {
  try {
    const { scriptureId, number, title, description, totalVerses } = req.body;
    if (!scriptureId || !number || !title) {
      return res.status(400).json({ message: 'scriptureId, number and title are required' });
    }
    const adhyaya = await Adhyaya.create({ scriptureId, number, title, description, totalVerses });
    res.status(201).json(adhyaya);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD verse
const addVerse = async (req, res) => {
  try {
    const { adhyayaId, scriptureId, verseNumber, sanskrit, transliteration, meaning, meaningHindi } = req.body;
    if (!adhyayaId || !scriptureId || !verseNumber || !sanskrit || !meaning) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    const verse = await Verse.create({
      adhyayaId, scriptureId, verseNumber,
      sanskrit, transliteration, meaning, meaningHindi
    });
    res.status(201).json(verse);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD quiz question
const addQuestion = async (req, res) => {
  try {
    const { verseId, question, optionA, optionB, optionC, optionD, correctOption, points } = req.body;
    if (!verseId || !question || !optionA || !optionB || !optionC || !optionD || !correctOption) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const q = await QuizQuestion.create({
      verseId, question, optionA, optionB, optionC, optionD,
      correctOption: correctOption.toUpperCase(),
      points: points || 50
    });
    res.status(201).json(q);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE verse
const deleteVerse = async (req, res) => {
  try {
    await Verse.findByIdAndDelete(req.params.id);
    await QuizQuestion.deleteMany({ verseId: req.params.id });
    res.json({ message: 'Verse and its questions deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE question
const deleteQuestion = async (req, res) => {
  try {
    await QuizQuestion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStats, getScriptures, getAdhyayas, getVerses,
  addScripture, addAdhyaya, addVerse, addQuestion,
  deleteVerse, deleteQuestion
};
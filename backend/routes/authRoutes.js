const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { parse } = require('csv-parse/sync');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const Scripture   = require('../models/Scripture');
const Adhyaya     = require('../models/Adhyaya');
const Verse       = require('../models/Verse');
const QuizQuestion = require('../models/QuizQuestion');
const User        = require('../models/User');

// ─── Multer: Audio → Cloudinary ──────────────────────────────────────────────
const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tatvapath/audio',
    resource_type: 'video',   // Cloudinary uses 'video' type for audio files
    allowed_formats: ['mp3', 'wav', 'ogg', 'm4a'],
  },
});
const audioUpload = multer({ storage: audioStorage });

// ─── Multer: CSV → memory buffer ─────────────────────────────────────────────
const csvUpload = multer({ storage: multer.memoryStorage() });

// =============================================================================
//  STATS
// =============================================================================
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [scriptures, adhyayas, verses, questions, users] = await Promise.all([
      Scripture.countDocuments(),
      Adhyaya.countDocuments(),
      Verse.countDocuments(),
      QuizQuestion.countDocuments(),
      User.countDocuments(),
    ]);
    res.json({ scriptures, adhyayas, verses, questions, users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

// =============================================================================
//  SCRIPTURES
// =============================================================================

// GET all scriptures
router.get('/scriptures', protect, adminOnly, async (req, res) => {
  try {
    const scriptures = await Scripture.find().sort({ createdAt: -1 });
    res.json(scriptures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create scripture
router.post('/scripture', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, icon, totalAdhyayas, totalVerses } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const scripture = await Scripture.create({ title, description, icon, totalAdhyayas, totalVerses });
    res.status(201).json(scripture);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE scripture
router.delete('/scripture/:id', protect, adminOnly, async (req, res) => {
  try {
    await Scripture.findByIdAndDelete(req.params.id);
    res.json({ message: 'Scripture deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =============================================================================
//  ADHYAYAS
// =============================================================================

// GET all adhyayas (populated)
router.get('/adhyayas', protect, adminOnly, async (req, res) => {
  try {
    const adhyayas = await Adhyaya.find()
      .populate('scriptureId', 'title')
      .sort({ createdAt: -1 });
    res.json(adhyayas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create adhyaya
router.post('/adhyaya', protect, adminOnly, async (req, res) => {
  try {
    const { scriptureId, number, title, description, totalVerses } = req.body;
    if (!scriptureId || !number || !title)
      return res.status(400).json({ message: 'scriptureId, number and title are required' });
    const adhyaya = await Adhyaya.create({ scriptureId, number, title, description, totalVerses });
    res.status(201).json(adhyaya);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE adhyaya
router.delete('/adhyaya/:id', protect, adminOnly, async (req, res) => {
  try {
    await Adhyaya.findByIdAndDelete(req.params.id);
    res.json({ message: 'Adhyaya deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =============================================================================
//  VERSES
// =============================================================================

// GET all verses (populated)
router.get('/verses', protect, adminOnly, async (req, res) => {
  try {
    const verses = await Verse.find()
      .populate('scriptureId', 'title')
      .populate('adhyayaId', 'number title')
      .sort({ createdAt: -1 });
    res.json(verses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create verse
router.post('/verse', protect, adminOnly, async (req, res) => {
  try {
    const { scriptureId, adhyayaId, verseNumber, sanskrit, transliteration, meaning, meaningHindi } = req.body;
    if (!scriptureId || !adhyayaId || !verseNumber || !sanskrit)
      return res.status(400).json({ message: 'scriptureId, adhyayaId, verseNumber and sanskrit are required' });
    const verse = await Verse.create({
      scriptureId, adhyayaId, verseNumber,
      sanskrit, transliteration, meaning, meaningHindi
    });
    res.status(201).json(verse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE verse
router.delete('/verse/:id', protect, adminOnly, async (req, res) => {
  try {
    const verse = await Verse.findById(req.params.id);
    if (!verse) return res.status(404).json({ message: 'Verse not found' });

    // Also delete audio from Cloudinary if exists
    if (verse.audioPublicId) {
      await cloudinary.uploader.destroy(verse.audioPublicId, { resource_type: 'video' });
    }

    await Verse.findByIdAndDelete(req.params.id);
    res.json({ message: 'Verse deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =============================================================================
//  QUIZ QUESTIONS
// =============================================================================

// GET all questions (populated)
router.get('/questions', protect, adminOnly, async (req, res) => {
  try {
    const questions = await QuizQuestion.find()
      .populate({
        path: 'verseId',
        populate: [
          { path: 'scriptureId', select: 'title' },
          { path: 'adhyayaId', select: 'number title' }
        ]
      })
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create question
router.post('/question', protect, adminOnly, async (req, res) => {
  try {
    const { verseId, question, optionA, optionB, optionC, optionD, correctOption, points } = req.body;
    if (!verseId || !question || !optionA || !correctOption)
      return res.status(400).json({ message: 'verseId, question, optionA and correctOption are required' });
    const q = await QuizQuestion.create({
      verseId, question,
      optionA, optionB, optionC, optionD,
      correctOption: correctOption.toUpperCase(),
      points: points || 50
    });
    res.status(201).json(q);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE question
router.delete('/question/:id', protect, adminOnly, async (req, res) => {
  try {
    await QuizQuestion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =============================================================================
//  AUDIO — Upload & Delete via Cloudinary
// =============================================================================

// POST upload audio for a verse
router.post('/audio/:verseId', protect, adminOnly, audioUpload.single('audio'), async (req, res) => {
  try {
    const verse = await Verse.findById(req.params.verseId);
    if (!verse) return res.status(404).json({ message: 'Verse not found' });

    // If old audio exists, delete it first
    if (verse.audioPublicId) {
      await cloudinary.uploader.destroy(verse.audioPublicId, { resource_type: 'video' });
    }

    verse.audioUrl      = req.file.path;
    verse.audioPublicId = req.file.filename;
    await verse.save();

    res.json({ message: 'Audio uploaded', audioUrl: verse.audioUrl });
  } catch (err) {
    res.status(500).json({ message: 'Audio upload failed', error: err.message });
  }
});

// DELETE audio for a verse
router.delete('/audio/:verseId', protect, adminOnly, async (req, res) => {
  try {
    const verse = await Verse.findById(req.params.verseId);
    if (!verse) return res.status(404).json({ message: 'Verse not found' });

    if (verse.audioPublicId) {
      await cloudinary.uploader.destroy(verse.audioPublicId, { resource_type: 'video' });
    }

    verse.audioUrl      = null;
    verse.audioPublicId = null;
    await verse.save();

    res.json({ message: 'Audio deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Audio delete failed', error: err.message });
  }
});

// =============================================================================
//  BULK UPLOAD — CSV
// =============================================================================

// POST /api/admin/bulk-upload
// CSV columns: scriptureId, adhyayaId, verseNumber, sanskrit, transliteration,
//              meaning, meaningHindi, question, optionA, optionB, optionC,
//              optionD, correctOption, points
router.post('/bulk-upload', protect, adminOnly, csvUpload.single('csvfile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const content = req.file.buffer.toString('utf-8');
    const rows = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let versesCreated    = 0;
    let questionsCreated = 0;
    const errors         = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        // Find or create verse
        let verse = await Verse.findOne({
          adhyayaId:   row.adhyayaId,
          verseNumber: Number(row.verseNumber),
        });

        if (!verse) {
          verse = await Verse.create({
            scriptureId:    row.scriptureId,
            adhyayaId:      row.adhyayaId,
            verseNumber:    Number(row.verseNumber),
            sanskrit:       row.sanskrit,
            transliteration: row.transliteration,
            meaning:        row.meaning,
            meaningHindi:   row.meaningHindi || '',
          });
          versesCreated++;
        }

        // Create quiz question if question fields are present
        if (row.question && row.optionA && row.correctOption) {
          await QuizQuestion.create({
            verseId:       verse._id,
            question:      row.question,
            optionA:       row.optionA,
            optionB:       row.optionB || '',
            optionC:       row.optionC || '',
            optionD:       row.optionD || '',
            correctOption: row.correctOption.toUpperCase(),
            points:        Number(row.points) || 50,
          });
          questionsCreated++;
        }

      } catch (rowErr) {
        errors.push(`Row ${i + 2}: ${rowErr.message}`);
      }
    }

    res.json({
      message: 'Bulk upload complete',
      versesCreated,
      questionsCreated,
      errors,
    });

  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');
const { uploadAudio, deleteAudio } = require('../controllers/audioController');
const {
  getStats, getScriptures, getAdhyayas, getVerses,
  addScripture, addAdhyaya, addVerse, addQuestion,
  deleteVerse, deleteQuestion
} = require('../controllers/adminController');

const Verse = require('../models/Verse');
const QuizQuestion = require('../models/QuizQuestion');

const csvUpload = multer({ storage: multer.memoryStorage() });

// All admin routes need: login + admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/scriptures', getScriptures);
router.get('/adhyayas', getAdhyayas);
router.get('/verses', getVerses);

router.post('/scripture', addScripture);
router.post('/adhyaya', addAdhyaya);
router.post('/verse', addVerse);
router.post('/question', addQuestion);

router.delete('/verse/:id', deleteVerse);
router.delete('/question/:id', deleteQuestion);

// Audio routes
router.post('/audio/:verseId', upload.single('audio'), uploadAudio);
router.delete('/audio/:verseId', deleteAudio);

// Bulk CSV upload
router.post('/bulk-upload', csvUpload.single('csvfile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const rows = parse(req.file.buffer.toString('utf-8'), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let versesCreated = 0;
    let questionsCreated = 0;
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        let verse = await Verse.findOne({
          adhyayaId: row.adhyayaId,
          verseNumber: Number(row.verseNumber),
        });

        if (!verse) {
          verse = await Verse.create({
            scriptureId: row.scriptureId,
            adhyayaId: row.adhyayaId,
            verseNumber: Number(row.verseNumber),
            sanskrit: row.sanskrit,
            transliteration: row.transliteration,
            meaning: row.meaning,
            meaningHindi: row.meaningHindi || '',
          });
          versesCreated++;
        }

        if (row.question && row.optionA && row.correctOption) {
          await QuizQuestion.create({
            verseId: verse._id,
            question: row.question,
            optionA: row.optionA,
            optionB: row.optionB || '',
            optionC: row.optionC || '',
            optionD: row.optionD || '',
            correctOption: row.correctOption.toUpperCase(),
            points: Number(row.points) || 50,
          });
          questionsCreated++;
        }
      } catch (rowErr) {
        errors.push(`Row ${i + 2}: ${rowErr.message}`);
      }
    }

    res.json({ message: 'Bulk upload complete', versesCreated, questionsCreated, errors });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

module.exports = router;
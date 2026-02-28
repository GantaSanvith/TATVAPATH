const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  getStats, getScriptures, getAdhyayas, getVerses,
  addScripture, addAdhyaya, addVerse, addQuestion,
  deleteVerse, deleteQuestion
} = require('../controllers/adminController');

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

module.exports = router;
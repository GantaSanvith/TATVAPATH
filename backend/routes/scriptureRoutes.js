const express = require('express');
const router = express.Router();
const { getScriptures, getAdhyayas, getVerses, getVerse } = require('../controllers/scriptureController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getScriptures);
router.get('/:scriptureId/adhyayas', getAdhyayas);
router.get('/adhyaya/:adhyayaId/verses', protect, getVerses);
router.get('/verse/:verseId', protect, getVerse);

module.exports = router;
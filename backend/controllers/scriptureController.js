const Scripture = require('../models/Scripture');
const Adhyaya = require('../models/Adhyaya');
const Verse = require('../models/Verse');
const UserProgress = require('../models/UserProgress');

// GET all scriptures
// GET /api/scriptures
const getScriptures = async (req, res) => {
  try {
    const scriptures = await Scripture.find();
    res.json(scriptures);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET all adhyayas of a scripture
// GET /api/scriptures/:scriptureId/adhyayas
const getAdhyayas = async (req, res) => {
  try {
    const adhyayas = await Adhyaya.find({ 
      scriptureId: req.params.scriptureId 
    }).sort({ number: 1 });  // Sort by chapter number

    res.json(adhyayas);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET all verses of an adhyaya
// GET /api/scriptures/adhyaya/:adhyayaId/verses
const getVerses = async (req, res) => {
  try {
    const verses = await Verse.find({ 
      adhyayaId: req.params.adhyayaId 
    }).sort({ verseNumber: 1 });

    // If user is logged in, also fetch their progress for these verses
    if (req.user) {
      const verseIds = verses.map(v => v._id);
      const progress = await UserProgress.find({
        userId: req.user._id,
        verseId: { $in: verseIds }
      });

      // Attach completion status to each verse
      const versesWithProgress = verses.map(verse => {
        const userProgress = progress.find(
          p => p.verseId.toString() === verse._id.toString()
        );
        return {
          ...verse._doc,
          completed: userProgress ? userProgress.completed : false
        };
      });

      return res.json(versesWithProgress);
    }

    res.json(verses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET single verse by ID
// GET /api/scriptures/verse/:verseId
const getVerse = async (req, res) => {
  try {
    const verse = await Verse.findById(req.params.verseId)
      .populate('adhyayaId', 'title number')
      .populate('scriptureId', 'title');

    if (!verse) {
      return res.status(404).json({ message: 'Verse not found' });
    }

    res.json(verse);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getScriptures, getAdhyayas, getVerses, getVerse };
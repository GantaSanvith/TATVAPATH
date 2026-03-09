const Verse = require('../models/Verse');
const { cloudinary } = require('../config/cloudinary');

// Upload audio for a verse
// POST /api/admin/audio/:verseId
const uploadAudio = async (req, res) => {
  try {
    const verse = await Verse.findById(req.params.verseId);
    if (!verse) {
      return res.status(404).json({ message: 'Verse not found' });
    }

    // Delete old audio if exists
    if (verse.audioPublicId) {
      await cloudinary.uploader.destroy(verse.audioPublicId, {
        resource_type: 'video'
      });
    }

    // Save new audio URL to verse
    verse.audioUrl = req.file.path;
    verse.audioPublicId = req.file.filename;
    await verse.save();

    res.json({
      message: 'Audio uploaded successfully!',
      audioUrl: verse.audioUrl
    });

  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
};

// Delete audio for a verse
const deleteAudio = async (req, res) => {
  try {
    const verse = await Verse.findById(req.params.verseId);
    if (!verse) {
      return res.status(404).json({ message: 'Verse not found' });
    }

    if (verse.audioPublicId) {
      await cloudinary.uploader.destroy(verse.audioPublicId, {
        resource_type: 'video'
      });
      verse.audioUrl = null;
      verse.audioPublicId = null;
      await verse.save();
    }

    res.json({ message: 'Audio deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

module.exports = { uploadAudio, deleteAudio };
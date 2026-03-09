const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage — saves audio to cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tatvapath/audio',     // Folder in cloudinary
    resource_type: 'video',        // Audio files use 'video' type in cloudinary
    allowed_formats: ['mp3', 'wav', 'ogg', 'm4a'],
    public_id: (req, file) => {
      // Name file as: scriptureId_adhyayaId_verseNumber
      return `verse_${Date.now()}`;
    }
  }
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
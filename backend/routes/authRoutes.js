const express = require('express');
const router = express.Router();
const { registerUser, loginUser,getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register → calls registerUser function
router.post('/register', registerUser);

// POST /api/auth/login → calls loginUser function
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);  // ← ADD THIS


module.exports = router;
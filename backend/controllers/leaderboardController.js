const User = require('../models/User');

// GET top 10 users by points
// GET /api/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .select('name totalPoints currentStreak')  // Only fetch these fields
      .sort({ totalPoints: -1 })                 // Highest points first
      .limit(10);                                // Top 10 only

    // Add rank number to each user
    const ranked = topUsers.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      totalPoints: user.totalPoints,
      currentStreak: user.currentStreak
    }));

    // Also find current user's rank
    let myRank = null;
    if (req.user) {
      const allUsers = await User.find()
        .sort({ totalPoints: -1 })
        .select('_id');

      myRank = allUsers.findIndex(
        u => u._id.toString() === req.user._id.toString()
      ) + 1;
    }

    res.json({ leaderboard: ranked, myRank });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLeaderboard };
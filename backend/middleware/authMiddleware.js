const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in request headers
    // Frontend sends: Authorization: Bearer <token>
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
      
      // Extract just the token part (remove "Bearer ")
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, reject the request
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request object (so controllers can use it)
    req.user = await User.findById(decoded.id).select('-password');

    // Move to the next function (the controller)
    next();

  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
// server/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Define the middleware function first
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
      req.user = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username
      };
      next();
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Export after defining
module.exports = { authenticateToken };

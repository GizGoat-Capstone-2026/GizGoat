/**
 * Auth Middleware — JWT Verification
 * Verifies the Bearer token and attaches decoded user payload to req.user.
 */
const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = (req, res, next) => {
  try {
    // 1. Check Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Akses ditolak. Token tidak ditemukan.',
      });
    }

    // 2. Extract & verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    // 3. Attach decoded payload to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    // Let the global error handler deal with JWT-specific errors
    next(error);
  }
};

module.exports = authMiddleware;

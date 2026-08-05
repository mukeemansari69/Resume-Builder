const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

function getTokenFromRequest(req) {
  const cookieToken = req.cookies?.token;
  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = req.headers?.authorization;
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

async function authUser(req, res, next) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
  if (!jwtSecret) {
    return res.status(500).json({ message: 'JWT secret is not configured' });
  }

  try {
    const isBlacklisted = await tokenBlacklistModel.exists({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { authMiddleware: authUser };

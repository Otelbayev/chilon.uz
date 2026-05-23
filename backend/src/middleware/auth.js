const jwt = require('jsonwebtoken');
const { HttpError } = require('./errorHandler');

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set in environment');
  return secret;
}

function signToken(payload) {
  return jwt.sign(payload, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new HttpError(401, 'Missing token'));

  try {
    req.user = jwt.verify(token, getSecret());
    next();
  } catch (err) {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}

module.exports = { signToken, requireAuth };

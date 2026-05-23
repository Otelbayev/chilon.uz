const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { signToken, requireAuth } = require('../middleware/auth');
const { HttpError } = require('../middleware/errorHandler');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many login attempts, try again later.' },
});

// POST /api/auth/login { username, password }
router.post('/login', loginLimiter, (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      throw new HttpError(400, 'Username and password are required');
    }

    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;
    if (!adminUser || !adminPass) {
      throw new HttpError(500, 'Admin credentials not configured');
    }

    if (username !== adminUser || password !== adminPass) {
      throw new HttpError(401, 'Invalid credentials');
    }

    const token = signToken({ sub: username, role: 'admin' });
    res.json({
      token,
      user: { username, role: 'admin' },
    });
  } catch (err) { next(err); }
});

// GET /api/auth/me — verify token
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { username: req.user.sub, role: req.user.role } });
});

module.exports = router;

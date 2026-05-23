const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { query } = require('../db');
const { HttpError } = require('../middleware/errorHandler');

// Strict limit on the public form to prevent spam.
const formLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,   // 10 min
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many submissions, please try again later.' },
});

// POST /api/callback  { name, phone, message?, source? }
router.post('/', formLimiter, async (req, res, next) => {
  try {
    const { name, phone, message, source } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      throw new HttpError(400, 'Field "name" is required (min 2 chars)');
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      throw new HttpError(400, 'Field "phone" is required (min 7 chars)');
    }

    const { rows } = await query(
      `INSERT INTO callback_requests (name, phone, message, source)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [name.trim(), phone.trim(), (message || '').trim() || null, source || null]
    );

    res.status(201).json({
      id: rows[0].id,
      createdAt: rows[0].created_at,
      message: 'Заявка принята. Мы свяжемся с вами в ближайшее время.',
    });
  } catch (err) { next(err); }
});

// GET /api/callback?limit=&offset=&status=  (admin endpoint — protect later)
router.get('/', async (req, res, next) => {
  try {
    const limit  = Math.min(Number(req.query.limit)  || 50, 200);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const status = req.query.status;

    const where = status ? 'WHERE status = $3' : '';
    const params = status ? [limit, offset, status] : [limit, offset];

    const { rows } = await query(
      `SELECT id, name, phone, message, source, status, created_at
       FROM callback_requests
       ${where}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    );
    res.json({ items: rows, limit, offset });
  } catch (err) { next(err); }
});

module.exports = router;

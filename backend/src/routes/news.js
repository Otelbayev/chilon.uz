const router = require('express').Router();
const { query } = require('../db');
const { HttpError } = require('../middleware/errorHandler');

// GET /api/news?limit=&offset=
// GET /api/news/:slug
router.get('/', async (req, res, next) => {
  try {
    const limit  = Math.min(Number(req.query.limit)  || 20, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const { rows } = await query(
      `SELECT id, slug, date, title, excerpt, image
       FROM news WHERE published = TRUE
       ORDER BY date DESC, id
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const { rows: countRows } = await query(
      `SELECT COUNT(*)::int AS total FROM news WHERE published = TRUE`
    );

    res.json(req.localize({
      items: rows,
      total: countRows[0].total,
      limit,
      offset,
    }));
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, slug, date, title, excerpt, content, image
       FROM news WHERE slug = $1 AND published = TRUE`,
      [req.params.slug]
    );
    if (rows.length === 0) throw new HttpError(404, 'News article not found');
    res.json(req.localize(rows[0]));
  } catch (err) { next(err); }
});

module.exports = router;

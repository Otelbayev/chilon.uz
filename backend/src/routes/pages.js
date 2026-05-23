const router = require('express').Router();
const { query } = require('../db');
const { HttpError } = require('../middleware/errorHandler');

// GET /api/pages          -> list slugs
// GET /api/pages/:slug    -> single page content
router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query('SELECT slug, updated_at FROM pages ORDER BY slug');
    res.json(rows);
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT slug, content, updated_at FROM pages WHERE slug = $1',
      [req.params.slug]
    );
    if (rows.length === 0) throw new HttpError(404, 'Page not found');
    res.json(req.localize(rows[0]));
  } catch (err) { next(err); }
});

module.exports = router;

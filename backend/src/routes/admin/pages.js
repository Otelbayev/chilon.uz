const router = require('express').Router();
const { query } = require('../../db');
const { HttpError } = require('../../middleware/errorHandler');

router.put('/:slug', async (req, res, next) => {
  try {
    const { content } = req.body || {};
    if (!content || typeof content !== 'object') {
      throw new HttpError(400, 'content (object) is required');
    }
    const { rows } = await query(
      `INSERT INTO pages (slug, content) VALUES ($1, $2::jsonb)
       ON CONFLICT (slug) DO UPDATE
       SET content = EXCLUDED.content, updated_at = NOW()
       RETURNING slug, content, updated_at`,
      [req.params.slug, JSON.stringify(content)]
    );
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:slug', async (req, res, next) => {
  try {
    const { rowCount } = await query('DELETE FROM pages WHERE slug = $1', [req.params.slug]);
    if (rowCount === 0) throw new HttpError(404, 'Page not found');
    res.status(204).end();
  } catch (err) { next(err); }
});

// Update arbitrary site_settings section (site, navigation, footer, ui, seo, contacts)
router.put('/site/:key', async (req, res, next) => {
  try {
    const { value } = req.body || {};
    if (!value || typeof value !== 'object') {
      throw new HttpError(400, 'value (object) is required');
    }
    const { rows } = await query(
      `INSERT INTO site_settings (key, value) VALUES ($1, $2::jsonb)
       ON CONFLICT (key) DO UPDATE
       SET value = EXCLUDED.value, updated_at = NOW()
       RETURNING key, value, updated_at`,
      [req.params.key, JSON.stringify(value)]
    );
    res.json(rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;

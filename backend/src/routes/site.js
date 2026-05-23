const router = require('express').Router();
const { query } = require('../db');
const { HttpError } = require('../middleware/errorHandler');

// GET /api/site               -> all settings keyed by name (site, navigation, footer, ui, seo, contacts)
// GET /api/site/:key          -> single section
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT key, value FROM site_settings');
    const out = {};
    for (const r of rows) out[r.key] = r.value;
    res.json(req.localize(out));
  } catch (err) { next(err); }
});

router.get('/:key', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT value FROM site_settings WHERE key = $1',
      [req.params.key]
    );
    if (rows.length === 0) throw new HttpError(404, 'Setting not found');
    res.json(req.localize(rows[0].value));
  } catch (err) { next(err); }
});

module.exports = router;

const router = require('express').Router();
const { query } = require('../../db');
const { HttpError } = require('../../middleware/errorHandler');

// Admin list — includes unpublished articles
router.get('/', async (req, res, next) => {
  try {
    const limit  = Math.min(Number(req.query.limit)  || 100, 200);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const { rows } = await query(
      `SELECT id, slug, date, title, excerpt, content, image, published, created_at
       FROM news ORDER BY date DESC, id
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const { rows: c } = await query('SELECT COUNT(*)::int AS total FROM news');
    res.json({ items: rows, total: c[0].total, limit, offset });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, slug, date, title, excerpt, content, image, published, created_at
       FROM news WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) throw new HttpError(404, 'News not found');
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { id, slug, date, title, excerpt, content, image, published } = req.body || {};
    if (!id || !slug || !date || !title) {
      throw new HttpError(400, 'id, slug, date and title are required');
    }
    const { rows } = await query(
      `INSERT INTO news (id, slug, date, title, excerpt, content, image, published)
       VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6::jsonb,$7,$8)
       RETURNING *`,
      [
        id, slug, date,
        JSON.stringify(title),
        excerpt ? JSON.stringify(excerpt) : null,
        content ? JSON.stringify(content) : null,
        image || null,
        published !== false,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return next(new HttpError(409, 'News id or slug already exists'));
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { slug, date, title, excerpt, content, image, published } = req.body || {};
    const { rows } = await query(
      `UPDATE news
       SET slug      = COALESCE($1, slug),
           date      = COALESCE($2::date, date),
           title     = COALESCE($3::jsonb, title),
           excerpt   = COALESCE($4::jsonb, excerpt),
           content   = COALESCE($5::jsonb, content),
           image     = COALESCE($6, image),
           published = COALESCE($7, published)
       WHERE id = $8
       RETURNING *`,
      [
        slug || null,
        date || null,
        title ? JSON.stringify(title) : null,
        excerpt ? JSON.stringify(excerpt) : null,
        content ? JSON.stringify(content) : null,
        image || null,
        typeof published === 'boolean' ? published : null,
        req.params.id,
      ]
    );
    if (rows.length === 0) throw new HttpError(404, 'News article not found');
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await query('DELETE FROM news WHERE id = $1', [req.params.id]);
    if (rowCount === 0) throw new HttpError(404, 'News article not found');
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;

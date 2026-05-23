const router = require('express').Router();
const { query } = require('../../db');
const { HttpError } = require('../../middleware/errorHandler');

function validateBody(body) {
  if (!body || typeof body !== 'object') throw new HttpError(400, 'Body required');
  const { id, slug, name } = body;
  if (!id || !slug) throw new HttpError(400, 'id and slug are required');
  if (!name || typeof name !== 'object' || !name.ru) {
    throw new HttpError(400, 'name.ru is required');
  }
}

router.post('/', async (req, res, next) => {
  try {
    validateBody(req.body);
    const { id, slug, name, description, icon, image, sort_order } = req.body;

    const { rows } = await query(
      `INSERT INTO categories (id, slug, name, description, icon, image, sort_order)
       VALUES ($1, $2, $3::jsonb, $4::jsonb, $5, $6, $7)
       RETURNING *`,
      [id, slug, JSON.stringify(name),
       description ? JSON.stringify(description) : null,
       icon || null, image || null, sort_order ?? 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return next(new HttpError(409, 'Category id or slug already exists'));
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { slug, name, description, icon, image, sort_order } = req.body || {};
    const { rows } = await query(
      `UPDATE categories
       SET slug = COALESCE($1, slug),
           name = COALESCE($2::jsonb, name),
           description = COALESCE($3::jsonb, description),
           icon = COALESCE($4, icon),
           image = COALESCE($5, image),
           sort_order = COALESCE($6, sort_order)
       WHERE id = $7
       RETURNING *`,
      [
        slug || null,
        name ? JSON.stringify(name) : null,
        description ? JSON.stringify(description) : null,
        icon || null,
        image || null,
        sort_order ?? null,
        req.params.id,
      ]
    );
    if (rows.length === 0) throw new HttpError(404, 'Category not found');
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    if (rowCount === 0) throw new HttpError(404, 'Category not found');
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;

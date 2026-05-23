const router = require('express').Router();
const { query } = require('../../db');
const { HttpError } = require('../../middleware/errorHandler');

router.post('/', async (req, res, next) => {
  try {
    const { id, category_id, name, code, applications, description, specs, image, sort_order } = req.body || {};
    if (!id || !category_id || !name) {
      throw new HttpError(400, 'id, category_id and name are required');
    }

    const { rows } = await query(
      `INSERT INTO products
         (id, category_id, name, code, applications, description, specs, image, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8,$9)
       RETURNING *`,
      [
        id, category_id, name,
        code || null, applications || null,
        description ? JSON.stringify(description) : null,
        JSON.stringify(specs || {}),
        image || null, sort_order ?? 0,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return next(new HttpError(409, 'Product id already exists'));
    if (err.code === '23503') return next(new HttpError(400, 'Category does not exist'));
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { category_id, name, code, applications, description, specs, image, sort_order } = req.body || {};
    const { rows } = await query(
      `UPDATE products
       SET category_id = COALESCE($1, category_id),
           name        = COALESCE($2, name),
           code        = COALESCE($3, code),
           applications= COALESCE($4, applications),
           description = COALESCE($5::jsonb, description),
           specs       = COALESCE($6::jsonb, specs),
           image       = COALESCE($7, image),
           sort_order  = COALESCE($8, sort_order)
       WHERE id = $9
       RETURNING *`,
      [
        category_id || null, name || null, code || null, applications || null,
        description ? JSON.stringify(description) : null,
        specs ? JSON.stringify(specs) : null,
        image || null, sort_order ?? null,
        req.params.id,
      ]
    );
    if (rows.length === 0) throw new HttpError(404, 'Product not found');
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await query('DELETE FROM products WHERE id = $1', [req.params.id]);
    if (rowCount === 0) throw new HttpError(404, 'Product not found');
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;

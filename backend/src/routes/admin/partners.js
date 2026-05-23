const router = require('express').Router();
const { query } = require('../../db');
const { HttpError } = require('../../middleware/errorHandler');

router.post('/', async (req, res, next) => {
  try {
    const { name, logo, url, sort_order } = req.body || {};
    if (!name) throw new HttpError(400, 'name is required');
    const { rows } = await query(
      `INSERT INTO partners (name, logo, url, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, logo || null, url || null, sort_order ?? 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, logo, url, sort_order } = req.body || {};
    const { rows } = await query(
      `UPDATE partners SET
         name       = COALESCE($1, name),
         logo       = COALESCE($2, logo),
         url        = COALESCE($3, url),
         sort_order = COALESCE($4, sort_order)
       WHERE id = $5 RETURNING *`,
      [name || null, logo || null, url || null, sort_order ?? null, req.params.id]
    );
    if (rows.length === 0) throw new HttpError(404, 'Partner not found');
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await query('DELETE FROM partners WHERE id = $1', [req.params.id]);
    if (rowCount === 0) throw new HttpError(404, 'Partner not found');
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;

const router = require('express').Router();
const { query } = require('../../db');
const { HttpError } = require('../../middleware/errorHandler');

// =========================================================
// Departments
// =========================================================
router.get('/departments', async (_req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, name, phones, sort_order FROM contact_departments ORDER BY sort_order, id'
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/departments', async (req, res, next) => {
  try {
    const { id, name, phones, sort_order } = req.body || {};
    if (!id || !name || !Array.isArray(phones)) {
      throw new HttpError(400, 'id, name, phones[] are required');
    }
    const { rows } = await query(
      `INSERT INTO contact_departments (id, name, phones, sort_order)
       VALUES ($1, $2::jsonb, $3, $4) RETURNING *`,
      [id, JSON.stringify(name), phones, sort_order ?? 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return next(new HttpError(409, 'Department id already exists'));
    next(err);
  }
});

router.put('/departments/:id', async (req, res, next) => {
  try {
    const { name, phones, sort_order } = req.body || {};
    const { rows } = await query(
      `UPDATE contact_departments SET
         name       = COALESCE($1::jsonb, name),
         phones     = COALESCE($2, phones),
         sort_order = COALESCE($3, sort_order)
       WHERE id = $4 RETURNING *`,
      [
        name ? JSON.stringify(name) : null,
        Array.isArray(phones) ? phones : null,
        sort_order ?? null,
        req.params.id,
      ]
    );
    if (rows.length === 0) throw new HttpError(404, 'Department not found');
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/departments/:id', async (req, res, next) => {
  try {
    const { rowCount } = await query('DELETE FROM contact_departments WHERE id = $1', [req.params.id]);
    if (rowCount === 0) throw new HttpError(404, 'Department not found');
    res.status(204).end();
  } catch (err) { next(err); }
});

// =========================================================
// Dealers
// =========================================================
router.get('/dealers', async (_req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, region, phone, sort_order FROM contact_dealers ORDER BY sort_order, id'
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/dealers', async (req, res, next) => {
  try {
    const { region, phone, sort_order } = req.body || {};
    if (!region || !phone) throw new HttpError(400, 'region and phone are required');
    const { rows } = await query(
      `INSERT INTO contact_dealers (region, phone, sort_order)
       VALUES ($1::jsonb, $2, $3) RETURNING *`,
      [JSON.stringify(region), phone, sort_order ?? 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.put('/dealers/:id', async (req, res, next) => {
  try {
    const { region, phone, sort_order } = req.body || {};
    const { rows } = await query(
      `UPDATE contact_dealers SET
         region     = COALESCE($1::jsonb, region),
         phone      = COALESCE($2, phone),
         sort_order = COALESCE($3, sort_order)
       WHERE id = $4 RETURNING *`,
      [
        region ? JSON.stringify(region) : null,
        phone || null,
        sort_order ?? null,
        req.params.id,
      ]
    );
    if (rows.length === 0) throw new HttpError(404, 'Dealer not found');
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/dealers/:id', async (req, res, next) => {
  try {
    const { rowCount } = await query('DELETE FROM contact_dealers WHERE id = $1', [req.params.id]);
    if (rowCount === 0) throw new HttpError(404, 'Dealer not found');
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;

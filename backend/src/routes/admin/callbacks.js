const router = require('express').Router();
const { query } = require('../../db');
const { HttpError } = require('../../middleware/errorHandler');

const VALID_STATUSES = ['new', 'contacted', 'closed'];

router.get('/', async (req, res, next) => {
  try {
    const limit  = Math.min(Number(req.query.limit)  || 50, 200);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const status = req.query.status;

    const where = status ? 'WHERE status = $3' : '';
    const params = status ? [limit, offset, status] : [limit, offset];

    const { rows } = await query(
      `SELECT id, name, phone, message, source, status, created_at
       FROM callback_requests ${where}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    );

    const countSql = `SELECT COUNT(*)::int AS total FROM callback_requests ${status ? 'WHERE status = $1' : ''}`;
    const { rows: countRows } = await query(countSql, status ? [status] : []);

    res.json({ items: rows, total: countRows[0].total, limit, offset });
  } catch (err) { next(err); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!VALID_STATUSES.includes(status)) {
      throw new HttpError(400, `status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
    const { rows } = await query(
      `UPDATE callback_requests SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (rows.length === 0) throw new HttpError(404, 'Request not found');
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await query('DELETE FROM callback_requests WHERE id = $1', [req.params.id]);
    if (rowCount === 0) throw new HttpError(404, 'Request not found');
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;

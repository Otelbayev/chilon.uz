const router = require('express').Router();
const { query } = require('../db');

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, name, logo, url, sort_order
       FROM partners ORDER BY sort_order, id`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;

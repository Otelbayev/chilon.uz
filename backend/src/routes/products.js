const router = require('express').Router();
const { query } = require('../db');
const { HttpError } = require('../middleware/errorHandler');

// GET /api/products
//   ?category=<id|slug>   filter by category
//   ?search=<term>        case-insensitive substring on name/code
//   ?spec.sae=10W-40      filter by any spec field (e.g. spec.tier=premium, spec.api=GL-5)
//   ?limit=&offset=       pagination (default limit 50, max 200)
//
// GET /api/products/:id
router.get('/', async (req, res, next) => {
  try {
    const where = [];
    const params = [];
    let i = 1;

    if (req.query.category) {
      where.push(`(c.id = $${i} OR c.slug = $${i})`);
      params.push(req.query.category);
      i++;
    }
    if (req.query.search) {
      where.push(`(p.name ILIKE $${i} OR p.code ILIKE $${i})`);
      params.push(`%${req.query.search}%`);
      i++;
    }

    for (const [k, v] of Object.entries(req.query)) {
      if (!k.startsWith('spec.')) continue;
      const field = k.slice(5);
      where.push(`p.specs ->> $${i} = $${i + 1}`);
      params.push(field, String(v));
      i += 2;
    }

    const limit  = Math.min(Number(req.query.limit)  || 50, 200);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    params.push(limit, offset);

    const sql = `
      SELECT p.id, p.category_id, p.name, p.code, p.applications,
             p.description, p.specs, p.image, p.sort_order,
             c.slug AS category_slug, c.name AS category_name
      FROM products p
      JOIN categories c ON c.id = p.category_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY c.sort_order, p.sort_order, p.id
      LIMIT $${i} OFFSET $${i + 1}
    `;

    const { rows } = await query(sql, params);

    const countSql = `
      SELECT COUNT(*)::int AS total
      FROM products p
      JOIN categories c ON c.id = p.category_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    `;
    const countParams = params.slice(0, params.length - 2);
    const { rows: countRows } = await query(countSql, countParams);

    res.json(req.localize({
      items: rows,
      total: countRows[0].total,
      limit,
      offset,
    }));
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT p.id, p.category_id, p.name, p.code, p.applications,
              p.description, p.specs, p.image, p.sort_order,
              c.slug AS category_slug, c.name AS category_name
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) throw new HttpError(404, 'Product not found');
    res.json(req.localize(rows[0]));
  } catch (err) { next(err); }
});

module.exports = router;

const router = require('express').Router();
const { query } = require('../db');
const { HttpError } = require('../middleware/errorHandler');

// GET /api/categories                       -> all categories (no products)
// GET /api/categories?withProducts=1        -> categories with nested products
// GET /api/categories/:idOrSlug             -> single category with products
router.get('/', async (req, res, next) => {
  try {
    const withProducts = req.query.withProducts === '1' || req.query.withProducts === 'true';

    const { rows: cats } = await query(
      `SELECT id, slug, name, description, icon, image, sort_order
       FROM categories ORDER BY sort_order, id`
    );

    if (!withProducts) {
      return res.json(req.localize(cats));
    }

    const { rows: products } = await query(
      `SELECT id, category_id, name, code, applications, description, specs, image, sort_order
       FROM products ORDER BY category_id, sort_order, id`
    );

    const byCat = new Map();
    for (const p of products) {
      const list = byCat.get(p.category_id) || [];
      list.push(p);
      byCat.set(p.category_id, list);
    }

    const out = cats.map((c) => ({ ...c, products: byCat.get(c.id) || [] }));
    res.json(req.localize(out));
  } catch (err) { next(err); }
});

router.get('/:idOrSlug', async (req, res, next) => {
  try {
    const key = req.params.idOrSlug;
    const { rows: cats } = await query(
      `SELECT id, slug, name, description, icon, image, sort_order
       FROM categories WHERE id = $1 OR slug = $1 LIMIT 1`,
      [key]
    );
    if (cats.length === 0) throw new HttpError(404, 'Category not found');

    const cat = cats[0];
    const { rows: products } = await query(
      `SELECT id, name, code, applications, description, specs, image, sort_order
       FROM products WHERE category_id = $1 ORDER BY sort_order, id`,
      [cat.id]
    );

    res.json(req.localize({ ...cat, products }));
  } catch (err) { next(err); }
});

module.exports = router;

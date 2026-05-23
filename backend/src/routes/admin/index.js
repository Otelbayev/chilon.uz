const router = require('express').Router();
const { requireAuth } = require('../../middleware/auth');

// All admin routes are protected by JWT.
router.use(requireAuth);

router.use('/categories', require('./categories'));
router.use('/products',   require('./products'));
router.use('/news',       require('./news'));
router.use('/pages',      require('./pages'));
router.use('/partners',   require('./partners'));
router.use('/contacts',   require('./contacts'));
router.use('/callbacks',  require('./callbacks'));
router.use('/upload',     require('./upload'));

// Dashboard summary
router.get('/stats', async (_req, res, next) => {
  try {
    const { query } = require('../../db');
    const [products, categories, news, partners, callbacks, callbacksNew] = await Promise.all([
      query('SELECT COUNT(*)::int AS c FROM products'),
      query('SELECT COUNT(*)::int AS c FROM categories'),
      query('SELECT COUNT(*)::int AS c FROM news'),
      query('SELECT COUNT(*)::int AS c FROM partners'),
      query('SELECT COUNT(*)::int AS c FROM callback_requests'),
      query(`SELECT COUNT(*)::int AS c FROM callback_requests WHERE status = 'new'`),
    ]);
    res.json({
      products:        products.rows[0].c,
      categories:      categories.rows[0].c,
      news:            news.rows[0].c,
      partners:        partners.rows[0].c,
      callbacksTotal:  callbacks.rows[0].c,
      callbacksNew:    callbacksNew.rows[0].c,
    });
  } catch (err) { next(err); }
});

module.exports = router;

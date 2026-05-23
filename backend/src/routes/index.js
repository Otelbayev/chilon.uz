const router = require('express').Router();

router.use('/auth',       require('./auth'));
router.use('/admin',      require('./admin'));

router.use('/site',       require('./site'));
router.use('/pages',      require('./pages'));
router.use('/categories', require('./categories'));
router.use('/products',   require('./products'));
router.use('/news',       require('./news'));
router.use('/partners',   require('./partners'));
router.use('/contacts',   require('./contacts'));
router.use('/callback',   require('./callback'));

module.exports = router;

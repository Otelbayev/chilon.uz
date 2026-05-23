const router = require('express').Router();
const { query } = require('../db');

// GET /api/contacts -> { company, email, address, workingHours, departments, dealers, map }
router.get('/', async (req, res, next) => {
  try {
    const [{ rows: settings }, { rows: depts }, { rows: dealers }] = await Promise.all([
      query(`SELECT value FROM site_settings WHERE key = 'contacts'`),
      query(`SELECT id, name, phones FROM contact_departments ORDER BY sort_order, id`),
      query(`SELECT id, region, phone FROM contact_dealers ORDER BY sort_order, id`),
    ]);

    const base = settings[0]?.value || {};
    const out = {
      company:      base.company,
      email:        base.email,
      address:      base.address,
      workingHours: base.workingHours,
      map:          base.map || null,
      departments:  depts,
      dealers,
    };
    res.json(req.localize(out));
  } catch (err) { next(err); }
});

module.exports = router;

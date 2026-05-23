const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { HttpError } = require('../../middleware/errorHandler');

const UPLOAD_DIR = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
const MAX_MB = Number(process.env.MAX_UPLOAD_MB) || 10;

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.toLowerCase().replace(/[^a-z0-9.-]/g, '-').slice(-40);
    const hash = crypto.randomBytes(6).toString('hex');
    cb(null, `${Date.now()}-${hash}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(file.mimetype)) return cb(null, true);
    cb(new HttpError(400, 'Only image uploads (png, jpg, webp, gif, svg) are allowed'));
  },
});

// POST /api/admin/upload  (form-data field name: "file")
router.post('/', upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) throw new HttpError(400, 'No file uploaded');
    res.status(201).json({
      filename: req.file.filename,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
    });
  } catch (err) { next(err); }
});

// GET /api/admin/upload — list files
router.get('/', (_req, res, next) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR)
      .filter((f) => !f.startsWith('.'))
      .map((filename) => {
        const stat = fs.statSync(path.join(UPLOAD_DIR, filename));
        return {
          filename,
          size: stat.size,
          url: `/uploads/${filename}`,
          createdAt: stat.birthtime,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
    res.json({ items: files });
  } catch (err) { next(err); }
});

// DELETE /api/admin/upload/:filename
router.delete('/:filename', (req, res, next) => {
  try {
    const filename = path.basename(req.params.filename);
    const target = path.join(UPLOAD_DIR, filename);
    if (!target.startsWith(UPLOAD_DIR)) throw new HttpError(400, 'Invalid path');
    if (!fs.existsSync(target)) throw new HttpError(404, 'File not found');
    fs.unlinkSync(target);
    res.status(204).end();
  } catch (err) { next(err); }
});

module.exports = router;

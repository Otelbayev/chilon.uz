const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const path    = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const langMiddleware = require('./middleware/lang');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(langMiddleware);

// Serve uploaded images
const UPLOAD_DIR = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }));

// Light global rate-limit. Tighter limit applied separately on /api/callback.
app.use('/api', rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
}));

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Chilon API listening on http://localhost:${PORT}`);
});

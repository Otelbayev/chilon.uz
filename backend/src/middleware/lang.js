// Reads ?lang=ru|uz (or Accept-Language) and exposes:
//   req.lang      — chosen language code (or null for "all")
//   req.localize  — function that walks any value and replaces
//                   every { ru, uz, ... } object with the picked string.
//
// If no lang is requested, both languages stay in the response.

const SUPPORTED = ['uz', 'ru', 'en'];
const DEFAULT_LANG = 'uz';

function isLangBundle(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const keys = Object.keys(obj);
  if (keys.length === 0) return false;
  const langKeys = ['ru', 'uz', 'en'];
  return keys.every((k) => langKeys.includes(k))
    && keys.some((k) => typeof obj[k] === 'string');
}

function localize(value, lang) {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map((v) => localize(v, lang));
  if (typeof value === 'object') {
    if (isLangBundle(value)) {
      return value[lang] ?? value[DEFAULT_LANG] ?? Object.values(value)[0];
    }
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = localize(v, lang);
    }
    return out;
  }
  return value;
}

module.exports = function langMiddleware(req, res, next) {
  let lang = (req.query.lang || '').toString().toLowerCase();
  if (!SUPPORTED.includes(lang)) {
    const header = (req.headers['accept-language'] || '').toLowerCase();
    const match = SUPPORTED.find((code) => header.includes(code));
    lang = match || null;
  }
  req.lang = lang;
  req.localize = lang ? (val) => localize(val, lang) : (val) => val;
  next();
};

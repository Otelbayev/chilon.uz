-- Chilon Lubricants Backend — Schema
-- Multilingual content stored as JSONB { "ru": "...", "uz": "..." }

DROP TABLE IF EXISTS callback_requests CASCADE;
DROP TABLE IF EXISTS contact_dealers   CASCADE;
DROP TABLE IF EXISTS contact_departments CASCADE;
DROP TABLE IF EXISTS partners          CASCADE;
DROP TABLE IF EXISTS news              CASCADE;
DROP TABLE IF EXISTS products          CASCADE;
DROP TABLE IF EXISTS categories        CASCADE;
DROP TABLE IF EXISTS pages             CASCADE;
DROP TABLE IF EXISTS site_settings     CASCADE;

-- =========================================================
-- Global site config (logo, theme, languages, nav, footer, ui, seo)
-- =========================================================
CREATE TABLE site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Static pages content (home hero, about sections, etc.)
-- =========================================================
CREATE TABLE pages (
  slug       TEXT PRIMARY KEY,
  content    JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Product categories
-- =========================================================
CREATE TABLE categories (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        JSONB NOT NULL,         -- { ru, uz }
  description JSONB,                  -- { ru, uz }
  icon        TEXT,
  image       TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_sort ON categories(sort_order);

-- =========================================================
-- Products
-- =========================================================
CREATE TABLE products (
  id           TEXT PRIMARY KEY,
  category_id  TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  code         TEXT,
  applications TEXT,
  description  JSONB,                 -- { ru, uz }
  specs        JSONB NOT NULL DEFAULT '{}'::jsonb,  -- SAE, ISO VG, API, NLGI, tier, type, etc.
  image        TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_specs    ON products USING GIN (specs);

-- =========================================================
-- News
-- =========================================================
CREATE TABLE news (
  id         TEXT PRIMARY KEY,
  slug       TEXT UNIQUE NOT NULL,
  date       DATE NOT NULL,
  title      JSONB NOT NULL,
  excerpt    JSONB,
  content    JSONB,
  image      TEXT,
  published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_news_date      ON news(date DESC);
CREATE INDEX idx_news_published ON news(published);

-- =========================================================
-- Partners
-- =========================================================
CREATE TABLE partners (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  logo       TEXT,
  url        TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Contact departments (B2B, B2C, admin, accounting...)
-- =========================================================
CREATE TABLE contact_departments (
  id         TEXT PRIMARY KEY,
  name       JSONB NOT NULL,
  phones     TEXT[] NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- =========================================================
-- Regional dealers
-- =========================================================
CREATE TABLE contact_dealers (
  id         SERIAL PRIMARY KEY,
  region     JSONB NOT NULL,         -- { ru, uz }
  phone      TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- =========================================================
-- Callback / consultation submissions
-- =========================================================
CREATE TABLE callback_requests (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  message    TEXT,
  source     TEXT,
  status     TEXT NOT NULL DEFAULT 'new',  -- new | contacted | closed
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_callback_status  ON callback_requests(status);
CREATE INDEX idx_callback_created ON callback_requests(created_at DESC);

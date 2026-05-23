# Chilon Backend

Static-content backend for a **chilon.uz** clone.
Node.js (Express) + PostgreSQL. Multilingual (RU / UZ) via JSONB.

---

## 1. O'rnatish (Setup)

### Talablar
- Node.js 18+
- PostgreSQL 13+ (mahalliy yoki Docker)

### 1.1 Bog'liqliklarni o'rnatish
```bash
cd ~/Desktop/chilon-backend
npm install
```

### 1.2 PostgreSQL ishga tushirish

**Variant A — mahalliy o'rnatilgan postgres:**
```bash
# macOS (Homebrew):
brew install postgresql@16
brew services start postgresql@16
createuser -s postgres   # agar postgres user yo'q bo'lsa
```

**Variant B — Docker (tavsiya etiladi):**
```bash
docker run -d --name chilon-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=chilon \
  -p 5432:5432 \
  postgres:16
```

### 1.3 Environment
`.env` fayli avval yaratilgan. Kerak bo'lsa, parametrlarni o'zgartiring:
```env
PORT=4000
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=chilon
```

### 1.4 Bazani yaratish va to'ldirish
```bash
npm run db:create   # CREATE DATABASE chilon (agar yo'q bo'lsa)
npm run db:migrate  # schema.sql ni qo'llash
npm run db:seed     # data.json dan seed qilish
# yoki bir buyruq bilan migrate + seed:
npm run db:reset
```

### 1.5 Serverni ishga tushirish
```bash
npm run dev     # nodemon bilan
# yoki
npm start
```

Server: <http://localhost:4000>

---

## 2. API endpointlar

Barcha endpointlar `?lang=ru` yoki `?lang=uz` parametrini qabul qiladi.
Agar `lang` berilmasa, javob to'liq ko'p tilli (`{ ru, uz }`) ko'rinishda qaytadi.

### Site / Layout
| Method | URL | Tavsif |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/site` | Hamma sozlamalar (site, navigation, footer, ui, seo, contacts) |
| GET | `/api/site/:key` | Bitta bo'lim (`site`, `navigation`, `footer`, `ui`, `seo`, `contacts`) |
| GET | `/api/pages` | Sahifa slug ro'yxati |
| GET | `/api/pages/:slug` | Sahifa kontenti (`home`, `about`, `products`, `contacts`, ...) |

### Mahsulotlar
| Method | URL | Tavsif |
|---|---|---|
| GET | `/api/categories` | Barcha kategoriyalar |
| GET | `/api/categories?withProducts=1` | Kategoriyalar mahsulotlar bilan |
| GET | `/api/categories/:idOrSlug` | Bitta kategoriya + mahsulotlari |
| GET | `/api/products` | Hamma mahsulotlar (filtr & pagination) |
| GET | `/api/products/:id` | Bitta mahsulot |

**Mahsulotlar filterlari:**
```
/api/products?category=motor-gasoline
/api/products?search=platinum
/api/products?spec.sae=10W-40
/api/products?spec.tier=premium&spec.api=GL-5
/api/products?limit=20&offset=40
```

### Yangiliklar
| Method | URL | Tavsif |
|---|---|---|
| GET | `/api/news?limit=20&offset=0` | Yangiliklar ro'yxati |
| GET | `/api/news/:slug` | Bitta yangilik |

### Hamkorlar / Kontaktlar / Forma
| Method | URL | Tavsif |
|---|---|---|
| GET  | `/api/partners` | Hamkorlar ro'yxati |
| GET  | `/api/contacts` | Kontaktlar (email, manzil, bo'limlar, dilerlar) |
| POST | `/api/callback` | Qo'ng'iroq buyurtmasi (body: `{ name, phone, message?, source? }`) |
| GET  | `/api/callback` | Submit qilingan formalar (admin, hozirgi vaqtda himoyasiz) |

---

## 3. Misol so'rovlar

```bash
# Site sozlamalari ruschada
curl 'http://localhost:4000/api/site?lang=ru'

# Bosh sahifa kontenti
curl 'http://localhost:4000/api/pages/home?lang=uz'

# Benzinli motor moylari, faqat premium
curl 'http://localhost:4000/api/products?category=motor-gasoline&spec.tier=premium&lang=ru'

# Yangiliklar
curl 'http://localhost:4000/api/news?lang=ru&limit=5'

# Forma yuborish
curl -X POST http://localhost:4000/api/callback \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ali","phone":"+998901234567","message":"Konsultatsiya kerak"}'
```

---

## 4. Loyiha tuzilishi

```
chilon-backend/
├── package.json
├── .env / .env.example
├── README.md
├── db/
│   ├── schema.sql            # PostgreSQL DDL
│   ├── data.json             # Manba ma'lumotlar
│   ├── createDatabase.js     # CREATE DATABASE
│   ├── migrate.js            # schema.sql ni qo'llaydi
│   └── seed.js               # data.json -> DB
└── src/
    ├── server.js             # Express entry-point
    ├── db.js                 # pg pool
    ├── middleware/
    │   ├── lang.js           # ?lang=ru|uz lokalizatsiya
    │   └── errorHandler.js
    └── routes/
        ├── index.js
        ├── site.js
        ├── pages.js
        ├── categories.js
        ├── products.js
        ├── news.js
        ├── partners.js
        ├── contacts.js
        └── callback.js
```

---

## 5. Frontendga ulanish

React/Next/Vue frontenddan misol:

```js
const API = 'http://localhost:4000/api';
const lang = 'ru';

// Bosh sahifa
const home = await fetch(`${API}/pages/home?lang=${lang}`).then(r => r.json());

// Mahsulot kategoriyalari
const cats = await fetch(`${API}/categories?withProducts=1&lang=${lang}`).then(r => r.json());

// Yangiliklar
const news = await fetch(`${API}/news?lang=${lang}&limit=6`).then(r => r.json());

// Forma yuborish
await fetch(`${API}/callback`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, phone, message }),
});
```

---

## 6. Production uchun keyingi qadamlar

- `/api/callback` GET endpointiga JWT/admin auth qo'shing
- Rasm yuklash uchun `/api/upload` (multer + S3/local)
- Admin panel uchun CRUD endpointlar (categories, products, news, partners)
- HTTPS (nginx/caddy reverse proxy)
- Migratsiya tizimi (`node-pg-migrate` yoki `kysely`/`drizzle`)
- Email yuborish callback uchun (nodemailer)

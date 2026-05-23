# Chilon Admin Panel

Next.js 14 + TypeScript + Tailwind admin panel for the [chilon-backend](../chilon-backend) API.

---

## Tezkor ishga tushirish

### 1. Backend ishlayotganiga ishonch hosil qiling
```bash
cd ~/Desktop/chilon-backend
npm run db:reset   # agar hali bajarmagan bo'lsangiz
npm run dev        # http://localhost:4000
```

### 2. Admin panel
```bash
cd ~/Desktop/chilon-admin
npm install
npm run dev        # http://localhost:3001
```

### 3. Kirish
- URL: <http://localhost:3001>
- Foydalanuvchi: `admin`
- Parol: `admin123` (backend'ning `.env` faylida `ADMIN_PASSWORD`)

---

## Sahifalar

| Yo'l | Tavsif |
|---|---|
| `/login` | Kirish formasi (JWT) |
| `/dashboard` | Statistika + so'nggi qo'ng'iroqlar |
| `/categories` | Kategoriyalar ro'yxati + CRUD |
| `/categories/new` | Yangi kategoriya |
| `/categories/[id]` | Kategoriyani tahrirlash |
| `/products` | Mahsulotlar (qidiruv, kategoriya filtri, pagination) |
| `/products/new` | Yangi mahsulot (specs JSON bilan) |
| `/products/[id]` | Mahsulotni tahrirlash |
| `/news` | Yangiliklar |
| `/news/new` va `/news/[id]` | Yangilik yaratish/tahrirlash |
| `/pages` | Sahifalar va sayt sozlamalari ro'yxati |
| `/pages/[slug]` | JSON kontentni tahrirlash |
| `/partners` | Hamkorlar (grid + inline tahrir) |
| `/contacts` | Bo'limlar va dilerlar |
| `/callbacks` | Qo'ng'iroq so'rovlari (status o'zgartirish) |
| `/uploads` | Fayl menejeri (rasm yuklash) |

---

## Loyiha tuzilishi

```
chilon-admin/
├── app/
│   ├── layout.tsx               # Root HTML/body
│   ├── page.tsx                 # /dashboard'ga redirect
│   ├── globals.css              # Tailwind + dizayn tokenlari
│   ├── login/page.tsx
│   └── (admin)/                 # AuthGuard + Sidebar layout group
│       ├── layout.tsx
│       ├── dashboard/
│       ├── categories/[id]/, new/
│       ├── products/[id]/, new/
│       ├── news/[id]/, new/
│       ├── pages/[slug]/
│       ├── partners/
│       ├── contacts/
│       ├── callbacks/
│       └── uploads/
├── components/
│   ├── AuthGuard.tsx            # JWT tekshirib /login'ga yo'naltiradi
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── LangInput.tsx            # RU + UZ ikkita maydon
│   ├── ImagePicker.tsx          # Backend upload + URL kiritish
│   ├── CategoryForm.tsx
│   ├── ProductForm.tsx
│   └── NewsForm.tsx
├── lib/
│   ├── api.ts                   # fetch wrapper, JWT, 401 handling
│   └── types.ts
├── .env.local                   # NEXT_PUBLIC_API_URL
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
└── tsconfig.json
```

---

## Backend bilan integratsiya

Admin panel API'ga `Authorization: Bearer <jwt>` header bilan murojaat qiladi.
Token `localStorage.chilon_admin_token`'da saqlanadi.

API URL'ni o'zgartirish uchun `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

401 javob kelganida token tozalanadi va `/login`'ga yo'naltiriladi.

---

## Production build

```bash
npm run build
npm start          # port 3001
```

Yoki Docker'da yoki Vercel'da deploy qilish mumkin. Backend `CORS_ORIGIN` ni admin panel domeniga moslashtiring.

---

## Keyingi qadamlar (ixtiyoriy)

- Rich text editor (TipTap, Lexical) yangilik kontenti uchun
- Drag-drop sort_order o'zgartirish
- Audit log (kim nimani o'zgartirgan)
- Image crop/resize upload paytida
- 2FA admin login uchun

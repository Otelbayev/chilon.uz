import type { Lang } from './i18n';
import type { Category, Product, NewsItem, Partner, SiteContacts, Localized } from './types';
import { localApi } from './local-data';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function withLang(path: string, lang?: Lang): string {
  if (!lang) return `${API_URL}${path}`;
  const sep = path.includes('?') ? '&' : '?';
  return `${API_URL}${path}${sep}lang=${lang}`;
}

// Try backend; if it fails, fall back to local JSON.
async function tryApi<T>(path: string, lang: Lang | undefined, localFallback: () => T): Promise<T> {
  try {
    const res = await fetch(withLang(path, lang), {
      cache: 'no-store',
      signal: AbortSignal.timeout?.(3000),
    });
    if (!res.ok) throw new Error(`API ${res.status} ${path}`);
    return (await res.json()) as T;
  } catch {
    return localFallback();
  }
}

export const api = {
  site: (lang?: Lang) =>
    tryApi<Record<string, unknown>>('/api/site', lang, () => localApi.site() as any),

  categories: (lang?: Lang, withProducts = false) =>
    tryApi<Category[]>(
      `/api/categories${withProducts ? '?withProducts=1' : ''}`,
      lang,
      () => localApi.categories(withProducts) as Category[]
    ),

  category: (idOrSlug: string, lang?: Lang) =>
    tryApi<Category>(`/api/categories/${idOrSlug}`, lang, () => localApi.category(idOrSlug) as Category),

  products: (lang?: Lang, params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    return tryApi<{ items: Product[]; total: number } | Product[]>(
      `/api/products${qs ? '?' + qs : ''}`,
      lang,
      () => localApi.products(params) as Product[]
    );
  },

  product: (id: string, lang?: Lang) =>
    tryApi<Product>(`/api/products/${id}`, lang, () => localApi.product(id) as Product),

  news: (lang?: Lang, params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    return tryApi<{ items: NewsItem[]; total: number } | NewsItem[]>(
      `/api/news${qs ? '?' + qs : ''}`,
      lang,
      () => localApi.news(params) as NewsItem[]
    );
  },

  newsItem: (slug: string, lang?: Lang) =>
    tryApi<NewsItem>(`/api/news/${slug}`, lang, () => localApi.newsItem(slug) as NewsItem),

  partners: (lang?: Lang) =>
    tryApi<Partner[]>('/api/partners', lang, () => localApi.partners() as Partner[]),

  contacts: (lang?: Lang) =>
    tryApi<SiteContacts>('/api/contacts', lang, () => localApi.contacts() as SiteContacts),

  pages: (slug: string, lang?: Lang) =>
    tryApi<{ content: unknown }>(`/api/pages/${slug}`, lang, () => ({ content: localApi.page(slug) })),

  submitCallback: async (body: { name: string; phone: string; message?: string; source?: string }) => {
    // Callbacks require backend; if it's down, return a soft "stored locally" stub.
    try {
      const res = await fetch(`${API_URL}/api/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout?.(4000),
      });
      if (!res.ok) throw new Error('callback_failed');
      return res.json();
    } catch {
      // Persist to localStorage so it's not silently lost during offline demo
      if (typeof window !== 'undefined') {
        const key = 'chilon_pending_callbacks';
        const prev = JSON.parse(localStorage.getItem(key) || '[]');
        prev.push({ ...body, ts: Date.now() });
        localStorage.setItem(key, JSON.stringify(prev));
      }
      return { ok: true, stored: 'local' };
    }
  },
};

export function pickLang(v: Localized | undefined, lang: Lang): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  return v[lang] || v.uz || v.ru || v.en || Object.values(v)[0] || '';
}

export function imageUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads/')) return `${API_URL}${path}`;
  if (path.startsWith('/')) return path;
  return `${API_URL}/${path}`;
}

/* ------------------------------------------------------------------ */
/* Local product image assets — used as fallbacks for products that   */
/* don't have a usable image of their own.                            */
/* ------------------------------------------------------------------ */

/**
 * Only clean packaging ("тара") renders belong here.
 *
 * Client brief (15.07.26): "картинки мы ставим качественно изображения тар,
 * без натурального продукта" — stock photos of the grease itself, or of it
 * being applied by hand, must never reach a product card. When a new tara
 * render lands in `public/products/`, add it here (and to SPECIFIC below);
 * that's the only place image selection happens.
 */
export const PRODUCT_IMAGES = [
  '/products/gasoline-motor-oil.webp',
  '/products/diesel-motor-oil.webp',
  '/products/solidol.webp',
  '/products/graphite-grease.webp',
  '/products/railway-grease.webp',
  '/products/tsiatim-201.webp',
  '/products/tsiatim-221.webp',
];

/** Subset used by the hero showcase — canisters only, no buckets or tins. */
export const CANISTER_IMAGES = [
  '/products/gasoline-motor-oil.webp',
  '/products/diesel-motor-oil.webp',
];

const SPECIFIC: Array<[RegExp, string]> = [
  [/solidol/i,             '/products/solidol.webp'],
  [/diesel|дизел/i,        '/products/diesel-motor-oil.webp'],
  [/gasoline|benzin|бенз/i, '/products/gasoline-motor-oil.webp'],
  [/graphite|графит/i,     '/products/graphite-grease.webp'],
  [/railway|lz-cnii|лз-цнии|жел/i, '/products/railway-grease.webp'],
  [/tsiatim.*201|циатим.*201/i, '/products/tsiatim-201.webp'],
  [/tsiatim.*221|циатим.*221/i, '/products/tsiatim-221.webp'],
];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Pick a product image: prefer category-matched local file, else cycle
 * through PRODUCT_IMAGES using a hash of the product id so the same
 * product always gets the same fallback.
 */
export function productImage(
  p: { id?: string; name?: string; image?: string | null },
  idx?: number
): string {
  // Use original image only if it's HTTP(S) (real remote URL)
  if (p.image && (p.image.startsWith('http://') || p.image.startsWith('https://'))) {
    return p.image;
  }
  const haystack = `${p.id || ''} ${p.name || ''}`.toLowerCase();
  for (const [re, img] of SPECIFIC) {
    if (re.test(haystack)) return img;
  }
  const i = idx ?? hashId(p.id || p.name || '');
  return PRODUCT_IMAGES[i % PRODUCT_IMAGES.length];
}

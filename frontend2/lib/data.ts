import raw from './data.json';
import type { Category, NewsItem, Partner, Product, Localized, Department, Dealer } from './types';

interface RawData {
  site: Record<string, unknown>;
  productCategories: Array<{
    id: string;
    slug: string;
    name: Localized;
    description?: Localized;
    image?: string;
    products: Array<Record<string, unknown> & { id: string; name: string }>;
  }>;
  news: Array<{
    id: string;
    slug: string;
    date: string;
    title: Localized;
    excerpt?: Localized;
    content?: Localized;
    image?: string;
  }>;
  partners: Array<{ name: string; logo?: string; url?: string }>;
  contacts: {
    company?: Localized;
    email?: string;
    address?: Localized;
    workingHours?: Localized;
    departments?: Department[];
    dealers?: Array<{ region: Localized; phone: string }>;
  };
}

const data = raw as unknown as RawData;

function flattenProducts(): Product[] {
  const out: Product[] = [];
  for (const cat of data.productCategories || []) {
    for (const p of cat.products || []) {
      const { id, name, code, applications, image, ...rest } = p as Record<string, unknown> & {
        id: string; name: string; code?: string; applications?: string; image?: string;
      };
      out.push({
        id,
        category_id: cat.id,
        name,
        code: code || undefined,
        applications: applications || undefined,
        image: image || null,
        specs: rest as Record<string, unknown>,
        tier: (rest as { tier?: string }).tier,
      });
    }
  }
  return out;
}

const ALL_PRODUCTS = flattenProducts();

export const CATEGORIES: Category[] = (data.productCategories || []).map((c) => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  description: c.description,
  image: c.image,
  products: ALL_PRODUCTS.filter((p) => p.category_id === c.id),
}));

export const PRODUCTS: Product[] = ALL_PRODUCTS;

export const NEWS: NewsItem[] = (data.news || []).map((n) => ({
  id: n.id,
  slug: n.slug,
  date: n.date,
  title: n.title,
  excerpt: n.excerpt,
  content: n.content,
  image: n.image,
}));

export const PARTNERS: Partner[] = (data.partners || []).map((p, i) => ({
  id: i + 1,
  name: p.name,
  logo: p.logo,
  url: p.url,
}));

export const CONTACTS = data.contacts || {};
export const DEPARTMENTS: Department[] = (data.contacts?.departments as Department[]) || [];
export const DEALERS: Dealer[] = (data.contacts?.dealers as Dealer[]) || [];

export function findProduct(id: string): Product | null {
  return ALL_PRODUCTS.find((p) => p.id === id) || null;
}

export function findCategory(idOrSlug: string): Category | null {
  return CATEGORIES.find((c) => c.id === idOrSlug || c.slug === idOrSlug) || null;
}

export function findNews(slug: string): NewsItem | null {
  return NEWS.find((n) => n.slug === slug) || null;
}

const PRODUCT_IMAGES = [
  '/products/gasoline-motor-oil.webp',
  '/products/diesel-motor-oil.webp',
  '/products/solidol.webp',
  '/products/graphite-grease.webp',
  '/products/railway-grease.webp',
  '/products/tsiatim-201.webp',
  '/products/tsiatim-221.webp',
];

const SPECIFIC: Array<[RegExp, string]> = [
  [/solidol|солидол/i, '/products/solidol.webp'],
  [/diesel|дизел|^m-/i, '/products/diesel-motor-oil.webp'],
  [/gasoline|benzin|бенз|platinum|aurum|argentum|cuprum/i, '/products/gasoline-motor-oil.webp'],
  [/graphite|графит/i, '/products/graphite-grease.webp'],
  [/railway|lz-cnii|лз-цнии|жел|жро|zhro|buksol/i, '/products/railway-grease.webp'],
  [/tsiatim.*201|циатим.*201/i, '/products/tsiatim-201.webp'],
  [/tsiatim.*221|циатим.*221/i, '/products/tsiatim-221.webp'],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function productImage(p: { id?: string; name?: string; image?: string | null }, idx?: number): string {
  if (p.image && (p.image.startsWith('http') || p.image.startsWith('/products'))) return p.image;
  const hay = `${p.id || ''} ${p.name || ''}`.toLowerCase();
  for (const [re, img] of SPECIFIC) if (re.test(hay)) return img;
  const i = idx ?? hash(p.id || p.name || '');
  return PRODUCT_IMAGES[i % PRODUCT_IMAGES.length];
}

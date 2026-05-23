// Local JSON fallback — used when backend API is unreachable.
// Mirrors the API shape so components see the same data structure.

import raw from './data.json';

interface RawData {
  productCategories: any[];
  news: any[];
  partners: any[];
  contacts: any;
  pages: Record<string, any>;
  site: any;
  navigation: any;
  footer: any;
  ui: any;
  seo: any;
}

const data = raw as unknown as RawData;

interface FlatProduct {
  id: string;
  category_id: string;
  name: string;
  code?: string | null;
  applications?: string | null;
  description?: any;
  specs: Record<string, unknown>;
  image?: string | null;
}

function flattenProducts(): FlatProduct[] {
  const out: FlatProduct[] = [];
  for (const cat of data.productCategories || []) {
    for (const p of (cat.products || [])) {
      const { id, name, code, applications, description, image, ...rest } = p;
      out.push({
        id,
        category_id: cat.id,
        name,
        code: code || null,
        applications: applications || null,
        description: description || null,
        specs: rest as Record<string, unknown>,
        image: image || null,
      });
    }
  }
  return out;
}

const ALL_PRODUCTS = flattenProducts();

function matchSpec(p: FlatProduct, key: string, val: string): boolean {
  const v = p.specs[key];
  if (v == null) return false;
  return String(v).toLowerCase() === val.toLowerCase();
}

interface ProductQuery {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  [k: string]: any;
}

export const localApi = {
  products(params: ProductQuery = {}): FlatProduct[] {
    let list = [...ALL_PRODUCTS];
    if (params.category) list = list.filter((p) => p.category_id === params.category);
    if (params.search) {
      const q = String(params.search).toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.code || '').toLowerCase().includes(q)
      );
    }
    // Allow spec.* filters
    for (const [k, v] of Object.entries(params)) {
      if (k.startsWith('spec.') && v != null) {
        const specKey = k.slice(5);
        list = list.filter((p) => matchSpec(p, specKey, String(v)));
      }
    }
    const offset = Number(params.offset) || 0;
    const limit = params.limit != null ? Number(params.limit) : list.length;
    return list.slice(offset, offset + limit);
  },

  product(id: string): FlatProduct | null {
    return ALL_PRODUCTS.find((p) => p.id === id) || null;
  },

  categories(withProducts = false) {
    return (data.productCategories || []).map((c: any, i: number) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      icon: c.icon,
      image: c.image,
      sort_order: i,
      ...(withProducts ? { products: c.products || [] } : {}),
    }));
  },

  category(idOrSlug: string) {
    const c = (data.productCategories || []).find(
      (x: any) => x.id === idOrSlug || x.slug === idOrSlug
    );
    if (!c) return null;
    return {
      id: c.id, slug: c.slug, name: c.name, description: c.description,
      icon: c.icon, image: c.image, products: c.products || [],
    };
  },

  news(params: { limit?: number; offset?: number } = {}) {
    const list = (data.news || []).slice();
    const offset = Number(params.offset) || 0;
    const limit = params.limit != null ? Number(params.limit) : list.length;
    return list.slice(offset, offset + limit);
  },

  newsItem(slug: string) {
    return (data.news || []).find((n: any) => n.slug === slug) || null;
  },

  partners() {
    return (data.partners || []).map((p: any, i: number) => ({
      id: i + 1,
      name: p.name,
      logo: p.logo || null,
      url: p.url || null,
    }));
  },

  contacts() {
    return data.contacts || {};
  },

  site() {
    return {
      site: data.site,
      navigation: data.navigation,
      footer: data.footer,
      ui: data.ui,
      seo: data.seo,
      contacts: data.contacts,
    };
  },

  page(slug: string) {
    return data.pages?.[slug] || null;
  },
};

export type { FlatProduct };

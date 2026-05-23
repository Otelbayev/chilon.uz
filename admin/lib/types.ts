export type LangBundle = { ru: string; uz?: string };

export interface Category {
  id: string;
  slug: string;
  name: LangBundle;
  description?: LangBundle | null;
  icon?: string | null;
  image?: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  category_id: string;
  category_slug?: string;
  category_name?: LangBundle;
  name: string;
  code?: string | null;
  applications?: string | null;
  description?: LangBundle | null;
  specs: Record<string, any>;
  image?: string | null;
  sort_order: number;
}

export interface NewsArticle {
  id: string;
  slug: string;
  date: string;
  title: LangBundle;
  excerpt?: LangBundle | null;
  content?: LangBundle | null;
  image?: string | null;
  published: boolean;
}

export interface Partner {
  id: number;
  name: string;
  logo?: string | null;
  url?: string | null;
  sort_order: number;
}

export interface Department {
  id: string;
  name: LangBundle;
  phones: string[];
  sort_order: number;
}

export interface Dealer {
  id: number;
  region: LangBundle;
  phone: string;
  sort_order: number;
}

export interface CallbackRequest {
  id: number;
  name: string;
  phone: string;
  message?: string | null;
  source?: string | null;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}

export interface Stats {
  products: number;
  categories: number;
  news: number;
  partners: number;
  callbacksTotal: number;
  callbacksNew: number;
}

export interface UploadFile {
  filename: string;
  size: number;
  url: string;
  createdAt: string;
}

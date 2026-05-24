export type Lang = 'uz' | 'en' | 'ru';

export type LangBundle = { uz?: string; en?: string; ru?: string };
export type Localized = string | LangBundle;

export interface Product {
  id: string;
  category_id: string;
  name: string;
  code?: string;
  applications?: string;
  specs: Record<string, unknown>;
  image?: string | null;
  tier?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: Localized;
  description?: Localized;
  image?: string;
  products: Product[];
}

export interface NewsItem {
  id: string;
  slug: string;
  date: string;
  title: Localized;
  excerpt?: Localized;
  content?: Localized;
  image?: string;
}

export interface Partner {
  id: number;
  name: string;
  logo?: string;
  url?: string;
}

export interface Department {
  id: string;
  name: Localized;
  phones: string[];
}

export interface Dealer {
  region: Localized;
  phone: string;
}

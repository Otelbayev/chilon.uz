export type LangBundle = { uz?: string; ru?: string; en?: string };
export type Localized = string | LangBundle;

export interface Category {
  id: string;
  slug: string;
  name: Localized;
  description?: Localized;
  icon?: string;
  image?: string;
  sort_order?: number;
  products?: Product[];
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  code?: string;
  applications?: string;
  description?: Localized;
  specs: Record<string, unknown>;
  image?: string;
  sort_order?: number;
}

export interface NewsItem {
  id: string;
  slug: string;
  date: string;
  title: Localized;
  excerpt?: Localized;
  content?: Localized;
  image?: string;
  published: boolean;
}

export interface Partner {
  id: number;
  name: string;
  logo?: string;
  url?: string;
}

export interface ContactDepartment {
  id: string;
  name: Localized;
  phones: string[];
}

export interface ContactDealer {
  id: number;
  region: Localized;
  phone: string;
}

export interface SiteContacts {
  email?: string;
  phone?: string | string[];
  address?: Localized;
  departments?: ContactDepartment[];
  dealers?: ContactDealer[];
  social?: Record<string, string>;
}

export interface NavItem {
  id: string;
  slug: string;
  label: Localized;
}

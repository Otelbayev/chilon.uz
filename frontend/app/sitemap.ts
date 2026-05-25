import type { MetadataRoute } from "next";
import { localApi } from "@/lib/local-data";

const SITE_URL = "https://chilon-uz.vercel.app";

/** Static routes — kept in sync with the Header nav. */
const STATIC_PATHS = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/news", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/partners", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contacts", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/buy", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/specialists", priority: 0.6, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  // Pull products + news from the bundled JSON so the sitemap stays
  // self-contained (no live API call at build time).
  const products = localApi.products({});
  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const news = localApi.news({});
  const newsEntries: MetadataRoute.Sitemap = news.map((n: { slug: string; date?: string }) => ({
    url: `${SITE_URL}/news/${n.slug}`,
    lastModified: n.date ? new Date(n.date) : now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticEntries, ...productEntries, ...newsEntries];
}

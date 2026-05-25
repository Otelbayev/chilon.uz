"use client";

import { useEffect, useMemo, useState } from "react";
import { api, pickLang } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import type { Category, NewsItem, Product } from "@/lib/types";

/**
 * Loads the data the SearchModal filters against, then exposes
 * memoised "matched" lists for the current query.
 *
 * Filtering is done client-side over a small fetched window — it's
 * good enough for this site's catalog size.
 */
export function useSearchData(query: string) {
  const { lang } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.products(lang, { limit: 50 }),
      api.categories(lang),
      api.news(lang, { limit: 12 }),
    ])
      .then(([p, c, n]) => {
        if (cancelled) return;
        setProducts((Array.isArray(p) ? p : p.items) || []);
        setCategories(c || []);
        setNews((Array.isArray(n) ? n : n.items) || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const q = query.trim().toLowerCase();

  const matchedCategories = useMemo(() => {
    if (!q) return [];
    return categories
      .filter((c) => {
        const name = pickLang(c.name as any, lang).toLowerCase();
        const desc = pickLang(c.description as any, lang).toLowerCase();
        return name.includes(q) || desc.includes(q);
      })
      .slice(0, 5);
  }, [q, categories, lang]);

  const matchedProducts = useMemo(() => {
    if (!q) return [];
    return products
      .filter(
        (p) => p.name.toLowerCase().includes(q) || (p.code || "").toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [q, products]);

  const matchedNews = useMemo(() => {
    if (!q) return [];
    return news
      .filter((n) => pickLang(n.title as any, lang).toLowerCase().includes(q))
      .slice(0, 5);
  }, [q, news, lang]);

  const hasResults =
    matchedCategories.length + matchedProducts.length + matchedNews.length > 0;

  return { matchedCategories, matchedProducts, matchedNews, hasResults };
}

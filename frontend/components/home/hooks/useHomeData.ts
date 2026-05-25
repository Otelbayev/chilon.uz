"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import type { Category, NewsItem, Partner } from "@/lib/types";

/**
 * Loads the three datasets the home page needs:
 * product categories, partner logos and recent news.
 * Refetches whenever the language changes.
 */
export function useHomeData() {
  const { lang } = useLang();
  const [categories, setCategories] = useState<Category[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.categories(lang),
      api.partners(lang),
      api.news(lang, { limit: 3 }),
    ])
      .then(([cats, parts, n]) => {
        if (cancelled) return;
        setCategories((cats || []).slice(0, 12));
        setPartners((parts || []).slice(0, 12));
        setNews((Array.isArray(n) ? n : n.items)?.slice(0, 3) || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { categories, partners, news };
}

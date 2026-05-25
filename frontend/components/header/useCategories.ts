"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import type { Category } from "@/lib/types";

/** Loads the product category list for the current language. */
export function useCategories(): Category[] {
  const { lang } = useLang();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .categories(lang)
      .then((cats) => {
        if (!cancelled) setCategories(cats || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return categories;
}

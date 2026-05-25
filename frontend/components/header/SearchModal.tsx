"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { pickLang } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import CloseIcon from "@/components/icons/CloseIcon";
import GridIcon from "@/components/icons/GridIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import SearchResultsSection from "./SearchResultsSection";
import { useSearchData } from "./useSearchData";

type Props = { onClose: () => void };

/**
 * Full-screen search overlay. Focuses the input on mount, locks body
 * scroll, and closes on Esc / backdrop click / result click.
 *
 * Enter submits and routes to `/products?search=...` with the current term.
 */
export default function SearchModal({ onClose }: Props) {
  const { lang, t } = useLang();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const { matchedCategories, matchedProducts, matchedNews, hasResults } =
    useSearchData(query);

  // Autofocus + Esc to close + body scroll lock
  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const submit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-center gap-3 px-5 py-4 border-b border-ink-100"
        >
          <span className="text-ink-500 shrink-0">
            <SearchIcon size={20} />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent outline-none text-base sm:text-lg text-ink-900 placeholder:text-ink-400"
          />
          <button
            type="button"
            onClick={onClose}
            className="grid place-items-center w-8 h-8 rounded-full hover:bg-ink-100 text-ink-500"
            aria-label={t("common.close")}
          >
            <CloseIcon />
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query.trim() && (
            <div className="px-3 py-8 text-center text-sm text-ink-500">
              {t("search.placeholder")}
            </div>
          )}
          {query.trim() && !hasResults && (
            <div className="px-3 py-8 text-center text-sm text-ink-500">
              {t("search.empty")}
            </div>
          )}

          {matchedCategories.length > 0 && (
            <SearchResultsSection title={t("categories.title")}>
              {matchedCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50"
                >
                  <span className="grid place-items-center size-8 rounded-lg bg-brand-100 text-brand-700">
                    <GridIcon />
                  </span>
                  <span className="text-sm font-medium text-ink-900">
                    {pickLang(c.name as any, lang)}
                  </span>
                </Link>
              ))}
            </SearchResultsSection>
          )}

          {matchedProducts.length > 0 && (
            <SearchResultsSection title={t("nav.products")}>
              {matchedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50"
                >
                  <span className="text-sm font-medium text-ink-900 line-clamp-1">
                    {p.name}
                  </span>
                  {p.code && (
                    <span className="text-[10px] uppercase tracking-wider text-ink-500 shrink-0">
                      {p.code}
                    </span>
                  )}
                </Link>
              ))}
            </SearchResultsSection>
          )}

          {matchedNews.length > 0 && (
            <SearchResultsSection title={t("nav.news")}>
              {matchedNews.map((n) => (
                <Link
                  key={n.id}
                  href={`/news/${n.slug}`}
                  onClick={onClose}
                  className="block px-3 py-2.5 rounded-xl hover:bg-brand-50 text-sm text-ink-900 line-clamp-1"
                >
                  {pickLang(n.title as any, lang)}
                </Link>
              ))}
            </SearchResultsSection>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pickLang } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import type { Category } from "@/lib/types";
import { NAV_ITEMS } from "./nav-items";

type Props = {
  categories: Category[];
};

/** Mobile (<lg) full-width drop-down menu. Categories are listed inline. */
export default function MobileMenu({ categories }: Props) {
  const path = usePathname();
  const { lang, t } = useLang();

  return (
    <div className="lg:hidden bg-white border-t border-ink-100">
      <nav className="container-x py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = path === item.href || (item.href !== "/" && path.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                active ? "bg-brand-50 text-brand-700" : "hover:bg-ink-100"
              }`}
            >
              {t(item.key)}
            </Link>
          );
        })}

        {categories.length > 0 && (
          <div className="mt-2 pt-3 border-t border-ink-100">
            <div className="px-4 pb-2 text-xs uppercase tracking-wider text-ink-500 font-semibold">
              {t("categories.title")}
            </div>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.id}`}
                className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-100 rounded-xl"
              >
                {pickLang(c.name as any, lang)}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}

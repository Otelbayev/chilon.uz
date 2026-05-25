"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { Category } from "@/lib/types";
import ChevronDown from "@/components/icons/ChevronDown";
import { NAV_ITEMS } from "./nav-items";
import ProductsDropdown from "./ProductsDropdown";

type Props = {
  /** True when sitting on the hero — switches text to white */
  light: boolean;
  categories: Category[];
};

/** Desktop (lg+) horizontal nav with the Products hover dropdown. */
export default function DesktopNav({ light, categories }: Props) {
  const path = usePathname();
  const { t } = useLang();
  const [productsOpen, setProductsOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  // Slightly delayed close so a quick mouse-out doesn't kill the panel
  const openDropdown = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setProductsOpen(true);
  };
  const closeDropdown = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setProductsOpen(false), 120);
  };

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const active = path === item.href || (item.href !== "/" && path.startsWith(item.href));
        const isDropdown = item.dropdown === "products";

        return (
          <div
            key={item.href}
            className="relative"
            onMouseEnter={isDropdown ? openDropdown : undefined}
            onMouseLeave={isDropdown ? closeDropdown : undefined}
          >
            <Link
              href={item.href}
              className={`relative inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                active
                  ? light
                    ? "text-white"
                    : "text-brand-700"
                  : light
                  ? "text-white/85 hover:text-white"
                  : "text-ink-700 hover:text-brand-600"
              }`}
            >
              {t(item.key)}
              {isDropdown && <ChevronDown open={productsOpen} />}
              {active && (
                <span
                  className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full ${
                    light ? "bg-white" : "bg-brand-500"
                  }`}
                />
              )}
            </Link>

            {isDropdown && productsOpen && (
              <ProductsDropdown
                categories={categories}
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import LangSwitcher from "./LangSwitcher";
import DesktopNav from "./header/DesktopNav";
import MobileMenu from "./header/MobileMenu";
import SearchModal from "./header/SearchModal";
import SearchIcon from "./icons/SearchIcon";
import MenuIcon from "./icons/MenuIcon";
import { useCategories } from "./header/useCategories";
import { useHeaderState } from "./header/useHeaderState";

/**
 * Top-of-page navigation.
 *
 * Layout:
 *   [Logo]   [DesktopNav (lg+)]   [Search] [Lang] [MobileToggle]
 *
 * The DesktopNav shows a "Products" dropdown of categories on hover.
 * Search opens a full-screen modal.
 */
export default function Header() {
  const path = usePathname();
  const { scrolled, light } = useHeaderState();
  const categories = useCategories();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Reset overlays on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [path]);

  return (
    <>
      <header className={headerClasses({ scrolled, light })}>
        <div className="container-x flex items-center justify-between h-16 lg:h-20">
          <Logo />
          <DesktopNav light={light} categories={categories} />

          <div className="flex items-center gap-2 sm:gap-3">
            <SearchTrigger light={light} onClick={() => setSearchOpen(true)} />
            <LangSwitcher light={light} />
            <MobileToggle
              light={light}
              open={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            />
          </div>
        </div>

        {mobileOpen && <MobileMenu categories={categories} />}
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}

/* ---------- inline triggers (small enough to keep here) ---------- */

function headerClasses({ scrolled, light }: { scrolled: boolean; light: boolean }) {
  // Three visual states:
  //   scrolled        -> frosted glass with hairline border
  //   on hero (light) -> dark gradient on transparent
  //   otherwise       -> transparent
  const base = "fixed inset-x-0 top-0 z-40 transition-all duration-300";
  if (scrolled) return `${base} glass border-b border-ink-100`;
  if (light) return `${base} bg-linear-to-b from-black/40 to-transparent`;
  return `${base} bg-transparent`;
}

function SearchTrigger({ light, onClick }: { light: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Search"
      className={`grid place-items-center w-10 h-10 rounded-full border transition-colors ${
        light
          ? "border-white/40 text-white hover:bg-white/10"
          : "border-ink-300 text-ink-900 hover:border-brand-500 hover:text-brand-600"
      }`}
    >
      <SearchIcon />
    </button>
  );
}

function MobileToggle({
  light,
  open,
  onClick,
}: {
  light: boolean;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="Menu"
      className={`lg:hidden grid place-items-center w-10 h-10 rounded-full border ${
        light ? "border-white/40 text-white" : "border-ink-300 text-ink-900"
      }`}
    >
      <MenuIcon open={open} />
    </button>
  );
}

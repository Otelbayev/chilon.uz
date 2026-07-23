"use client";

import { useEffect, useState } from "react";

/**
 * Tracks two flags the Header needs to style itself:
 *  - scrolled: user has scrolled past the top (including the home snap scroller)
 *  - onHero:   the home page hero slide is the current snap target
 *
 * Both are driven by `document.documentElement.dataset.*` flags
 * set from `app/page.tsx` (home snap scroller).
 */
export function useHeaderState() {
  const [scrolled, setScrolled] = useState(false);
  const [onHero, setOnHero] = useState(false);

  useEffect(() => {
    const read = () => {
      const homeScroll = document.documentElement.dataset.homeScrolled === "1";
      const heroActive = document.documentElement.dataset.heroActive === "1";
      setScrolled(window.scrollY > 12 || homeScroll);
      setOnHero(heroActive);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    const interval = setInterval(read, 120);
    return () => {
      window.removeEventListener("scroll", read);
      clearInterval(interval);
    };
  }, []);

  // The hero used to be a dark video, which needed white header text. It is
  // now a light white/green vector scene, so the header always uses dark ink.
  const light = false;
  return { scrolled, onHero, light };
}

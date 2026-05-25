"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Tracks which `[data-snap-section]` is currently in view inside `scrollerRef`,
 * and mirrors two flags on `<html>` so the global Header can react:
 *   - data-home-scrolled : the scroller has moved off its top
 *   - data-hero-active   : the hero is the current section
 *
 * Returns the index of the active section (0-based).
 */
export function useActiveSection(scrollerRef: RefObject<HTMLDivElement | null>) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    const sections = Array.from(sc.querySelectorAll<HTMLElement>("[data-snap-section]"));
    if (!sections.length) return;

    // Pick whichever section has the biggest visible area.
    const observer = new IntersectionObserver(
      (entries) => {
        let bestIdx = -1;
        let bestRatio = 0;
        for (const e of entries) {
          if (e.intersectionRatio > bestRatio) {
            const idx = sections.indexOf(e.target as HTMLElement);
            if (idx >= 0) {
              bestRatio = e.intersectionRatio;
              bestIdx = idx;
            }
          }
        }
        if (bestIdx >= 0 && bestRatio > 0.4) setActiveIdx(bestIdx);
      },
      { root: sc, threshold: [0.2, 0.4, 0.6, 0.8] },
    );
    sections.forEach((s) => observer.observe(s));

    const onScroll = () => {
      document.documentElement.dataset.homeScrolled = sc.scrollTop > 40 ? "1" : "";
    };
    sc.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      sc.removeEventListener("scroll", onScroll);
      delete document.documentElement.dataset.homeScrolled;
      delete document.documentElement.dataset.heroActive;
    };
  }, [scrollerRef]);

  // Tell the Header when the hero is the active slide
  useEffect(() => {
    document.documentElement.dataset.heroActive = activeIdx === 0 ? "1" : "";
  }, [activeIdx]);

  return activeIdx;
}

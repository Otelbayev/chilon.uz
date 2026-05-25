import type { ReactNode } from "react";
import type { SectionKey } from "./sections";

type Props = {
  sectionKey: SectionKey;
  /** Tailwind classes for the section background */
  bgClass: string;
  /** Optional decorative layer (blobs, grids) — pointer-events disabled */
  pattern?: ReactNode;
  children: ReactNode;
  /** Add vertical padding on mobile (default true). */
  padded?: boolean;
};

/**
 * Common shell for every snap-scrolled slide:
 *   mobile -> natural height (min-h: 100svh)
 *   desktop -> exact viewport height + snap-start/always
 */
export default function SlideShell({
  sectionKey,
  bgClass,
  pattern,
  children,
  padded = true,
}: Props) {
  return (
    <section
      data-snap-section
      data-section={sectionKey}
      className={`relative w-full overflow-hidden min-h-[100svh] lg:h-[100svh] lg:snap-start lg:snap-always ${bgClass}`}
    >
      <div className="pointer-events-none absolute inset-0">{pattern}</div>
      <div className={`relative z-10 w-full h-full ${padded ? "py-20 sm:py-24 lg:py-0" : ""}`}>
        {children}
      </div>
    </section>
  );
}

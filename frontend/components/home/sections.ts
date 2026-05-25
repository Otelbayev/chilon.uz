/**
 * Order of the snap-scrolled slides on the home page.
 *
 * Keep in sync with the JSX in `HomePage.tsx` — the IntersectionObserver
 * uses this order to map a section element back to an index.
 */
export const SECTIONS = ["hero", "categories", "partners", "cta"] as const;
export type SectionKey = (typeof SECTIONS)[number];

/**
 * Line icons for the "Chilon in numbers" slide.
 *
 * Same conventions as the rest of `components/icons/*`: 24×24 viewBox,
 * `currentColor` stroke, no fills — so a parent can colour them with
 * Tailwind text utilities.
 */

type Props = { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
});

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Years on the market — calendar. */
export function YearsIcon({ size = 24 }: Props) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="5" width="18" height="16" rx="3" {...stroke} />
      <path d="M3 10h18M8 3v4M16 3v4" {...stroke} />
      <path d="M8 14h3M8 17.5h8" {...stroke} />
    </svg>
  );
}

/** Tonnes sold — oil drop on a scale pan. */
export function TonsIcon({ size = 24 }: Props) {
  return (
    <svg {...base(size)}>
      <path d="M12 3c3.2 3.8 5 6.4 5 8.6A5 5 0 0 1 7 11.6C7 9.4 8.8 6.8 12 3Z" {...stroke} />
      <path d="M4 20h16" {...stroke} />
      <path d="M7 20v-1.5h10V20" {...stroke} />
    </svg>
  );
}

/** Employees — people. */
export function TeamIcon({ size = 24 }: Props) {
  return (
    <svg {...base(size)}>
      <circle cx="9" cy="8" r="3.2" {...stroke} />
      <path d="M3 19.5c0-3 2.7-5 6-5s6 2 6 5" {...stroke} />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 6.3M17.5 14.9c2.1.6 3.5 2.3 3.5 4.6" {...stroke} />
    </svg>
  );
}

/** Product range — stacked canisters. */
export function ProductsIcon({ size = 24 }: Props) {
  return (
    <svg {...base(size)}>
      <path d="M8 8h6.5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V8Z" {...stroke} />
      <path d="M10 8V5.5A1.5 1.5 0 0 1 11.5 4h1A1.5 1.5 0 0 1 14 5.5V8" {...stroke} />
      <path d="M8 12h8.5" {...stroke} />
      <path d="M18.5 10.5h1.5a1 1 0 0 1 1 1v3" {...stroke} />
    </svg>
  );
}

/** Dealer network — map pin. */
export function DealersIcon({ size = 24 }: Props) {
  return (
    <svg {...base(size)}>
      <path d="M12 21c4-4.4 6-7.6 6-10a6 6 0 1 0-12 0c0 2.4 2 5.6 6 10Z" {...stroke} />
      <circle cx="12" cy="11" r="2.4" {...stroke} />
    </svg>
  );
}

/** Additive base — molecule. */
export function AdditiveIcon({ size = 24 }: Props) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="2.4" {...stroke} />
      <circle cx="5" cy="6.5" r="2" {...stroke} />
      <circle cx="19" cy="6.5" r="2" {...stroke} />
      <circle cx="12" cy="20" r="2" {...stroke} />
      <path d="M10.2 10.4 6.6 7.9M13.8 10.4l3.6-2.5M12 14.4V18" {...stroke} />
    </svg>
  );
}

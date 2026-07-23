type Props = {
  activeIdx: number;
  count: number;
  onJump: (idx: number) => void;
};

/**
 * Vertical "dot" pagination on the right edge — jumps between slides.
 *
 * Lives outside the container gutter so it never crosses the hero's canister
 * column, and uses a single dark/green palette now that every slide (the hero
 * included) is light.
 */
export default function SlideIndicator({ activeIdx, count, onJump }: Props) {
  return (
    <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-2.5 sm:gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onJump(i)}
          aria-label={`Slide ${i + 1}`}
          className="group relative grid place-items-center"
        >
          <span
            className={`block w-1.5 rounded-full transition-all duration-500 ${
              i === activeIdx
                ? "h-7 sm:h-9 bg-brand-500"
                : "h-1.5 bg-ink-300 group-hover:bg-brand-400 group-hover:h-3"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

type Props = {
  activeIdx: number;
  count: number;
  onJump: (idx: number) => void;
};

/** Vertical "dot" pagination on the right edge — jumps between slides. */
export default function SlideIndicator({ activeIdx, count, onJump }: Props) {
  const isOnHero = activeIdx === 0;

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
                ? isOnHero
                  ? "h-7 sm:h-9 bg-white"
                  : "h-7 sm:h-9 bg-brand-500"
                : isOnHero
                ? "h-1.5 bg-white/50 group-hover:bg-white group-hover:h-3"
                : "h-1.5 bg-ink-300 group-hover:bg-brand-400 group-hover:h-3"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

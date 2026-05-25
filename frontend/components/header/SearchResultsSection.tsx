import type { ReactNode } from "react";

type Props = { title: string; children: ReactNode };

/** Titled list group inside the search modal (Categories / Products / News). */
export default function SearchResultsSection({ title, children }: Props) {
  return (
    <div className="py-1">
      <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
        {title}
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { ADDITIVE_BRANDS } from "@/lib/stats";
import { AdditiveIcon } from "@/components/icons/StatIcons";

/**
 * Logo row for the additive suppliers Chilon blends with.
 * Client brief (15.07.26): "Добавить иконки присадок."
 */
export default function AdditivesStrip() {
  const { t } = useLang();

  return (
    <div className="rounded-3xl border border-ink-100 bg-white/80 backdrop-blur p-4 sm:p-5">
      <div className="flex items-center gap-2 text-brand-700">
        <AdditiveIcon size={18} />
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
          {t("stats.additives")}
        </span>
      </div>

      <div className="mt-3.5 grid grid-cols-3 gap-3 sm:gap-4">
        {ADDITIVE_BRANDS.map((b) => (
          <AdditiveLogo key={b.name} name={b.name} logo={b.logo} />
        ))}
      </div>
    </div>
  );
}

/**
 * The supplied logos are wide (~2.4:1) lockups on a white plate, so the tile
 * is landscape too and the image only gets vertical padding — otherwise the
 * wordmarks shrink to nothing.
 */
function AdditiveLogo({ name, logo }: { name: string; logo: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="aspect-[5/2] grid place-items-center rounded-2xl border border-ink-100 bg-white px-2 py-3 sm:py-4">
      {failed ? (
        <span className="text-[11px] sm:text-xs font-semibold text-ink-500 text-center leading-tight">
          {name}
        </span>
      ) : (
        <img
          src={logo}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="max-h-full max-w-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
        />
      )}
    </div>
  );
}

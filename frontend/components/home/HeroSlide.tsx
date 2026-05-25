"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import ScrollHint from "./ScrollHint";

type Props = {
  /** True while the hero is the active slide — used to play/pause the video. */
  active: boolean;
};

/**
 * Full-bleed hero with a background video and centered headline + subtitle.
 * Text content comes from i18n keys `hero.title` and `hero.subtitle`.
 */
export default function HeroSlide({ active }: Props) {
  const { t } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  return (
    <section
      data-snap-section
      data-section="hero"
      className="relative w-full overflow-hidden min-h-[100svh] lg:h-[100svh] lg:snap-start lg:snap-always bg-black"
    >
      <video
        ref={videoRef}
        src="/chilon.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 size-full object-cover"
      />

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/65" />

      {/* Soft glow accents */}
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 size-[28rem] rounded-full bg-brand-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 size-[24rem] rounded-full bg-brand-400/10 blur-[100px]" />

      <div className="relative z-10 min-h-[100svh] lg:h-full flex flex-col items-center justify-center text-center px-6 sm:px-10 lg:px-14">
        <h1 className="display text-white text-[2rem] sm:text-5xl lg:text-[3.75rem] xl:text-7xl 2xl:text-[5.5rem] font-bold leading-[1.05] tracking-tight max-w-5xl">
          <span data-hero-line className="block">
            {t("hero.title")}
          </span>
        </h1>
        <p
          data-hero-sub
          className="mt-5 sm:mt-7 text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl leading-relaxed"
        >
          {t("hero.subtitle")}
        </p>
      </div>

      <ScrollHint light />
    </section>
  );
}

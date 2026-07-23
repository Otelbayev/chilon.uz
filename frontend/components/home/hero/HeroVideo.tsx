"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type Props = {
  /** True while the hero is the active slide — pauses the video off-screen. */
  active: boolean;
};

/**
 * Realistic four-season backdrop for the hero.
 *
 * Layers, bottom to top:
 *   1. the video itself
 *   2. a white scrim that keeps the headline readable on the left and fades
 *      the footage out towards the bottom, where ScrollHint sits
 *
 * The video fades in only once it can actually play, so the vector
 * `SeasonsBackdrop` underneath acts as the poster frame. Under
 * `prefers-reduced-motion` the video is never mounted at all and that vector
 * scene is what the visitor sees.
 */
export default function HeroVideo({ active }: Props) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active, ready]);

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        src="/hero/seasons.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        onCanPlay={() => setReady(true)}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Readability scrims — white, so the dark copy and the dark canister
          both keep their contrast against the footage. */}
      <div className="absolute inset-0 bg-linear-to-r from-white via-white/70 to-white/25 lg:via-white/55 lg:to-transparent" />
      <div className="absolute inset-0 bg-linear-to-b from-white/70 via-transparent to-white" />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CANISTER_IMAGES } from "@/lib/api";

const INTERVAL = 4200;

/**
 * The hero's foreground product shot — canisters cross-fading in place.
 *
 * Client brief (15.07.26): "канистра на первом плане не должна загораживаться
 * какими-то элементами". Everything drawn here sits *behind* the image
 * (the halo ring and the shadow ellipse are earlier siblings with a lower
 * z-index) and the component itself owns its whole grid column — no card,
 * badge or scroll hint is allowed to overlap it.
 */
export default function CanisterShowcase() {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduced || CANISTER_IMAGES.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % CANISTER_IMAGES.length), INTERVAL);
    return () => clearInterval(id);
  }, [reduced]);

  const src = CANISTER_IMAGES[idx];

  return (
    <div data-hero-canister className="relative w-full max-w-[26rem] mx-auto aspect-[4/5]">
      {/* Backdrop halo + shadow — strictly behind the product (z-0).
          The halo is white so the dark canister separates from the mid-toned
          landscape footage playing behind the hero. */}
      <div className="absolute inset-0 z-0 grid place-items-center">
        <div className="size-[92%] rounded-full bg-white/75 blur-2xl" />
        <div className="absolute size-[80%] rounded-full bg-brand-500/10" />
      </div>
      <div className="absolute inset-x-[18%] bottom-[6%] z-0 h-5 rounded-[50%] bg-ink-900/20 blur-lg" />

      {/* Product — top layer of the hero, nothing is painted above it. */}
      <div className="relative z-10 size-full grid place-items-center p-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={src}
            src={src}
            alt=""
            aria-hidden
            initial={reduced ? false : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -18, scale: 0.97 }}
            transition={{ duration: 0.7, ease: [0.21, 1, 0.36, 1] }}
            className="max-h-full max-w-full object-contain drop-shadow-2xl"
          />
        </AnimatePresence>
      </div>

      {/* Position dots — placed under the product, outside its bounding box. */}
      {CANISTER_IMAGES.length > 1 && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {CANISTER_IMAGES.map((img, i) => (
            <button
              key={img}
              onClick={() => setIdx(i)}
              aria-label={`Mahsulot ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === idx ? "w-6 bg-brand-500" : "w-1.5 bg-ink-300 hover:bg-brand-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

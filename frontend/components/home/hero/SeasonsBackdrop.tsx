/**
 * Hero background — the four seasons drawn as flat vector graphics.
 *
 * Client brief (15.07.26): "показать этот же фон, только графикой, двух или
 * трёх цветной. Белый, зелёный и чёрный" — so the whole scene is limited to
 * white (page background), `--color-brand-*` (green) and `--color-ink-900`
 * (black). No photos, no gradients, no realistic imagery.
 *
 * The four season groups cross-fade on a 24s loop (`.season-layer` in
 * globals.css, 6s each). Everything here is decorative: the SVG is
 * `aria-hidden` and never captures pointer events, so it can't sit "on top"
 * of the canister or the copy.
 */

const GREEN = "var(--color-brand-500)";
const GREEN_DEEP = "var(--color-brand-600)";
const INK = "var(--color-ink-900)";

export default function SeasonsBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white">
      <svg
        aria-hidden
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="hero-drift absolute inset-0 size-full"
      >
        {/* Shared ground — stays put while the seasons swap above it. */}
        <path d="M0 700 Q 400 646 800 690 T 1600 668 L1600 900 L0 900 Z" fill={GREEN} opacity="0.07" />
        <path d="M0 700 Q 400 646 800 690 T 1600 668" stroke={INK} strokeWidth="2" fill="none" opacity="0.35" />

        <Spring />
        <Summer />
        <Autumn />
        <Winter />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bahor — blossom branch + rolling hills                              */
/* ------------------------------------------------------------------ */
function Spring() {
  return (
    <g className="season-layer" data-season="spring">
      <path d="M0 700 Q 320 600 640 664 T 1280 620 T 1600 660 L1600 900 L0 900 Z" fill={GREEN} opacity="0.12" />

      {/* Branch sweeping in from the top-left */}
      <path
        d="M-20 90 C 180 150 300 120 430 210 C 520 272 590 258 650 320"
        stroke={INK}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M240 138 C 290 96 330 92 372 108" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M448 224 C 486 268 520 282 566 280" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {BLOSSOMS.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={i % 3 === 0 ? GREEN_DEEP : GREEN} opacity={0.75} />
      ))}

      {/* Sprouts along the horizon */}
      {[220, 380, 1180, 1340, 1460].map((x, i) => (
        <path
          key={x}
          d={`M${x} 690 L${x} ${640 - i * 8} M${x} ${664 - i * 4} C ${x - 34} ${648 - i * 4} ${x - 40} ${618 - i * 4} ${x - 14} ${610 - i * 4}`}
          stroke={GREEN_DEEP}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      ))}
    </g>
  );
}

const BLOSSOMS: Array<[number, number, number]> = [
  [96, 116, 13], [186, 128, 9], [268, 112, 15], [352, 104, 10],
  [404, 176, 12], [452, 226, 8], [514, 264, 14], [568, 280, 9],
  [612, 296, 11], [140, 168, 7], [330, 168, 8], [498, 200, 7],
];

/* ------------------------------------------------------------------ */
/* Yoz — sun, rays and a road running to the horizon                   */
/* ------------------------------------------------------------------ */
function Summer() {
  return (
    <g className="season-layer" data-season="summer">
      <circle cx="1290" cy="196" r="104" fill={GREEN} opacity="0.16" />
      <circle cx="1290" cy="196" r="104" stroke={GREEN_DEEP} strokeWidth="3" fill="none" opacity="0.6" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        const x1 = 1290 + Math.cos(a) * 130;
        const y1 = 196 + Math.sin(a) * 130;
        const x2 = 1290 + Math.cos(a) * 168;
        const y2 = 196 + Math.sin(a) * 168;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GREEN_DEEP} strokeWidth="4" strokeLinecap="round" opacity="0.45" />
        );
      })}

      {/* Road — two edges converging plus a dashed centre line */}
      <path d="M560 900 L742 692 L858 692 L1180 900 Z" fill={INK} opacity="0.07" />
      <path d="M560 900 L742 692" stroke={INK} strokeWidth="4" opacity="0.4" fill="none" />
      <path d="M1180 900 L858 692" stroke={INK} strokeWidth="4" opacity="0.4" fill="none" />
      <path
        d="M868 900 L800 692"
        stroke={GREEN_DEEP}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="34 30"
        fill="none"
        opacity="0.75"
      />

      {/* Field strokes */}
      {[120, 210, 300, 390].map((x, i) => (
        <line key={x} x1={x} y1={694 - i * 6} x2={x + 84} y2={620 - i * 6} stroke={GREEN} strokeWidth="5" strokeLinecap="round" opacity="0.5" />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Kuz — bare tree + drifting leaves                                   */
/* ------------------------------------------------------------------ */
function Autumn() {
  return (
    <g className="season-layer" data-season="autumn">
      {/* Bare tree on the left */}
      <path d="M180 700 L180 430" stroke={INK} strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M180 508 C 120 470 96 420 104 366" stroke={INK} strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M180 470 C 244 434 272 384 268 330" stroke={INK} strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M180 430 C 168 372 186 320 226 286" stroke={INK} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M104 400 C 74 372 68 340 78 312" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />

      {LEAVES.map(([x, y, rot, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={0.7}>
          <path d="M0 0 C 26 -22 58 -18 68 6 C 44 30 12 26 0 0 Z" fill={i % 2 ? GREEN : GREEN_DEEP} />
          <path d="M0 0 L68 6" stroke={INK} strokeWidth="2.5" opacity="0.5" />
        </g>
      ))}
    </g>
  );
}

const LEAVES: Array<[number, number, number, number]> = [
  [420, 180, -18, 1], [560, 300, 34, 0.8], [700, 140, 12, 0.9],
  [880, 268, -40, 1.05], [1020, 172, 22, 0.75], [1180, 330, -12, 0.95],
  [1340, 214, 48, 0.85], [1460, 396, -28, 0.7], [640, 452, 8, 0.65],
  [980, 470, -52, 0.6],
];

/* ------------------------------------------------------------------ */
/* Qish — pine silhouettes + snowflakes                                */
/* ------------------------------------------------------------------ */
function Winter() {
  return (
    <g className="season-layer" data-season="winter">
      {PINES.map(([x, base, h, w], i) => (
        <g key={i} opacity={i % 2 ? 0.85 : 1}>
          <path d={`M${x} ${base - h} L${x + w} ${base} L${x - w} ${base} Z`} fill={INK} opacity="0.8" />
          <path
            d={`M${x} ${base - h * 0.68} L${x + w * 0.78} ${base - h * 0.3} L${x - w * 0.78} ${base - h * 0.3} Z`}
            fill={GREEN_DEEP}
            opacity="0.55"
          />
          <rect x={x - 5} y={base} width="10" height="22" fill={INK} opacity="0.7" />
        </g>
      ))}

      {SNOW.map(([cx, cy, r], i) => (
        <g key={i} opacity={0.65}>
          <circle cx={cx} cy={cy} r={r} fill={i % 3 === 0 ? INK : GREEN} />
          {i % 4 === 0 && (
            <>
              <line x1={cx - r * 2.6} y1={cy} x2={cx + r * 2.6} y2={cy} stroke={GREEN_DEEP} strokeWidth="2" />
              <line x1={cx} y1={cy - r * 2.6} x2={cx} y2={cy + r * 2.6} stroke={GREEN_DEEP} strokeWidth="2" />
            </>
          )}
        </g>
      ))}
    </g>
  );
}

const PINES: Array<[number, number, number, number]> = [
  [130, 700, 250, 78], [268, 706, 180, 58], [1330, 694, 220, 70],
  [1466, 702, 160, 52], [1560, 698, 200, 62],
];

const SNOW: Array<[number, number, number]> = [
  [300, 120, 7], [430, 240, 5], [560, 96, 6], [690, 300, 4],
  [820, 160, 8], [950, 260, 5], [1080, 110, 6], [1210, 320, 5],
  [380, 400, 6], [640, 460, 4], [900, 420, 7], [1150, 470, 5],
  [500, 180, 4], [1020, 360, 4],
];

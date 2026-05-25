import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Dynamic OpenGraph image for the homepage.
 * Telegram, Twitter, Facebook, iMessage etc. fetch this URL automatically.
 *
 * Output size MUST stay 1200×630 — that's what every major scraper expects.
 */
export const runtime = "nodejs";
export const alt = "CHILON — sifatli milliy mahsulot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Inline the logo so the ImageResponse renderer doesn't need a network fetch.
  const logoBytes = readFileSync(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logoBytes.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #064e3b 0%, #047857 45%, #059669 100%)",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Soft glow accents */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "rgba(167, 243, 208, 0.25)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -160,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background: "rgba(16, 185, 129, 0.35)",
            filter: "blur(60px)",
          }}
        />

        {/* Header row: logo + small chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img
            src={logoSrc}
            alt="Chilon"
            width={220}
            height={62}
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 22px",
              borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.12)",
              fontSize: 22,
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: "#a7f3d0",
              }}
            />
            Premium lubricants
          </div>
        </div>

        {/* Main title block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            CHILON — sifatli
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
              color: "#a7f3d0",
            }}
          >
            milliy mahsulot
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 34,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.85)",
              maxWidth: 880,
            }}
          >
            Moylash materiallarini ishlab chiqarish va sotish
          </div>
        </div>

        {/* Footer: domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <span>chilon-uz.vercel.app</span>
          <span>O‘zbekiston · Производство смазочных материалов</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

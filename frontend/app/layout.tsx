import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import ConditionalFooter from "@/components/ConditionalFooter";

const SITE_URL = "https://chilon-uz.vercel.app";
const SITE_NAME = "Chilon Lubricants";
const TITLE = "CHILON — sifatli milliy mahsulot";
const DESCRIPTION =
  "Производство и реализация смазочных материалов. Моторные масла, " +
  "пластичные смазки, индустриальные и железнодорожные смазочные материалы " +
  "от ведущего производителя в Узбекистане.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  keywords: [
    "Chilon",
    "Chilon Lubricants",
    "смазочные материалы",
    "моторные масла",
    "пластичные смазки",
    "железнодорожные смазки",
    "moylash materiallari",
    "motor moylari",
    "Uzbekistan lubricants",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "industry",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "ru_RU",
    alternateLocale: ["uz_UZ", "en_US"],
    // opengraph-image.tsx is picked up automatically — listing it
    // here is optional but makes the URL explicit for crawlers.
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    site: "@chilon",
    creator: "@chilon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="bg-white text-ink-900">
        <Providers>
          <Header />
          <main>{children}</main>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}

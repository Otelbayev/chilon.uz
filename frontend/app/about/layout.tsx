import type { Metadata } from "next";

const TITLE = "О компании";
const DESCRIPTION =
  "Chilon Lubricants — первый высокотехнологичный завод по производству " +
  "смазочных материалов мирового уровня в Узбекистане.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/about",
    type: "website",
  },
  twitter: { title: TITLE, description: DESCRIPTION, card: "summary_large_image" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

const TITLE = "Новости";
const DESCRIPTION =
  "Последние новости компании Chilon Lubricants и отрасли смазочных материалов.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/news" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/news",
    type: "website",
  },
  twitter: { title: TITLE, description: DESCRIPTION, card: "summary_large_image" },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

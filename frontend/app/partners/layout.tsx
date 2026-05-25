import type { Metadata } from "next";

const TITLE = "Партнёры";
const DESCRIPTION =
  "Наши партнёры — надёжные бренды и поставщики, с которыми работает Chilon Lubricants.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/partners" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/partners",
    type: "website",
  },
  twitter: { title: TITLE, description: DESCRIPTION, card: "summary_large_image" },
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return children;
}

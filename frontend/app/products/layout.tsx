import type { Metadata } from "next";

const TITLE = "Каталог продукции";
const DESCRIPTION =
  "Полный каталог продукции Chilon Lubricants: моторные масла, " +
  "пластичные смазки, индустриальные и железнодорожные смазочные материалы.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/products" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/products",
    type: "website",
  },
  twitter: { title: TITLE, description: DESCRIPTION, card: "summary_large_image" },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

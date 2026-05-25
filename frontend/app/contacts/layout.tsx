import type { Metadata } from "next";

const TITLE = "Контакты";
const DESCRIPTION =
  "Свяжитесь с Chilon Lubricants: офисы, отделы продаж, региональные дилеры.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contacts" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/contacts",
    type: "website",
  },
  twitter: { title: TITLE, description: DESCRIPTION, card: "summary_large_image" },
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

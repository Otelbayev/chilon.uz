export type NavItem = {
  href: string;
  /** i18n key — see `lib/i18n.tsx` */
  key: string;
  /** If set, show a dropdown panel on hover */
  dropdown?: "products";
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/about", key: "nav.about" },
  { href: "/news", key: "nav.news" },
  { href: "/products", key: "nav.products", dropdown: "products" },
  { href: "/buy", key: "nav.buy" },
  { href: "/specialists", key: "nav.specialists" },
];

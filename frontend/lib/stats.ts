import type { ComponentType } from 'react';
import {
  YearsIcon,
  TonsIcon,
  TeamIcon,
  ProductsIcon,
  DealersIcon,
} from '@/components/icons/StatIcons';

/**
 * Company figures shown on the home page.
 *
 * Client brief (15.07.26): "Мне тут не хватило цифр, сколько лет на рынке,
 * сколько тонн мы продали, сколько у нас работают сотрудников."
 *
 * Values live here (not in the CMS) for now — the plan is to move them to
 * `site_settings` once the client confirms the real numbers.
 *
 * ⚠️  APPROXIMATE PLACEHOLDERS — every value marked `approx: true` below was
 * estimated to unblock the layout, NOT supplied by the client. They must be
 * confirmed before this goes to production; the UI renders a "~" in front of
 * them so nobody mistakes an estimate for a verified figure.
 */

/** From the logo lockup: "CHILON — SINCE 2013". */
export const FOUNDED_YEAR = 2013;

export type Stat = {
  /** i18n key for the caption under the number. */
  labelKey: string;
  value: string;
  /** Unit rendered smaller next to the value (e.g. "t"). */
  suffix?: string;
  /** True while the figure is our estimate rather than the client's. */
  approx?: boolean;
  icon: ComponentType<{ size?: number }>;
};

export function getStats(): Stat[] {
  const years = new Date().getFullYear() - FOUNDED_YEAR;

  return [
    {
      // Derived from the logo lockup, so this one is solid.
      labelKey: 'home.stat.years',
      value: `${years}+`,
      icon: YearsIcon,
    },
    {
      // TODO(client): tonnes sold — total since 2013, or per year?
      labelKey: 'home.stat.tons',
      value: '12 000',
      suffix: 't',
      approx: true,
      icon: TonsIcon,
    },
    {
      // TODO(client): confirm current headcount.
      labelKey: 'home.stat.employees',
      value: '120',
      approx: true,
      icon: TeamIcon,
    },
    {
      labelKey: 'home.stat.products',
      value: '130+',
      icon: ProductsIcon,
    },
    {
      labelKey: 'home.stat.dealers',
      value: '9',
      icon: DealersIcon,
    },
  ];
}

/**
 * Additive suppliers whose base packages Chilon blends with.
 * Client brief: "Добавить иконки присадок" (lubrizol / infineum / PXL).
 *
 * Logos go in `public/additives/`. A missing file degrades to the brand name.
 */
export const ADDITIVE_BRANDS = [
  { name: 'Lubrizol', logo: '/additives/lubrizol.png' },
  { name: 'Infineum', logo: '/additives/infineum.png' },
  { name: 'PXL Chemicals', logo: '/additives/pxl.png' },
];

'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const path = usePathname();
  if (path === '/') return null;
  return <Footer />;
}

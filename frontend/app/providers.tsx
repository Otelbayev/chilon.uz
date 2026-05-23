'use client';

import { type ReactNode } from 'react';
import { LangProvider } from '@/lib/i18n';
import SmoothScroll from '@/components/SmoothScroll';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <SmoothScroll />
      {children}
    </LangProvider>
  );
}

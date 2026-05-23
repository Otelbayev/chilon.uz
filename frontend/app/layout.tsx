import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Header from '@/components/Header';
import ConditionalFooter from '@/components/ConditionalFooter';

export const metadata: Metadata = {
  title: 'Chilon — Premium moylash mahsulotlari',
  description: 'Yuqori sifatli motor moylari, smazka va sanoat suyuqliklari.',
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

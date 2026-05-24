import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Chilon Lubricants — O‘zbekistondagi yetakchi moylash mahsulotlari zavodi',
  description:
    'Premium sintetik motor moylari, gidravlik, transmissiya va sanoat moylash mahsulotlari. 2013-yildan beri. Toshkent / O‘zbekiston bo‘ylab yetkazib berish.',
  metadataBase: new URL('https://chilon.uz'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap"
        />
      </head>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

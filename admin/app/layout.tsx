import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chilon Admin',
  description: 'Chilon Lubricants administration panel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

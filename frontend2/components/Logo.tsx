'use client';

import Link from 'next/link';

export default function Logo({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Chilon Lubricants">
      <img
        src="/logo.png"
        alt="Chilon Lubricants"
        className={size === 'sm' ? 'logo-mark-sm' : 'logo-mark'}
        draggable={false}
      />
    </Link>
  );
}

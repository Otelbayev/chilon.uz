'use client';

import type { ReactNode } from 'react';

export default function Marquee({
  children, reverse = false, className = '',
}: { children: ReactNode; reverse?: boolean; className?: string }) {
  return (
    <div className={`marquee ${reverse ? 'marquee-reverse' : ''} ${className}`}>
      <div className="marquee-track">{children}</div>
      <div className="marquee-track" aria-hidden>{children}</div>
    </div>
  );
}

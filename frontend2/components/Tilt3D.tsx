'use client';

import { useRef, type ReactNode } from 'react';

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  intensity?: number;  // degrees
  glare?: boolean;
}

export default function Tilt3D({ children, className = '', intensity = 10, glare = true }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * intensity;
    const ry = (px - 0.5) * intensity;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    if (glare) {
      el.style.setProperty('--gx', `${px * 100}%`);
      el.style.setProperty('--gy', `${py * 100}%`);
    }
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={
        glare
          ? ({
              backgroundImage:
                'radial-gradient(420px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,176,91,0.10), transparent 45%)',
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}

'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'span' | 'h1' | 'h2' | 'h3' | 'p';
  stagger?: number;
}

export default function Reveal({
  children,
  delay = 0,
  y = 40,
  duration = 0.9,
  className = '',
  as: Tag = 'div',
  stagger,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const targets = stagger ? el.children : el;

    const tween = gsap.fromTo(
      targets,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
        stagger: stagger || 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y, duration, stagger]);

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLang, LANGS } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

const LABEL: Record<Lang, string> = { uz: 'UZ', en: 'EN', ru: 'RU' };
const FULL: Record<Lang, string> = { uz: 'O‘zbek', en: 'English', ru: 'Русский' };

export default function LangSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className={`inline-flex items-center gap-1.5 rounded-md font-semibold text-[--color-ink-700] hover:text-[--color-brand-700] transition-colors ${
          compact ? 'text-xs px-2 py-1' : 'text-sm px-2.5 py-1.5'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className={compact ? 'size-3.5' : 'size-4'} />
        {LABEL[lang]}
        <svg width="10" height="10" viewBox="0 0 10 10" className={`opacity-60 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            role="listbox"
            className="absolute right-0 mt-2 min-w-40 rounded-lg border border-[--color-ink-100] bg-white p-1 shadow-soft z-50"
          >
            {LANGS.map((l) => (
              <li key={l}>
                <button
                  onClick={() => { setLang(l); setOpen(false); }}
                  className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    l === lang
                      ? 'bg-[--color-brand-50] text-[--color-brand-700] font-semibold'
                      : 'text-[--color-ink-800] hover:bg-[--color-cream]'
                  }`}
                >
                  <span>{FULL[l]}</span>
                  <span className="text-xs opacity-60 font-semibold">{LABEL[l]}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function Globe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2.75 10h14.5M10 2.75c2.2 2.5 3.4 5 3.4 7.25 0 2.25-1.2 4.75-3.4 7.25M10 2.75c-2.2 2.5-3.4 5-3.4 7.25 0 2.25 1.2 4.75 3.4 7.25" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

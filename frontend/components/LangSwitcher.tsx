'use client';

import { useState, useRef, useEffect } from 'react';
import { useLang, LANGS, type Lang } from '@/lib/i18n';

const LABEL: Record<Lang, string> = { uz: 'UZ', en: 'EN', ru: 'RU' };

export default function LangSwitcher({ light = false }: { light?: boolean }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
          light
            ? 'border-white/40 text-white hover:border-white hover:bg-white/10'
            : 'border-ink-300 text-ink-900 hover:border-brand-500 hover:text-brand-600'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{LABEL[lang]}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-2 w-24 overflow-hidden rounded-2xl border border-ink-300 bg-white shadow-xl z-50"
        >
          {LANGS.map((l) => (
            <li key={l}>
              <button
                onClick={() => { setLang(l); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  l === lang ? 'bg-brand-50 text-brand-700 font-medium' : 'hover:bg-ink-100 text-ink-900'
                }`}
              >
                {LABEL[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

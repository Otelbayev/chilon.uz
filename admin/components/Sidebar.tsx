'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/api';

const nav = [
  { href: '/dashboard',  label: 'Dashboard',         icon: '📊' },
  { href: '/categories', label: 'Kategoriyalar',      icon: '🗂️' },
  { href: '/products',   label: 'Mahsulotlar',        icon: '🛢️' },
  { href: '/news',       label: 'Yangiliklar',        icon: '📰' },
  { href: '/pages',      label: 'Sahifalar',          icon: '📄' },
  { href: '/partners',   label: 'Hamkorlar',          icon: '🤝' },
  { href: '/contacts',   label: 'Kontaktlar',         icon: '📞' },
  { href: '/callbacks',  label: 'Qo\'ng\'iroqlar',    icon: '📨' },
  { href: '/uploads',    label: 'Fayllar',            icon: '🖼️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    clearToken();
    router.replace('/login');
  };

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="text-lg font-bold text-brand">CHILON</div>
        <div className="text-xs text-gray-500">Admin Panel</div>
      </div>
      <nav className="flex-1 py-2 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 text-sm transition ${
                active
                  ? 'bg-brand-50 text-brand-700 border-r-2 border-brand'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-200 p-3">
        <button onClick={logout} className="btn-ghost w-full justify-start">
          <span>🚪</span>
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  );
}

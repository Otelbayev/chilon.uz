'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { api } from '@/lib/api';

interface PageRow { slug: string; updated_at: string }

export default function PagesListPage() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [siteKeys, setSiteKeys] = useState<string[]>([]);

  useEffect(() => {
    api.get<PageRow[]>('/api/pages').then(setPages);
    api.get<Record<string, any>>('/api/site').then((s) => setSiteKeys(Object.keys(s)));
  }, []);

  return (
    <>
      <Topbar title="Sahifalar va sozlamalar" />
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="px-4 py-3 border-b border-gray-200 font-semibold">Sahifalar</div>
          <ul className="divide-y divide-gray-100">
            {pages.map((p) => (
              <li key={p.slug} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium font-mono text-sm">{p.slug}</div>
                  <div className="text-xs text-gray-500">{new Date(p.updated_at).toLocaleString('ru')}</div>
                </div>
                <Link href={`/pages/${p.slug}`} className="btn-secondary">Tahrir</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="px-4 py-3 border-b border-gray-200 font-semibold">Sayt sozlamalari</div>
          <ul className="divide-y divide-gray-100">
            {siteKeys.map((k) => (
              <li key={k} className="px-4 py-3 flex items-center justify-between">
                <div className="font-medium font-mono text-sm">{k}</div>
                <Link href={`/pages/site:${k}`} className="btn-secondary">Tahrir</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

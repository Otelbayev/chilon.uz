'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { api } from '@/lib/api';
import type { Stats, CallbackRequest } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<CallbackRequest[]>([]);

  useEffect(() => {
    api.get<Stats>('/api/admin/stats').then(setStats).catch(() => null);
    api.get<{ items: CallbackRequest[] }>('/api/admin/callbacks?limit=5')
      .then((r) => setRecent(r.items)).catch(() => null);
  }, []);

  const cards = [
    { label: 'Mahsulotlar',   value: stats?.products,        href: '/products',   color: 'bg-blue-500' },
    { label: 'Kategoriyalar',  value: stats?.categories,      href: '/categories', color: 'bg-emerald-500' },
    { label: 'Yangiliklar',    value: stats?.news,            href: '/news',       color: 'bg-violet-500' },
    { label: 'Hamkorlar',      value: stats?.partners,        href: '/partners',   color: 'bg-amber-500' },
    { label: 'Qo\'ng\'iroqlar (yangi)', value: stats?.callbacksNew, href: '/callbacks',  color: 'bg-rose-500' },
    { label: 'Qo\'ng\'iroqlar (jami)',   value: stats?.callbacksTotal, href: '/callbacks', color: 'bg-gray-500' },
  ];

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Link key={c.label} href={c.href} className="card p-4 hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg ${c.color} text-white grid place-items-center text-lg font-bold`}>
                  #
                </div>
                <div>
                  <div className="text-sm text-gray-500">{c.label}</div>
                  <div className="text-2xl font-semibold">{c.value ?? '—'}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold">So'nggi qo'ng'iroq so'rovlari</h2>
            <Link href="/callbacks" className="text-sm text-brand hover:underline">Hammasi →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">So'rovlar yo'q</div>
          ) : (
            <table className="table">
              <thead>
                <tr><th className="th">Ism</th><th className="th">Telefon</th><th className="th">Status</th><th className="th">Vaqt</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recent.map((r) => (
                  <tr key={r.id}>
                    <td className="td">{r.name}</td>
                    <td className="td">{r.phone}</td>
                    <td className="td">
                      <span className={`badge ${
                        r.status === 'new' ? 'bg-blue-100 text-blue-700'
                          : r.status === 'contacted' ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>{r.status}</span>
                    </td>
                    <td className="td">{new Date(r.created_at).toLocaleString('ru')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

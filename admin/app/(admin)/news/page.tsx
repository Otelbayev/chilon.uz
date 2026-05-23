'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { api, uploadUrl } from '@/lib/api';
import type { NewsArticle } from '@/lib/types';

export default function NewsPage() {
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    // Admin needs unpublished too: use site endpoint via raw query without published filter
    api.get<{ items: NewsArticle[] }>('/api/admin/news?limit=100')
      .then((r) => setItems(r.items))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm(`Yangilikni o'chirasizmi?`)) return;
    await api.delete(`/api/admin/news/${id}`);
    load();
  };

  return (
    <>
      <Topbar
        title="Yangiliklar"
        action={<Link href="/news/new" className="btn-primary">+ Yangi</Link>}
      />
      <div className="p-6">
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Yuklanmoqda…</div>
          ) : (
            <table className="table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th">Rasm</th>
                  <th className="th">Sana</th>
                  <th className="th">Sarlavha</th>
                  <th className="th">Slug</th>
                  <th className="th"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((n) => (
                  <tr key={n.id}>
                    <td className="td">
                      {n.image ? (
                        <img src={uploadUrl(n.image)} alt="" className="h-10 w-16 rounded object-cover border" />
                      ) : <div className="h-10 w-16 rounded bg-gray-100" />}
                    </td>
                    <td className="td text-xs">{n.date}</td>
                    <td className="td">
                      <div>{n.title?.ru}</div>
                      <div className="text-xs text-gray-500">{n.title?.uz}</div>
                    </td>
                    <td className="td font-mono text-xs">{n.slug}</td>
                    <td className="td">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/news/${n.id}`} className="btn-secondary">Tahrir</Link>
                        <button onClick={() => remove(n.id)} className="btn-danger">O'chirish</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={5} className="td text-center text-gray-500 py-6">Yangiliklar yo'q</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

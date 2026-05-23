'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { api } from '@/lib/api';
import type { Category } from '@/lib/types';

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get<Category[]>('/api/categories').then(setItems).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm(`"${id}" kategoriyasini o'chirishni tasdiqlaysizmi? Barcha mahsulotlari ham o'chiriladi.`)) return;
    await api.delete(`/api/admin/categories/${id}`);
    load();
  };

  return (
    <>
      <Topbar
        title="Kategoriyalar"
        action={<Link href="/categories/new" className="btn-primary">+ Yangi</Link>}
      />
      <div className="p-6">
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Yuklanmoqda…</div>
          ) : (
            <table className="table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th">ID</th>
                  <th className="th">Slug</th>
                  <th className="th">Nomi (RU / UZ)</th>
                  <th className="th">Tartib</th>
                  <th className="th"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((c) => (
                  <tr key={c.id}>
                    <td className="td font-mono text-xs">{c.id}</td>
                    <td className="td font-mono text-xs">{c.slug}</td>
                    <td className="td">
                      <div>{c.name?.ru}</div>
                      <div className="text-xs text-gray-500">{c.name?.uz}</div>
                    </td>
                    <td className="td">{c.sort_order}</td>
                    <td className="td">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/categories/${c.id}`} className="btn-secondary">Tahrir</Link>
                        <button onClick={() => remove(c.id)} className="btn-danger">O'chirish</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={5} className="td text-center text-gray-500 py-6">Kategoriyalar yo'q</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

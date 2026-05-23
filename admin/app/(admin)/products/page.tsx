'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { api, uploadUrl } from '@/lib/api';
import type { Category, Product } from '@/lib/types';

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    params.set('limit', String(limit));
    params.set('offset', String(offset));

    api.get<{ items: Product[]; total: number }>(`/api/products?${params}`)
      .then((r) => { setItems(r.items); setTotal(r.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get<Category[]>('/api/categories').then(setCats);
  }, []);

  useEffect(load, [search, category, offset]);

  const remove = async (id: string) => {
    if (!confirm(`"${id}" mahsulotini o'chirasizmi?`)) return;
    await api.delete(`/api/admin/products/${id}`);
    load();
  };

  return (
    <>
      <Topbar
        title={`Mahsulotlar (${total})`}
        action={<Link href="/products/new" className="btn-primary">+ Yangi</Link>}
      />
      <div className="p-6 space-y-4">
        <div className="card p-3 flex flex-wrap items-center gap-2">
          <input
            className="input flex-1 min-w-[180px]"
            placeholder="Qidirish (nom yoki kod)..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
          />
          <select
            className="input max-w-xs"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setOffset(0); }}
          >
            <option value="">Barcha kategoriyalar</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>{c.name?.ru}</option>
            ))}
          </select>
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Yuklanmoqda…</div>
          ) : (
            <table className="table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th">Rasm</th>
                  <th className="th">ID</th>
                  <th className="th">Nomi</th>
                  <th className="th">Kategoriya</th>
                  <th className="th">Kod</th>
                  <th className="th">Spec</th>
                  <th className="th"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((p) => (
                  <tr key={p.id}>
                    <td className="td">
                      {p.image ? (
                        <img src={uploadUrl(p.image)} alt="" className="h-10 w-10 rounded object-cover border" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-100" />
                      )}
                    </td>
                    <td className="td font-mono text-xs">{p.id}</td>
                    <td className="td">{p.name}</td>
                    <td className="td text-xs">{p.category_slug}</td>
                    <td className="td text-xs">{p.code || '—'}</td>
                    <td className="td text-xs">
                      {Object.entries(p.specs || {}).slice(0, 3).map(([k, v]) => (
                        <span key={k} className="inline-block mr-1 px-1.5 py-0.5 rounded bg-gray-100">
                          {k}={String(v)}
                        </span>
                      ))}
                    </td>
                    <td className="td">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/products/${p.id}`} className="btn-secondary">Tahrir</Link>
                        <button onClick={() => remove(p.id)} className="btn-danger">O'chirish</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={7} className="td text-center text-gray-500 py-6">Mahsulotlar yo'q</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{offset + 1}–{Math.min(offset + limit, total)} / {total}</span>
          <div className="flex gap-2">
            <button className="btn-secondary" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))}>← Oldingi</button>
            <button className="btn-secondary" disabled={offset + limit >= total} onClick={() => setOffset(offset + limit)}>Keyingi →</button>
          </div>
        </div>
      </div>
    </>
  );
}

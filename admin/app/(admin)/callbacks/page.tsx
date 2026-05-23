'use client';

import { useEffect, useState } from 'react';
import Topbar from '@/components/Topbar';
import { api } from '@/lib/api';
import type { CallbackRequest } from '@/lib/types';

const STATUSES: CallbackRequest['status'][] = ['new', 'contacted', 'closed'];

const statusBadge = (s: CallbackRequest['status']) =>
  s === 'new' ? 'bg-blue-100 text-blue-700'
    : s === 'contacted' ? 'bg-amber-100 text-amber-700'
    : 'bg-gray-100 text-gray-700';

export default function CallbacksPage() {
  const [items, setItems] = useState<CallbackRequest[]>([]);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const qs = status ? `?status=${status}` : '';
    api.get<{ items: CallbackRequest[] }>(`/api/admin/callbacks${qs}`)
      .then((r) => setItems(r.items))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status]);

  const updateStatus = async (id: number, newStatus: string) => {
    await api.patch(`/api/admin/callbacks/${id}`, { status: newStatus });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm('O\'chirasizmi?')) return;
    await api.delete(`/api/admin/callbacks/${id}`);
    load();
  };

  return (
    <>
      <Topbar title="Qo'ng'iroq so'rovlari" />
      <div className="p-6 space-y-4">
        <div className="card p-3 flex gap-2 items-center">
          <span className="text-sm text-gray-600">Status filtri:</span>
          <button
            onClick={() => setStatus('')}
            className={status === '' ? 'btn-primary' : 'btn-secondary'}
          >Barchasi</button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={status === s ? 'btn-primary' : 'btn-secondary'}
            >{s}</button>
          ))}
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Yuklanmoqda…</div>
          ) : (
            <table className="table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th">ID</th>
                  <th className="th">Sana</th>
                  <th className="th">Ism</th>
                  <th className="th">Telefon</th>
                  <th className="th">Xabar</th>
                  <th className="th">Status</th>
                  <th className="th"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((r) => (
                  <tr key={r.id}>
                    <td className="td font-mono text-xs">#{r.id}</td>
                    <td className="td text-xs">{new Date(r.created_at).toLocaleString('ru')}</td>
                    <td className="td">{r.name}</td>
                    <td className="td">
                      <a href={`tel:${r.phone}`} className="text-brand hover:underline">{r.phone}</a>
                    </td>
                    <td className="td max-w-xs whitespace-normal text-xs">{r.message || '—'}</td>
                    <td className="td">
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        className={`badge border-0 ${statusBadge(r.status)} cursor-pointer`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="td">
                      <button onClick={() => remove(r.id)} className="btn-danger !px-2 !py-1 !text-xs">×</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={7} className="td text-center text-gray-500 py-6">So'rovlar yo'q</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Topbar from '@/components/Topbar';
import ImagePicker from '@/components/ImagePicker';
import { api, uploadUrl } from '@/lib/api';
import type { Partner } from '@/lib/types';

export default function PartnersPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<Partner>>({ name: '', logo: '', url: '', sort_order: 0 });
  const [error, setError] = useState<string | null>(null);

  const load = () => api.get<Partner[]>('/api/partners').then(setItems);
  useEffect(() => { load(); }, []);

  const startNew = () => {
    setEditingId(0);
    setDraft({ name: '', logo: '', url: '', sort_order: items.length });
  };
  const startEdit = (p: Partner) => { setEditingId(p.id); setDraft(p); };
  const cancel = () => { setEditingId(null); setDraft({}); setError(null); };

  const save = async () => {
    setError(null);
    try {
      if (editingId === 0) {
        await api.post('/api/admin/partners', draft);
      } else if (editingId) {
        await api.put(`/api/admin/partners/${editingId}`, draft);
      }
      cancel();
      load();
    } catch (e: any) { setError(e.message); }
  };

  const remove = async (id: number) => {
    if (!confirm('O\'chirasizmi?')) return;
    await api.delete(`/api/admin/partners/${id}`);
    load();
  };

  return (
    <>
      <Topbar
        title="Hamkorlar"
        action={<button onClick={startNew} className="btn-primary">+ Yangi</button>}
      />
      <div className="p-6 space-y-4">
        {editingId !== null && (
          <div className="card p-5 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Nomi</label>
                <input className="input" value={draft.name || ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div>
                <label className="label">URL</label>
                <input className="input" value={draft.url || ''} onChange={(e) => setDraft({ ...draft, url: e.target.value })} />
              </div>
            </div>
            <ImagePicker label="Logo" value={draft.logo} onChange={(url) => setDraft({ ...draft, logo: url })} />
            <div>
              <label className="label">Tartib</label>
              <input type="number" className="input" value={draft.sort_order ?? 0} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="flex gap-2">
              <button onClick={save} className="btn-primary">Saqlash</button>
              <button onClick={cancel} className="btn-secondary">Bekor</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((p) => (
            <div key={p.id} className="card p-3 flex flex-col items-center gap-2">
              <div className="h-20 w-full grid place-items-center">
                {p.logo ? (
                  <img src={uploadUrl(p.logo)} alt={p.name} className="max-h-20 max-w-full object-contain" />
                ) : (
                  <div className="text-xs text-gray-400">no logo</div>
                )}
              </div>
              <div className="text-xs text-center truncate w-full">{p.name}</div>
              <div className="flex gap-1 w-full">
                <button onClick={() => startEdit(p)} className="btn-secondary flex-1 !px-2 !py-1 !text-xs">Tahrir</button>
                <button onClick={() => remove(p.id)} className="btn-danger flex-1 !px-2 !py-1 !text-xs">×</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

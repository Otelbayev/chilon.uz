'use client';

import { useEffect, useState } from 'react';
import Topbar from '@/components/Topbar';
import LangInput from '@/components/LangInput';
import { api } from '@/lib/api';
import type { Department, Dealer, LangBundle } from '@/lib/types';

export default function ContactsPage() {
  const [depts, setDepts] = useState<Department[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [tab, setTab] = useState<'departments' | 'dealers'>('departments');

  const load = () => {
    api.get<Department[]>('/api/admin/contacts/departments').then(setDepts);
    api.get<Dealer[]>('/api/admin/contacts/dealers').then(setDealers);
  };
  useEffect(load, []);

  return (
    <>
      <Topbar title="Kontaktlar" />
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setTab('departments')} className={tab === 'departments' ? 'btn-primary' : 'btn-secondary'}>Bo'limlar ({depts.length})</button>
          <button onClick={() => setTab('dealers')}    className={tab === 'dealers' ?    'btn-primary' : 'btn-secondary'}>Dilerlar ({dealers.length})</button>
        </div>

        {tab === 'departments' ? (
          <DepartmentsList items={depts} onChange={load} />
        ) : (
          <DealersList items={dealers} onChange={load} />
        )}
      </div>
    </>
  );
}

function DepartmentsList({ items, onChange }: { items: Department[]; onChange: () => void }) {
  const [draft, setDraft] = useState<Partial<Department> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startNew = () => { setEditingId(''); setDraft({ id: '', name: { ru: '', uz: '' }, phones: [''], sort_order: items.length }); };
  const startEdit = (d: Department) => { setEditingId(d.id); setDraft({ ...d, phones: [...d.phones] }); };
  const cancel = () => { setEditingId(null); setDraft(null); setError(null); };

  const save = async () => {
    if (!draft) return;
    setError(null);
    try {
      const body = { ...draft, phones: (draft.phones || []).filter((p) => p.trim()) };
      if (editingId === '') {
        await api.post('/api/admin/contacts/departments', body);
      } else {
        await api.put(`/api/admin/contacts/departments/${editingId}`, body);
      }
      cancel();
      onChange();
    } catch (e: any) { setError(e.message); }
  };

  const remove = async (id: string) => {
    if (!confirm('O\'chirasizmi?')) return;
    await api.delete(`/api/admin/contacts/departments/${id}`);
    onChange();
  };

  return (
    <div className="space-y-3">
      <button onClick={startNew} className="btn-primary">+ Yangi bo'lim</button>

      {draft && (
        <div className="card p-5 space-y-3">
          <div>
            <label className="label">ID</label>
            <input className="input font-mono" value={draft.id || ''} onChange={(e) => setDraft({ ...draft, id: e.target.value })} disabled={editingId !== ''} />
          </div>
          <LangInput label="Nomi" value={draft.name as LangBundle} onChange={(v) => setDraft({ ...draft, name: v })} />
          <div>
            <label className="label">Telefonlar</label>
            <div className="space-y-1">
              {(draft.phones || []).map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="input flex-1"
                    value={p}
                    onChange={(e) => {
                      const phones = [...(draft.phones || [])];
                      phones[i] = e.target.value;
                      setDraft({ ...draft, phones });
                    }}
                  />
                  <button onClick={() => setDraft({ ...draft, phones: (draft.phones || []).filter((_, j) => j !== i) })} className="btn-danger">×</button>
                </div>
              ))}
              <button onClick={() => setDraft({ ...draft, phones: [...(draft.phones || []), ''] })} className="btn-secondary">+ telefon</button>
            </div>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex gap-2"><button onClick={save} className="btn-primary">Saqlash</button><button onClick={cancel} className="btn-secondary">Bekor</button></div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="table">
          <thead className="bg-gray-50"><tr><th className="th">ID</th><th className="th">Nomi</th><th className="th">Telefonlar</th><th className="th"></th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((d) => (
              <tr key={d.id}>
                <td className="td font-mono text-xs">{d.id}</td>
                <td className="td">{d.name?.ru}</td>
                <td className="td text-xs">{d.phones.join(', ')}</td>
                <td className="td">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => startEdit(d)} className="btn-secondary">Tahrir</button>
                    <button onClick={() => remove(d.id)} className="btn-danger">O'chirish</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DealersList({ items, onChange }: { items: Dealer[]; onChange: () => void }) {
  const [draft, setDraft] = useState<Partial<Dealer> | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startNew = () => { setEditingId(0); setDraft({ region: { ru: '', uz: '' }, phone: '', sort_order: items.length }); };
  const startEdit = (d: Dealer) => { setEditingId(d.id); setDraft(d); };
  const cancel = () => { setEditingId(null); setDraft(null); setError(null); };

  const save = async () => {
    if (!draft) return;
    setError(null);
    try {
      if (editingId === 0) {
        await api.post('/api/admin/contacts/dealers', draft);
      } else if (editingId) {
        await api.put(`/api/admin/contacts/dealers/${editingId}`, draft);
      }
      cancel();
      onChange();
    } catch (e: any) { setError(e.message); }
  };

  const remove = async (id: number) => {
    if (!confirm('O\'chirasizmi?')) return;
    await api.delete(`/api/admin/contacts/dealers/${id}`);
    onChange();
  };

  return (
    <div className="space-y-3">
      <button onClick={startNew} className="btn-primary">+ Yangi diler</button>

      {draft && (
        <div className="card p-5 space-y-3">
          <LangInput label="Hudud" value={draft.region as LangBundle} onChange={(v) => setDraft({ ...draft, region: v })} />
          <div>
            <label className="label">Telefon</label>
            <input className="input" value={draft.phone || ''} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex gap-2"><button onClick={save} className="btn-primary">Saqlash</button><button onClick={cancel} className="btn-secondary">Bekor</button></div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="table">
          <thead className="bg-gray-50"><tr><th className="th">Hudud</th><th className="th">Telefon</th><th className="th"></th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((d) => (
              <tr key={d.id}>
                <td className="td">
                  <div>{d.region?.ru}</div>
                  <div className="text-xs text-gray-500">{d.region?.uz}</div>
                </td>
                <td className="td"><a href={`tel:${d.phone}`} className="text-brand hover:underline">{d.phone}</a></td>
                <td className="td">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => startEdit(d)} className="btn-secondary">Tahrir</button>
                    <button onClick={() => remove(d.id)} className="btn-danger">O'chirish</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

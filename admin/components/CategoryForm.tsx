'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import LangInput from '@/components/LangInput';
import ImagePicker from '@/components/ImagePicker';
import { api } from '@/lib/api';
import type { Category, LangBundle } from '@/lib/types';

interface Props {
  mode: 'create' | 'edit';
  id?: string;
}

export default function CategoryForm({ mode, id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Category>>({
    id: '',
    slug: '',
    name: { ru: '', uz: '' },
    description: { ru: '', uz: '' },
    icon: '',
    image: '',
    sort_order: 0,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && id) {
      api.get<Category>(`/api/categories/${id}`).then((c) =>
        setForm({
          ...c,
          name: c.name || { ru: '', uz: '' },
          description: c.description || { ru: '', uz: '' },
        })
      );
    }
  }, [mode, id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'create') {
        await api.post('/api/admin/categories', form);
      } else {
        await api.put(`/api/admin/categories/${id}`, form);
      }
      router.push('/categories');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Topbar title={mode === 'create' ? 'Yangi kategoriya' : `Tahrir: ${id}`} />
      <form onSubmit={submit} className="p-6 max-w-3xl space-y-4">
        <div className="card p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">ID <span className="text-red-500">*</span></label>
              <input
                className="input font-mono"
                value={form.id || ''}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                disabled={mode === 'edit'}
                required
              />
            </div>
            <div>
              <label className="label">Slug <span className="text-red-500">*</span></label>
              <input
                className="input font-mono"
                value={form.slug || ''}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
              />
            </div>
          </div>

          <LangInput
            label="Nomi"
            required
            value={form.name as LangBundle}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <LangInput
            label="Tavsif"
            textarea
            value={form.description as LangBundle}
            onChange={(v) => setForm({ ...form, description: v })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Icon yo'li</label>
              <input
                className="input"
                value={form.icon || ''}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="/assets/icons/grease.svg"
              />
            </div>
            <div>
              <label className="label">Tartib raqami</label>
              <input
                type="number"
                className="input"
                value={form.sort_order ?? 0}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </div>
          </div>

          <ImagePicker
            label="Asosiy rasm"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>
        )}

        <div className="flex gap-2">
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? 'Saqlanmoqda…' : 'Saqlash'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">Bekor</button>
        </div>
      </form>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import LangInput from '@/components/LangInput';
import ImagePicker from '@/components/ImagePicker';
import { api } from '@/lib/api';
import type { NewsArticle, LangBundle } from '@/lib/types';

export default function NewsForm({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<NewsArticle>>({
    id: '', slug: '', date: new Date().toISOString().slice(0, 10),
    title: { ru: '', uz: '' },
    excerpt: { ru: '', uz: '' },
    content: { ru: '', uz: '' },
    image: '', published: true,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && id) {
      api.get<NewsArticle>(`/api/admin/news/${id}`).then((n) =>
        setForm({
          ...n,
          // n.id is slug in this endpoint - we need an admin-specific lookup
          title:   n.title   || { ru: '', uz: '' },
          excerpt: n.excerpt || { ru: '', uz: '' },
          content: n.content || { ru: '', uz: '' },
          date: n.date?.slice(0, 10),
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
        await api.post('/api/admin/news', form);
      } else {
        await api.put(`/api/admin/news/${id}`, form);
      }
      router.push('/news');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Topbar title={mode === 'create' ? 'Yangi yangilik' : `Tahrir: ${id}`} />
      <form onSubmit={submit} className="p-6 max-w-3xl space-y-4">
        <div className="card p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <label className="label">Sana <span className="text-red-500">*</span></label>
              <input
                type="date"
                className="input"
                value={form.date || ''}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
          </div>

          <LangInput label="Sarlavha" required value={form.title as LangBundle} onChange={(v) => setForm({ ...form, title: v })} />
          <LangInput label="Qisqacha mazmun" textarea value={form.excerpt as LangBundle} onChange={(v) => setForm({ ...form, excerpt: v })} />
          <LangInput label="To'liq kontent" textarea value={form.content as LangBundle} onChange={(v) => setForm({ ...form, content: v })} />
          <ImagePicker value={form.image} onChange={(url) => setForm({ ...form, image: url })} />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published !== false}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Nashr qilingan
          </label>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>}

        <div className="flex gap-2">
          <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Saqlanmoqda…' : 'Saqlash'}</button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">Bekor</button>
        </div>
      </form>
    </>
  );
}

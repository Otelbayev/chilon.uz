'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import LangInput from '@/components/LangInput';
import ImagePicker from '@/components/ImagePicker';
import { api } from '@/lib/api';
import type { Category, Product, LangBundle } from '@/lib/types';

export default function ProductForm({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
  const router = useRouter();
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState<Partial<Product>>({
    id: '', category_id: '', name: '', code: '', applications: '',
    description: { ru: '', uz: '' }, specs: {}, image: '', sort_order: 0,
  });
  const [specsText, setSpecsText] = useState('{}');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Category[]>('/api/categories').then(setCats);
    if (mode === 'edit' && id) {
      api.get<Product>(`/api/products/${id}`).then((p) => {
        setForm({
          ...p,
          description: p.description || { ru: '', uz: '' },
        });
        setSpecsText(JSON.stringify(p.specs || {}, null, 2));
      });
    }
  }, [mode, id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    let specs: Record<string, any> = {};
    try {
      specs = specsText.trim() ? JSON.parse(specsText) : {};
    } catch {
      setBusy(false);
      setError('Specs JSON noto\'g\'ri formatda');
      return;
    }

    const payload = { ...form, specs };
    try {
      if (mode === 'create') {
        await api.post('/api/admin/products', payload);
      } else {
        await api.put(`/api/admin/products/${id}`, payload);
      }
      router.push('/products');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Topbar title={mode === 'create' ? 'Yangi mahsulot' : `Tahrir: ${id}`} />
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
              <label className="label">Kategoriya <span className="text-red-500">*</span></label>
              <select
                className="input"
                value={form.category_id || ''}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                required
              >
                <option value="">— tanlang —</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name?.ru}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Nomi <span className="text-red-500">*</span></label>
            <input
              className="input"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Kod / GOST</label>
              <input
                className="input"
                value={form.code || ''}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Qo'llanilishi</label>
              <input
                className="input"
                value={form.applications || ''}
                onChange={(e) => setForm({ ...form, applications: e.target.value })}
              />
            </div>
          </div>

          <LangInput
            label="Tavsif"
            textarea
            value={form.description as LangBundle}
            onChange={(v) => setForm({ ...form, description: v })}
          />

          <div>
            <label className="label">Texnik xususiyatlar (JSON)</label>
            <textarea
              className="input font-mono text-xs"
              rows={6}
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              placeholder='{ "sae": "10W-40", "api": "GL-5", "tier": "premium" }'
            />
            <p className="text-xs text-gray-500 mt-1">
              Misol kalitlari: <code>sae</code>, <code>api</code>, <code>iso-vg</code>, <code>nlgi</code>, <code>tier</code>, <code>type</code>
            </p>
          </div>

          <ImagePicker
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Tartib</label>
              <input
                type="number"
                className="input"
                value={form.sort_order ?? 0}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </div>
          </div>
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

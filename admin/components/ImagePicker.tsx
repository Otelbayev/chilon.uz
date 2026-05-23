'use client';

import { useState } from 'react';
import { api, uploadUrl } from '@/lib/api';

export default function ImagePicker({
  value,
  onChange,
  label = 'Rasm',
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const res = await api.upload<{ url: string }>('/api/admin/upload', file);
      onChange(res.url);
    } catch (e: any) {
      setError(e.message || 'Yuklab bo\'lmadi');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="label">{label}</div>
      <div className="flex items-center gap-3">
        {value && (
          <img
            src={uploadUrl(value)}
            alt=""
            className="h-16 w-16 rounded border object-cover"
          />
        )}
        <div className="space-y-2">
          <input
            type="text"
            className="input"
            placeholder="/uploads/... yoki to'liq URL"
            value={value || ''}
            onChange={(e) => onChange(e.target.value || null)}
          />
          <div className="flex gap-2">
            <label className="btn-secondary cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
              />
              {busy ? 'Yuklanmoqda…' : 'Fayl tanlash'}
            </label>
            {value && (
              <button type="button" className="btn-ghost" onClick={() => onChange(null)}>
                Tozalash
              </button>
            )}
          </div>
        </div>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}

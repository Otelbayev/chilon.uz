'use client';

import { useEffect, useRef, useState } from 'react';
import Topbar from '@/components/Topbar';
import { api, uploadUrl } from '@/lib/api';
import type { UploadFile } from '@/lib/types';

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export default function UploadsPage() {
  const [items, setItems] = useState<UploadFile[]>([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () =>
    api.get<{ items: UploadFile[] }>('/api/admin/upload').then((r) => setItems(r.items));

  useEffect(() => { load(); }, []);

  const onFiles = async (files: FileList) => {
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        await api.upload('/api/admin/upload', file);
      }
      await load();
    } finally { setBusy(false); }
  };

  const remove = async (filename: string) => {
    if (!confirm(`"${filename}" faylini o'chirasizmi?`)) return;
    await api.delete(`/api/admin/upload/${encodeURIComponent(filename)}`);
    load();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert(`Yo'l nusxalandi: ${url}`);
  };

  return (
    <>
      <Topbar
        title="Fayl menejeri"
        action={
          <button onClick={() => inputRef.current?.click()} className="btn-primary" disabled={busy}>
            {busy ? 'Yuklanmoqda…' : '+ Yuklash'}
          </button>
        }
      />
      <div className="p-6">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && onFiles(e.target.files)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((f) => (
            <div key={f.filename} className="card p-2 flex flex-col gap-2">
              <div className="aspect-square bg-gray-50 rounded overflow-hidden">
                <img src={uploadUrl(f.url)} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs truncate" title={f.filename}>{f.filename}</div>
              <div className="text-[10px] text-gray-500">{formatBytes(f.size)}</div>
              <div className="flex gap-1">
                <button onClick={() => copyUrl(f.url)} className="btn-secondary flex-1 !px-1 !py-1 !text-xs">Nusxa</button>
                <button onClick={() => remove(f.filename)} className="btn-danger !px-2 !py-1 !text-xs">×</button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center text-sm text-gray-500 py-12">
              Fayllar yo'q. "Yuklash" tugmasini bosing.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

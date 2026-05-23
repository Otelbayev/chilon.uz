'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import { api } from '@/lib/api';

export default function PageEditor({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const isSite = params.slug.startsWith('site:');
  const key = isSite ? params.slug.slice(5) : params.slug;
  const decodedSlug = decodeURIComponent(key);

  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const url = isSite ? `/api/site/${decodedSlug}` : `/api/pages/${decodedSlug}`;
    api.get<any>(url).then((res) => {
      const content = isSite ? res : res.content;
      setText(JSON.stringify(content, null, 2));
    }).catch((e) => setError(e.message));
  }, [decodedSlug, isSite]);

  const save = async () => {
    setBusy(true);
    setError(null);
    setSaved(false);
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (e: any) {
      setBusy(false);
      setError('JSON xato: ' + e.message);
      return;
    }
    try {
      if (isSite) {
        await api.put(`/api/admin/pages/site/${decodedSlug}`, { value: parsed });
      } else {
        await api.put(`/api/admin/pages/${decodedSlug}`, { content: parsed });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e.message);
    } finally { setBusy(false); }
  };

  return (
    <>
      <Topbar
        title={`Tahrir: ${isSite ? 'site/' : 'pages/'}${decodedSlug}`}
        action={
          <div className="flex gap-2">
            {saved && <span className="text-sm text-emerald-600 self-center">✓ saqlandi</span>}
            <button onClick={() => router.push('/pages')} className="btn-secondary">← Orqaga</button>
            <button onClick={save} className="btn-primary" disabled={busy}>{busy ? 'Saqlanmoqda…' : 'Saqlash'}</button>
          </div>
        }
      />
      <div className="p-6 space-y-3">
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>}
        <p className="text-xs text-gray-500">
          JSON formatda tahrirlang. Ko'p tilli matnlar uchun: <code className="bg-gray-100 px-1">{`{ "ru": "...", "uz": "..." }`}</code>
        </p>
        <textarea
          className="input font-mono text-xs"
          rows={28}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </>
  );
}

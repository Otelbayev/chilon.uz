'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken, getToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace('/dashboard');
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await api.post<{ token: string }>('/api/auth/login', { username, password });
      setToken(res.token);
      router.replace('/dashboard');
    } catch (e: any) {
      setError(e.message || 'Kirish muvaffaqiyatsiz');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white p-4">
      <form onSubmit={submit} className="card w-full max-w-sm p-6 space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-brand">CHILON</div>
          <div className="text-sm text-gray-500">Admin Panel</div>
        </div>

        <div>
          <label className="label">Foydalanuvchi</label>
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />
        </div>

        <div>
          <label className="label">Parol</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? 'Kirilmoqda…' : 'Kirish'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Standart: <code>admin</code> / parol .env'dan
        </p>
      </form>
    </div>
  );
}

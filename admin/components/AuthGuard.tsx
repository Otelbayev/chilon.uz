'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getToken, api } from '@/lib/api';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    api.get('/api/auth/me')
      .then(() => setOk(true))
      .catch(() => router.replace('/login'));
  }, [pathname, router]);

  if (!ok) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-sm text-gray-500">Yuklanmoqda…</div>
      </div>
    );
  }
  return <>{children}</>;
}

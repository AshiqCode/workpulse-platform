'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/auth-context';
import { Activity } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { currentUser } = useApp();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
    } else if (currentUser.role === 'admin') {
      router.replace('/dashboard');
    } else {
      router.replace('/developer/portal');
    }
  }, [currentUser, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-lg animate-pulse">
        <Activity className="h-7 w-7" />
      </div>
      <p className="text-xs font-semibold text-slate-500 animate-pulse">Loading WorkPulse…</p>
    </div>
  );
}

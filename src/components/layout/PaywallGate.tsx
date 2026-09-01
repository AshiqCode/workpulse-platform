'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Activity } from 'lucide-react';
import { useApp } from '@/lib/auth-context';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'developer' | 'any';
}

/**
 * AuthGuard – strictly blocks unauthenticated and unauthorised users.
 * - If not logged in → redirect to /login immediately.
 * - If logged-in role does not match requiredRole → redirect to /login.
 * - Shows a loading shimmer while the check runs.
 */
export function PaywallGate({ children, requiredRole = 'any' }: AuthGuardProps) {
  const { currentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
      return;
    }
    if (requiredRole !== 'any' && currentUser.role !== requiredRole) {
      // Wrong role: admin tried developer route or vice-versa
      if (currentUser.role === 'admin') {
        router.replace('/dashboard');
      } else {
        router.replace('/developer/portal');
      }
    }
  }, [currentUser, requiredRole, router]);

  // Not authenticated yet — show a minimal loading screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-lg animate-pulse">
          <Activity className="h-7 w-7" />
        </div>
        <p className="text-xs font-semibold text-slate-500 animate-pulse">Verifying identity…</p>
      </div>
    );
  }

  // Logged in but wrong role
  if (requiredRole !== 'any' && currentUser.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3">
        <ShieldCheck className="h-10 w-10 text-blue-600 animate-pulse" />
        <p className="text-xs font-semibold text-slate-500 animate-pulse">Redirecting…</p>
      </div>
    );
  }

  return <>{children}</>;
}

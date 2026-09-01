'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '@/lib/auth-context';

interface PaywallGateProps {
  children: React.ReactNode;
}

export function PaywallGate({ children }: PaywallGateProps) {
  const { currentUser, adminProfile } = useApp();

  // If user is logged in (as Admin or Developer), grant access
  if (currentUser) {
    return <>{children}</>;
  }

  // If not logged in, prompt sign in
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-8 text-center shadow-xl space-y-6 animate-in fade-in zoom-in-95">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Sign In Required</h1>
          <p className="text-xs text-slate-500 mt-1">
            Please sign in with your Admin or invited Developer credentials to access this workspace.
          </p>
        </div>

        <Link
          href="/login"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white shadow-md hover:bg-blue-700 active:scale-98 transition text-xs"
        >
          <span>Go to Sign In Page</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

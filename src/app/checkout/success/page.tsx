'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutSuccessPage() {
  useEffect(() => {
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch (_) {}
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <h1 className="text-2xl font-black text-slate-900">Payment Successful!</h1>
        <p className="text-xs text-slate-500 mt-2">
          Your <strong className="text-slate-800">$62.00 Admin Lifetime Access</strong> is now activated.
        </p>

        <div className="my-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-xs text-emerald-900 space-y-1.5 text-left">
          <p className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Admin Privileges Enabled</span>
          </p>
          <p className="text-[11px] text-emerald-700">
            • Invite unlimited developers to your team<br />
            • Create projects & configure reporting times<br />
            • Monitor on-time reports & velocity analytics
          </p>
        </div>

        <Link
          href="/dashboard"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition active:scale-98 text-xs"
        >
          <span>Go to Admin Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

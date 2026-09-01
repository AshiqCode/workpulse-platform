'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, CreditCard, Sparkles, Check, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import confetti from 'canvas-confetti';

interface PaywallGateProps {
  children: React.ReactNode;
}

export function PaywallGate({ children }: PaywallGateProps) {
  const { isPaidAdmin, setIsPaidAdmin, currentUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');

  // If user is developer or admin has paid, render children normally
  if (currentUser.role === 'developer' || isPaidAdmin) {
    return <>{children}</>;
  }

  // If admin is unpaid, render strict paywall lock screen
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setIsPaidAdmin(true);
      setLoading(false);
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
        });
      } catch (_) {}
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95">
        {/* Top Lock Badge */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/25">
            <Lock className="h-8 w-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-900">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Admin Portal Restricted</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            $62 Admin Access Required
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You must pay <strong>$62.00</strong> to unlock the Admin Portal. Once unlocked, you can invite your developers, create projects, assign tasks, and track scheduled daily reports.
          </p>
        </div>

        {/* Pricing Box */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-blue-100 px-3 py-0.5 text-[11px] font-bold text-blue-700 uppercase">
              One-Time Lifetime Pass
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">Full Admin Workspace Unlock</h3>
            <p className="text-xs text-slate-600">No monthly recurring subscription. Unlimited developers.</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-slate-900">$62<span className="text-xs font-normal text-slate-500">.00</span></div>
            <p className="text-[11px] font-semibold text-emerald-700">Instant Activation</p>
          </div>
        </div>

        {/* Feature List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Invite unlimited developers (Free for devs)</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Create, edit, & delete projects (Full CRUD)</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Set custom daily report deadlines</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Real-time velocity charts & report audit logs</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleUnlock} className="border-t border-slate-100 pt-6 space-y-4 text-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Stripe Payment Simulation</span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400 font-normal">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 256-Bit Encrypted
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 font-mono text-xs text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Exp / CVC</label>
              <input
                type="text"
                value={`${expiry}  ${cvc}`}
                readOnly
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 font-mono text-xs text-slate-800 text-center focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-98 transition text-sm disabled:opacity-75"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Pay $62.00 & Access Admin Portal</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-4">
          <Link href="/" className="hover:text-slate-600 transition">
            ← Back to Homepage
          </Link>
          <Link href="/developer/portal" className="text-blue-600 hover:underline">
            Switch to Developer Workspace →
          </Link>
        </div>
      </div>
    </div>
  );
}

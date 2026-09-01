'use client';

import React, { useState } from 'react';
import { X, Check, ShieldCheck, CreditCard, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import confetti from 'canvas-confetti';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const { setIsPaidAdmin, currentUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay62 = async () => {
    setLoading(true);
    // Simulate / Process $62 Stripe Checkout unlock
    setTimeout(() => {
      setIsPaidAdmin(true);
      setLoading(false);
      setSuccess(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (_) {}

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1600);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-sm shadow-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">WorkPulse Pro Admin</h3>
              <p className="text-xs text-slate-500">Unlock complete platform access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="py-10 text-center animate-in fade-in zoom-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-8 w-8" />
            </div>
            <h4 className="mt-3 text-lg font-bold text-slate-900">$62 Payment Successful!</h4>
            <p className="mt-1 text-xs text-slate-600">
              Admin lifetime access unlocked. You can now invite developers, assign projects, and review daily work logs.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {/* Price Box */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-5 text-center">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                Lifetime Admin Pass
              </span>
              <div className="mt-3 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black tracking-tight text-slate-900">$62</span>
                <span className="text-xs font-semibold text-slate-500">/ one-time</span>
              </div>
              <p className="mt-1 text-xs text-slate-600">No monthly recurring fees. Invite unlimited developers.</p>
            </div>

            {/* Feature list */}
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2.5 font-medium">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-3 w-3" />
                </div>
                <span>Unlimited Developer Invitations (Free for devs)</span>
              </div>
              <div className="flex items-center gap-2.5 font-medium">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-3 w-3" />
                </div>
                <span>Scheduled Daily Work Reporting with On-Time Verification</span>
              </div>
              <div className="flex items-center gap-2.5 font-medium">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-3 w-3" />
                </div>
                <span>Interactive Velocity & Productivity Analytics</span>
              </div>
              <div className="flex items-center gap-2.5 font-medium">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-3 w-3" />
                </div>
                <span>Supabase Database & GitHub Repository Integration</span>
              </div>
            </div>

            {/* Stripe Powered Notice */}
            <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Secured by Stripe 256-bit encryption</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-2 pt-2">
              <button
                onClick={handlePay62}
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-98 transition disabled:opacity-75"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Pay $62 via Stripe</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="h-9 w-full rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition"
              >
                Maybe Later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

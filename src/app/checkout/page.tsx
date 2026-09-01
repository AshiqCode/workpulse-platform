'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CreditCard, Check, Sparkles, ArrowLeft, Lock, Zap } from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const router = useRouter();
  const { isPaidAdmin, setIsPaidAdmin, currentUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setIsPaidAdmin(true);
      setLoading(false);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (_) {}
      router.push('/checkout/success?session_id=stripe_sess_62_paid');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Product & Pricing summary */}
          <div className="md:col-span-6 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900">WorkPulse Pro Admin</h1>
                  <p className="text-xs text-slate-500">One-Time Administrator License</p>
                </div>
              </div>

              <div className="mt-6 border-t border-b border-slate-100 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-700">Admin Platform Unlock</span>
                  <span className="text-3xl font-black text-slate-900">$62.00</span>
                </div>
                <p className="text-xs text-emerald-700 font-semibold mt-1">One-time payment • Lifetime access</p>
              </div>

              <div className="mt-6 space-y-3 text-xs text-slate-600">
                <p className="font-bold text-slate-900">Included with your $62 Admin license:</p>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Unlimited Developer Invitations (Developers join free)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Custom Scheduled Daily Report Deadlines (e.g. 5:00 PM)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Automated On-Time vs Delayed Timestamp Auditing</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Team Velocity & Productivity Analytics + CSV Exports</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Connected Supabase Database & GitHub Integration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Checkout Card Form */}
          <div className="md:col-span-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900">Payment Information</h2>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                  <Lock className="h-3 w-3" /> Stripe 256-Bit
                </div>
              </div>

              <form onSubmit={handlePay} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cardholder Email</label>
                  <input
                    type="email"
                    readOnly
                    value={currentUser.email || 'sarah.johnson@workpulse.io'}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-800 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Card Details</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs font-mono focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="12/28"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-slate-800 text-xs font-mono focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="123"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-slate-800 text-xs font-mono focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-98 transition disabled:opacity-75 text-sm"
                  >
                    {loading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>Pay $62.00 & Unlock Platform</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-5 text-center">
                <span className="text-[11px] text-slate-400">
                  Stripe Test Cards: 4242 4242 4242 4242 · Instant activation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

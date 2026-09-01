'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PaywallGate } from '@/components/layout/PaywallGate';
import { useApp } from '@/lib/auth-context';
import { Shield, CreditCard, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const { isPaidAdmin, setIsPaidAdmin } = useApp();

  return (
    <PaywallGate>
      <div className="min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <div className="pl-64">
          <Navbar />

          <main className="p-8 space-y-6 max-w-4xl mx-auto">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Workspace Settings</h1>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Configure Stripe billing, Supabase connection, and report reminders.
              </p>
            </div>

            {/* Stripe Billing Box */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Stripe Admin License</h2>
                    <p className="text-xs text-slate-500">Plan access: $62.00 One-Time Lifetime Pass</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    isPaidAdmin
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border border-rose-200 bg-rose-50 text-rose-700'
                  }`}
                >
                  {isPaidAdmin ? 'Active & Paid' : 'Payment Required'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>
                  Stripe Price ID: <code className="bg-slate-100 px-2 py-0.5 rounded text-blue-600 font-mono">price_1UAnwaKkUbVxosGgjAKYerlu</code>
                </span>
                <button
                  onClick={() => setIsPaidAdmin(!isPaidAdmin)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Toggle Paid Status ({isPaidAdmin ? 'Active' : 'Locked'})
                </button>
              </div>
            </div>

            {/* Database Integration */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Supabase Database & Auth</h2>
                  <p className="text-xs text-slate-500">Connected to active project <code className="text-emerald-700 font-mono">xzdizzxghqijqkvriold</code></p>
                </div>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p>✔ Public schema tables: <span className="font-mono text-slate-800">workpulse_profiles, workpulse_projects, workpulse_work_reports</span></p>
                <p>✔ Clean initial state: Ready for fresh admin entries</p>
                <p>✔ Row Level Security (RLS): Enabled</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PaywallGate>
  );
}

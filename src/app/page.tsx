'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Users,
  Sparkles,
  BarChart3,
  CreditCard
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-sm shadow-blue-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">WorkPulse</span>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
              $62 Pro
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition hidden sm:inline"
            >
              Admin Dashboard
            </Link>
            <Link
              href="/developer/portal"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition hidden sm:inline"
            >
              Developer Portal
            </Link>
            <Link
              href="/checkout"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition active:scale-98"
            >
              <span>Unlock Admin ($62)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-bold text-blue-800 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Developer Management & Time-Enforced Work Reporting</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Keep engineering teams accountable with <span className="text-blue-600 underline decoration-blue-200">scheduled daily reports</span>.
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-600 font-normal leading-relaxed">
            Admins pay <strong>$62 for lifetime access</strong> to create projects, invite developers, and enforce daily work submissions before selected deadlines. Live velocity analytics and instant on-time auditing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <Link
              href="/dashboard"
              className="flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-7 font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-98 transition text-sm"
            >
              <span>Explore Admin Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/developer/portal"
              className="flex h-12 items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 font-bold text-slate-800 shadow-xs hover:bg-slate-50 active:scale-98 transition text-sm"
            >
              <Zap className="h-4 w-4 text-emerald-600" />
              <span>Developer Reporting Portal</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive UI Showcase Preview */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs font-bold text-slate-700">WorkPulse Light SaaS Dashboard Interface</span>
            </div>
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
            >
              Open Live App →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Active Projects</p>
              <p className="text-2xl font-black text-slate-900 mt-1">14</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1">↑ 3% vs last month</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Assigned Devs</p>
              <p className="text-2xl font-black text-slate-900 mt-1">18</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1">✔ 18 Active</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Today's Reports</p>
              <p className="text-2xl font-black text-slate-900 mt-1">16/18</p>
              <p className="text-[11px] font-semibold text-blue-600 mt-1">🔄 89% Submitted</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Weekly Hours</p>
              <p className="text-2xl font-black text-slate-900 mt-1">580h</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1">📊 +25h vs Last Week</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Built for engineering leaders & developer teams
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Everything required to monitor deliverables, track daily progress, and prevent roadmap slips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Scheduled Daily Reporting</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Set designated report submission times (e.g. 5:00 PM) per project. Automated timestamp checks verify whether submissions are on-time or delayed.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-4">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">$62 Stripe Admin Gate</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Admins unlock the platform with a single $62 payment. Invited developers join freely without paying anything.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 mb-4">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Interactive Velocity Analytics</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Track completion percentage, developer work hour totals, weekly heatmaps, and audit logs with instant CSV exports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-16 bg-slate-100/60 border-t border-b border-slate-200">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Simple & Transparent Pricing</h2>
            <p className="text-xs text-slate-500 mt-1">Admin unlocks the workspace, developers join freely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Developer Tier */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col justify-between text-left">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Developer Member</h3>
                <p className="text-xs text-slate-500 mt-1">For team members invited by an Admin</p>
                <div className="my-4 text-3xl font-black text-slate-900">$0 <span className="text-xs font-normal text-slate-500">Free forever</span></div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">✔ View assigned projects & tasks checklist</li>
                  <li className="flex items-center gap-2">✔ Submit daily work reports & PR links</li>
                  <li className="flex items-center gap-2">✔ Personal on-time streak & activity heatmap</li>
                </ul>
              </div>
              <Link
                href="/developer/portal"
                className="mt-6 block w-full rounded-xl border border-slate-300 py-2.5 text-center text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
              >
                Go to Developer Portal
              </Link>
            </div>

            {/* Admin Pro Tier */}
            <div className="relative rounded-3xl border-2 border-blue-600 bg-white p-8 shadow-xl flex flex-col justify-between text-left">
              <span className="absolute -top-3 right-6 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
                Most Popular
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Admin Lifetime License</h3>
                <p className="text-xs text-slate-500 mt-1">For project managers & team leads</p>
                <div className="my-4 text-4xl font-black text-blue-600">$62 <span className="text-xs font-normal text-slate-500">One-Time Payment</span></div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">✔ Invite unlimited developers</li>
                  <li className="flex items-center gap-2">✔ Create projects & set report deadlines</li>
                  <li className="flex items-center gap-2">✔ Real-time velocity charts & team stats</li>
                  <li className="flex items-center gap-2">✔ Export work reports to CSV</li>
                  <li className="flex items-center gap-2">✔ Supabase database & GitHub integration</li>
                </ul>
              </div>
              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-xl bg-blue-600 py-3 text-center text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition active:scale-98"
              >
                Unlock Admin Access ($62)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="font-bold text-slate-800">WorkPulse</span>
            <span>© 2026 WorkPulse Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-900 transition">Admin Dashboard</Link>
            <Link href="/developer/portal" className="hover:text-slate-900 transition">Developer Portal</Link>
            <Link href="/checkout" className="hover:text-slate-900 transition">Stripe $62 Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

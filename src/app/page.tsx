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
  FolderPlus,
  LogIn,
  UserCheck
} from 'lucide-react';
import { useApp } from '@/lib/auth-context';

export default function LandingPage() {
  const { adminProfile, currentUser } = useApp();

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
              Personal Workspace
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition"
            >
              <LogIn className="h-4 w-4 text-blue-600" />
              <span>Sign In / Auth</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition active:scale-98"
            >
              <span>Admin Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-bold text-blue-800 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>Administrator: {adminProfile.full_name} ({adminProfile.email})</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Manage projects & track developer <span className="text-blue-600 underline decoration-blue-200">daily work reports</span>.
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-600 font-normal leading-relaxed">
            Your personal project control center. Create deliverables, invite engineers, assign tasks, and monitor time-scheduled report compliance with live velocity analytics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <Link
              href="/login"
              className="flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-7 font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-98 transition text-sm"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In / Enter Portal</span>
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

      {/* Feature Highlights */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 mb-4">
                <FolderPlus className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Project CRUD & Status Management</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Create new deliverables, update progress bars, and switch status smoothly across Planning, In Progress, Review, and Completed.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-4">
                <UserCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Invited Developer Authentication</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Only developers explicitly invited by you (<code>muhammadashiq.dev@gmail.com</code>) can register and log in to submit daily reports.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Scheduled Daily Reporting</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Set daily submission deadlines (e.g. 5:00 PM). Automated timestamp verification audits whether reports are on-time or delayed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8 mt-12">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="font-bold text-slate-800">WorkPulse</span>
            <span>Personal Workspace for Muhammad Ashiq.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-slate-900 transition">Sign In</Link>
            <Link href="/dashboard" className="hover:text-slate-900 transition">Dashboard</Link>
            <Link href="/developer/portal" className="hover:text-slate-900 transition">Developer Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

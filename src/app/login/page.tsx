'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Key,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const router = useRouter();
  const { login, adminProfile, currentUser } = useApp();

  // Redirect already-logged-in users to their correct portal based on role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        router.replace('/dashboard');
      } else {
        router.replace('/developer/portal');
      }
    }
  }, [currentUser, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAutoFillAdmin = () => {
    setEmail('muhammadashiq.dev@gmail.com');
    setPassword('krazy8');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed. Check your email and password.');
        return;
      }

      const roleTitle = res.role === 'admin' ? 'Administrator' : 'Developer';
      setSuccessMsg(`Welcome back, ${roleTitle}! Signing you in...`);

      try {
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
      } catch (_) {}

      setTimeout(() => {
        if (res.role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/developer/portal');
        }
      }, 700);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'An error occurred during authentication.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
          <Activity className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">WorkPulse</h2>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          Personal Engineering Workspace & Developer Reporting Portal
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl space-y-6">
          {/* Quick Admin Helper */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-semibold">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Workspace Admin</span>
            </div>
            <button
              type="button"
              onClick={handleAutoFillAdmin}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <Sparkles className="h-3 w-3" />
              <span>Auto-Fill Admin</span>
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMsg && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 flex items-center gap-2.5 text-xs font-bold text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Direct Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                Admins and invited developers sign in directly with their credentials.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-98 transition disabled:opacity-50"
            >
              {loading ? (
                <span>Checking role & credentials in Supabase…</span>
              ) : (
                <>
                  <span>Sign In to WorkPulse</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer policy notice */}
          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-[11px] text-slate-500">
              🔒 <strong>Single Sign-In:</strong> Dynamic role detection automatically routes Admin to <strong>/dashboard</strong> and Developers to <strong>/developer/portal</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

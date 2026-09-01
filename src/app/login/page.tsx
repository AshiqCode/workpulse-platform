'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Key,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, adminProfile, invitedEmails } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdminAutoFill = () => {
    setEmail('muhammadashiq.dev@gmail.com');
    setPassword('krazy8');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const res = login(email, password);
        setLoading(false);
        if (!res.success) {
          setErrorMsg(res.error || 'Authentication failed');
          return;
        }

        setSuccessMsg(`Welcome back, ${res.role === 'admin' ? 'Administrator' : 'Developer'}!`);
        try {
          confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
        } catch (_) {}

        setTimeout(() => {
          if (res.role === 'admin') {
            router.push('/dashboard');
          } else {
            router.push('/developer/portal');
          }
        }, 800);
      } else {
        const res = signup(email, password, fullName);
        setLoading(false);
        if (!res.success) {
          setErrorMsg(res.error || 'Registration failed');
          return;
        }

        setSuccessMsg('Account created successfully! Redirecting...');
        try {
          confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
        } catch (_) {}

        setTimeout(() => {
          if (res.role === 'admin') {
            router.push('/dashboard');
          } else {
            router.push('/developer/portal');
          }
        }, 800);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* WorkPulse Logo */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
          <Activity className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">WorkPulse</h2>
        <p className="mt-1 text-xs text-slate-500">
          Personal Developer Management & Daily Work Reporting
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl">
          {/* Mode Switcher (Login / Signup) */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 rounded-lg py-2 transition ${
                mode === 'login' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 rounded-lg py-2 transition ${
                mode === 'signup' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register (Invited)
            </button>
          </div>

          {/* Admin Fast-Fill Helper Pill */}
          <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5 text-xs text-blue-900">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>Admin Login:</span>
              </span>
              <button
                type="button"
                onClick={handleAdminAutoFill}
                className="rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 active:scale-95 transition"
              >
                Auto-Fill Admin
              </button>
            </div>
            <p className="text-[11px] text-blue-700 mt-1">
              Email: <code className="font-mono font-bold">muhammadashiq.dev@gmail.com</code> | Pass: <code className="font-mono font-bold">krazy8</code>
            </p>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
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
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Developer Invitation Notice */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] text-slate-500">
              <span className="font-bold text-slate-700">🔒 Access Policy:</span> Developers must be invited by Admin (<code>muhammadashiq.dev@gmail.com</code>) to register or log in.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-98 transition disabled:opacity-75"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create Invited Account'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

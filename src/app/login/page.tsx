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
  const { login, signup, adminProfile, invitedEmails, currentUser } = useApp();

  // Redirect already-logged-in users to their correct portal
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        router.replace('/dashboard');
      } else {
        router.replace('/developer/portal');
      }
    }
  }, [currentUser, router]);

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAutoFillAdmin = () => {
    setEmail('muhammadashiq.dev@gmail.com');
    setPassword('krazy8');
    setFullName(adminProfile.full_name || 'Muhammad Ashiq');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
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
        const res = await signup(email, password, fullName);
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
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 rounded-lg py-2 transition ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
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
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Invited Register
            </button>
          </div>

          {/* Quick Admin Auto-fill Helper */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-semibold">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Personal Admin Account</span>
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
                    placeholder="Muhammad Ashiq / Dev Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
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
                  placeholder="muhammadashiq.dev@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                {mode === 'login'
                  ? 'Admin: muhammadashiq.dev@gmail.com | Devs: must be invited'
                  : 'Developers must be invited by admin before completing signup'}
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
                <span>Authenticating with Supabase…</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Complete Registration'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer notice */}
          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-[11px] text-slate-500">
              🔒 <strong>Personal Workspace Policy:</strong> Only Administrator Muhammad Ashiq and verified invited developers can sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

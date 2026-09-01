'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PaywallGate } from '@/components/layout/PaywallGate';
import { AdminProfileModal } from '@/components/modals/AdminProfileModal';
import { useApp } from '@/lib/auth-context';
import { Shield, User, Sparkles, Building, Lock, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { adminProfile } = useApp();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <PaywallGate>
      <div className="min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <div className="pl-64">
          <Navbar onOpenProfileModal={() => setIsProfileModalOpen(true)} />

          <main className="p-8 space-y-6 max-w-4xl mx-auto">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Workspace Settings</h1>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Manage your administrator profile, personal branding, and developer security policies.
              </p>
            </div>

            {/* Admin Profile & Branding */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={adminProfile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="Admin Avatar"
                    className="h-14 w-14 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                  />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{adminProfile.full_name}</h2>
                    <p className="text-xs text-slate-500">{adminProfile.email}</p>
                    <p className="text-[11px] text-blue-600 font-semibold mt-0.5">{adminProfile.company || 'Ashiq Dev Studio'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Edit Profile & Onboarding</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Role & Access</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">Primary Administrator</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Full ownership of projects, developers, and reports</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Workspace</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">{adminProfile.company || 'Ashiq Dev Studio'}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{adminProfile.bio || 'Lead Engineer & Administrator'}</p>
                </div>
              </div>
            </div>

            {/* Developer Access Policy */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Developer Security & Invite Policy</h2>
                  <p className="text-xs text-slate-500">Only invited developers can register or log in</p>
                </div>
              </div>
              <div className="text-xs text-slate-600 space-y-2">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Strict invitation verification enabled</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Developers not listed in your invited roster are blocked from authenticating</span>
                </p>
              </div>
            </div>

            {/* Supabase Database */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Supabase Database</h2>
                  <p className="text-xs text-slate-500">Connected to active project <code className="text-blue-700 font-mono">xzdizzxghqijqkvriold</code></p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Postgres tables configured with Row Level Security (RLS) policies for your workspace.
              </p>
            </div>
          </main>
        </div>

        <AdminProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </div>
    </PaywallGate>
  );
}

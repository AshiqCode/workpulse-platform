'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PaywallGate } from '@/components/layout/PaywallGate';
import { AdminProfileModal } from '@/components/modals/AdminProfileModal';
import { useApp } from '@/lib/auth-context';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Shield, User, Sparkles, Building, Lock, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { adminProfile } = useApp();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <PaywallGate requiredRole="admin">
      <div className="min-h-screen bg-[#F8FAFC]">
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <Navbar
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl w-full mx-auto flex-1">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Workspace Settings</h1>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Manage your administrator profile, personal branding, and developer security policies.
              </p>
            </div>

            {/* Admin Profile & Branding */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3.5">
                  <UserAvatar
                    avatarUrl={adminProfile.avatar_url}
                    name={adminProfile.full_name}
                    email={adminProfile.email}
                    sizeClassName="h-14 w-14"
                    textSizeClassName="text-lg"
                    className="border-2 border-blue-500 shadow-sm"
                  />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{adminProfile.full_name}</h2>
                    <p className="text-xs text-slate-500">{adminProfile.email}</p>
                    <p className="text-[11px] text-blue-600 font-semibold mt-0.5">{adminProfile.company || 'Ashiq Dev Studio'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition self-start sm:self-auto"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Edit Profile & Avatar</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-1">Company / Studio Tagline</span>
                  <p className="text-slate-600 font-medium">{adminProfile.company || 'Ashiq Engineering Studio'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-1">Role Permission</span>
                  <p className="text-emerald-700 font-bold flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" /> Full Administrator & Workspace Owner
                  </p>
                </div>
              </div>
            </div>

            {/* Security & Access Policies */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-600" /> Security & Access Restrictions
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Only invited developers can log in to the system. Unknown emails are rejected at authentication.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Developer deletion safety constraint active: developer must be unassigned from active projects before removal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Submitted daily work reports are strictly read-only and permanently recorded in Supabase.</span>
                </li>
              </ul>
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

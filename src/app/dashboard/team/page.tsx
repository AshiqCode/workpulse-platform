'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PaywallGate } from '@/components/layout/PaywallGate';
import { InviteDeveloperModal } from '@/components/modals/InviteDeveloperModal';
import { useApp } from '@/lib/auth-context';
import { Users, UserPlus } from 'lucide-react';

export default function TeamPage() {
  const { developers, isPaidAdmin } = useApp();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <PaywallGate>
      <div className="min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <div className="pl-64">
          <Navbar onOpenInviteModal={() => setIsInviteOpen(true)} />

          <main className="p-8 space-y-6 max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">Team Structure & Permissions</h1>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Role permissions and developer team organization.
                </p>
              </div>

              <button
                onClick={() => setIsInviteOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                <UserPlus className="h-4 w-4" />
                <span>+ Invite Developer</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4">Active Team Members ({developers.length + 1})</h2>

              <div className="divide-y divide-slate-100">
                {/* Admin */}
                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                      alt="Platform Admin"
                      className="h-9 w-9 rounded-full object-cover border border-amber-300"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Platform Admin (You)</p>
                      <p className="text-[11px] text-slate-500">admin@workpulse.io</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-[11px] font-bold text-amber-800">
                    Administrator ($62 Pro)
                  </span>
                </div>

                {/* Developers */}
                {developers.map((dev) => (
                  <div key={dev.id} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={dev.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={dev.full_name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{dev.full_name}</p>
                        <p className="text-[11px] text-slate-500">{dev.email}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-[11px] font-bold text-blue-700">
                      Developer (Free Member)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>

        <InviteDeveloperModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
      </div>
    </PaywallGate>
  );
}

'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PaywallGate } from '@/components/layout/PaywallGate';
import { InviteDeveloperModal } from '@/components/modals/InviteDeveloperModal';
import { useApp } from '@/lib/auth-context';
import { UserPlus, Shield, User } from 'lucide-react';

export default function TeamPage() {
  const { developers, adminProfile } = useApp();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <PaywallGate requiredRole="admin">
      <div className="min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <div className="pl-64">
          <Navbar onOpenInviteModal={() => setIsInviteOpen(true)} />

          <main className="p-8 space-y-6 max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">Team Structure & Permissions</h1>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Manage invited developers and review role permissions.
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
                {/* Admin Muhammad Ashiq */}
                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={adminProfile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={adminProfile.full_name}
                      className="h-10 w-10 rounded-full object-cover border-2 border-blue-500 shadow-xs"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{adminProfile.full_name} (Owner)</p>
                      <p className="text-[11px] text-slate-500">{adminProfile.email}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-[11px] font-bold text-blue-800">
                    Administrator
                  </span>
                </div>

                {/* Developers */}
                {developers.map((dev) => (
                  <div key={dev.id} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={dev.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={dev.full_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{dev.full_name}</p>
                        <p className="text-[11px] text-slate-500">{dev.email}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11px] font-bold text-emerald-700">
                      Invited Developer
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

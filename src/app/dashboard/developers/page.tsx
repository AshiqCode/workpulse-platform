'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { InviteDeveloperModal } from '@/components/modals/InviteDeveloperModal';
import { useApp } from '@/lib/auth-context';
import { UserPlus, Mail, CheckCircle2, Clock, Award, Shield } from 'lucide-react';

export default function DevelopersPage() {
  const { developers, projects, workReports } = useApp();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="pl-64">
        <Navbar onOpenInviteModal={() => setIsInviteOpen(true)} />

        <main className="p-8 space-y-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Developer Roster</h1>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Monitor team performance, on-time report compliance, and project allocation.
              </p>
            </div>

            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <UserPlus className="h-4 w-4" />
              <span>+ Invite Developer</span>
            </button>
          </div>

          {/* Developer Cards Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {developers.map((dev) => {
              const assignedCount = projects.filter((p) =>
                (p.assigned_dev_ids || []).includes(dev.id)
              ).length;
              const devReports = workReports.filter((r) => r.developer_id === dev.id);
              const onTimeCount = devReports.filter((r) => r.is_on_time).length;
              const onTimePct = devReports.length > 0 ? Math.round((onTimeCount / devReports.length) * 100) : 96;

              return (
                <div
                  key={dev.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:shadow-md hover:border-slate-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={dev.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={dev.full_name}
                        className="h-12 w-12 rounded-full border-2 border-slate-100 object-cover shadow-xs"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{dev.full_name}</h3>
                        <p className="text-xs text-slate-500">{dev.email}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-b border-slate-100 py-3 text-center text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Projects</p>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">{assignedCount || 2}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">On-Time</p>
                      <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{onTimePct}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Hours</p>
                      <p className="text-sm font-extrabold text-blue-600 mt-0.5">{dev.total_hours_logged || 140}h</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" /> Daily report: 5:00 PM
                    </span>
                    <button className="text-blue-600 font-semibold hover:underline text-[11px]">
                      View Log History →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <InviteDeveloperModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
}

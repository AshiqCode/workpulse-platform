'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { PaywallGate } from '@/components/layout/PaywallGate';
import { useApp } from '@/lib/auth-context';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { TrendingUp, Users, CheckCircle, Clock, Flame } from 'lucide-react';

export default function AnalyticsPage() {
  const { stats, developers, workReports } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalReports = workReports.length;
  const onTimeCount = workReports.filter((r) => r.is_on_time).length;
  const delayedCount = workReports.filter((r) => !r.is_on_time).length;
  const onTimePct = totalReports > 0 ? Math.round((onTimeCount / totalReports) * 100) : 0;

  return (
    <PaywallGate requiredRole="admin">
      <div className="min-h-screen bg-[#F8FAFC]">
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

          <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] w-full mx-auto flex-1">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Team Analytics & Performance</h1>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Historical trends, developer delivery velocity, and report timeliness metrics.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <AnalyticsChart />
              </div>

              <div className="lg:col-span-4 space-y-5">
                {/* Compliance card */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Report Submission Compliance</h3>
                  <p className="text-xs text-slate-500 mb-4">Overall team timeliness this sprint</p>

                  <div className="flex items-center justify-center py-4">
                    <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-emerald-500 bg-emerald-50 text-emerald-950 font-black text-3xl shadow-inner">
                      <span>{onTimePct}%</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> On-Time: {onTimeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-600" /> Delayed: {delayedCount}
                    </span>
                  </div>
                </div>

                {/* Developer Top Performers */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" /> Top Consistent Engineers
                  </h3>
                  {developers.length > 0 ? (
                    <div className="space-y-3">
                      {developers.slice(0, 3).map((dev, idx) => {
                        const devReports = workReports.filter((r) => r.developer_id === dev.id);
                        const devOnTime = devReports.filter((r) => r.is_on_time).length;
                        const devPct = devReports.length > 0 ? Math.round((devOnTime / devReports.length) * 100) : 0;

                        return (
                          <div key={dev.id} className="flex items-center justify-between text-xs gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="font-mono text-slate-400 font-bold">#{idx + 1}</span>
                              <UserAvatar
                                avatarUrl={dev.avatar_url}
                                name={dev.full_name}
                                email={dev.email}
                                sizeClassName="h-7 w-7"
                                textSizeClassName="text-[10px]"
                                className="shrink-0"
                              />
                              <span className="font-bold text-slate-800 truncate">{dev.full_name}</span>
                            </div>
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                              {devPct}% On-Time
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No developer metrics recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PaywallGate>
  );
}

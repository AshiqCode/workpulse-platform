'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatCards } from '@/components/dashboard/StatCards';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { WorkLogTable } from '@/components/dashboard/WorkLogTable';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { InviteDeveloperModal } from '@/components/modals/InviteDeveloperModal';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
import { PaywallModal } from '@/components/modals/PaywallModal';
import { useApp } from '@/lib/auth-context';
import { Lock, Sparkles, Plus, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { isPaidAdmin, projects, currentUser } = useApp();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="pl-64">
        {/* Sticky Top Navbar */}
        <Navbar
          onOpenInviteModal={() => setIsInviteOpen(true)}
          onOpenProjectModal={() => setIsProjectOpen(true)}
          onOpenPaywallModal={() => setIsPaywallOpen(true)}
        />

        {/* Paywall Banner if Admin has not paid $62 */}
        {!isPaidAdmin && currentUser.role === 'admin' && (
          <div className="mx-8 mt-6 flex items-center justify-between rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  Admin Access Gate: $62 Lifetime License Required
                </h3>
                <p className="text-xs text-amber-800">
                  You are previewing in read-only mode. Complete the $62 Stripe checkout to unlock full developer invitations, project assignments, and report logging.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPaywallOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-amber-700 hover:to-amber-800 transition active:scale-98"
            >
              <Sparkles className="h-4 w-4" />
              <span>Unlock Admin Access ($62)</span>
            </button>
          </div>
        )}

        {/* Dashboard Main View */}
        <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
          {/* Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Dashboard</h1>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Real-time team execution, daily report compliance, and project velocity.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsInviteOpen(true)}
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
              >
                <Users className="h-4 w-4" />
                <span>+ Invite Developer</span>
              </button>
              <button
                onClick={() => setIsProjectOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
              >
                <Plus className="h-4 w-4" />
                <span>+ New Project</span>
              </button>
            </div>
          </div>

          {/* Section 1: KPI Stat Cards */}
          <StatCards />

          {/* Section 2: Modern Project Cards Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Modern Project Cards</h2>
              <Link
                href="/dashboard/projects"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>View all projects ({projects.length})</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {projects.slice(0, 4).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          {/* Section 3: Two-Column Split (Developer Work Log Table + Interactive Analytics Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left / Main: Developer Work Log Table */}
            <div className="lg:col-span-7">
              <WorkLogTable />
            </div>

            {/* Right: Interactive Analytics Chart */}
            <div className="lg:col-span-5">
              <AnalyticsChart />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <InviteDeveloperModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
      <CreateProjectModal isOpen={isProjectOpen} onClose={() => setIsProjectOpen(false)} />
      <PaywallModal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />
    </div>
  );
}

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
import { PaywallGate } from '@/components/layout/PaywallGate';
import { useApp } from '@/lib/auth-context';
import { Plus, Users, ArrowUpRight, FolderPlus } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { projects } = useApp();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <PaywallGate requiredRole="admin">
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Responsive Left Sidebar */}
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

        {/* Main Content Area */}
        <div className="lg:pl-64 flex flex-col min-h-screen">
          {/* Sticky Top Navbar */}
          <Navbar
            onOpenInviteModal={() => setIsInviteOpen(true)}
            onOpenProjectModal={() => setIsProjectOpen(true)}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          {/* Dashboard Main View */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] w-full mx-auto flex-1">
            {/* Page Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Real-time team execution, daily report compliance, and project velocity.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => setIsInviteOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-emerald-50 px-3 sm:px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <Users className="h-4 w-4" />
                  <span>+ Invite Dev</span>
                </button>
                <button
                  onClick={() => setIsProjectOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
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
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Projects Overview (CRUD)</h2>
                {projects.length > 0 && (
                  <Link
                    href="/dashboard/projects"
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <span>View all ({projects.length})</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              {projects.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {projects.slice(0, 4).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
                    <FolderPlus className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No Projects Created Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Create your first project, set scheduled daily report times, and assign developers.
                  </p>
                  <button
                    onClick={() => setIsProjectOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create First Project</span>
                  </button>
                </div>
              )}
            </section>

            {/* Section 3: Two-Column Split (Developer Work Log Table + Interactive Analytics Chart) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <WorkLogTable />
              </div>

              <div className="lg:col-span-5">
                <AnalyticsChart />
              </div>
            </div>
          </main>
        </div>

        {/* Modals */}
        <InviteDeveloperModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
        <CreateProjectModal isOpen={isProjectOpen} onClose={() => setIsProjectOpen(false)} />
      </div>
    </PaywallGate>
  );
}

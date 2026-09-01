'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
import { InviteDeveloperModal } from '@/components/modals/InviteDeveloperModal';
import { useApp } from '@/lib/auth-context';
import { Plus, Search, Filter } from 'lucide-react';
import { ProjectStatus } from '@/types';

export default function ProjectsPage() {
  const { projects } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client_name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="pl-64">
        <Navbar
          onOpenInviteModal={() => setIsInviteOpen(true)}
          onOpenProjectModal={() => setIsProjectOpen(true)}
        />

        <main className="p-8 space-y-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Projects Directory</h1>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Manage development deliverables, assign engineers, and set daily reporting deadlines.
              </p>
            </div>

            <button
              onClick={() => setIsProjectOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" />
              <span>+ Create Project</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by project or client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
              {['all', 'in_progress', 'review', 'planning', 'completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilter(st)}
                  className={`rounded-md px-3 py-1 font-medium capitalize transition ${
                    filter === st
                      ? 'bg-white text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProjects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        </main>
      </div>

      <CreateProjectModal isOpen={isProjectOpen} onClose={() => setIsProjectOpen(false)} />
      <InviteDeveloperModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
}

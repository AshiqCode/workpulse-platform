'use client';

import React, { useState } from 'react';
import { Project, ProjectStatus } from '@/types';
import { Clock, Users, MoreVertical, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import { EditProjectModal } from '@/components/modals/EditProjectModal';

interface ProjectCardProps {
  project: Project;
  onSelect?: (project: Project) => void;
}

const statusConfig: Record<ProjectStatus, { label: string; bg: string; text: string; border: string }> = {
  in_progress: {
    label: 'In Progress',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  review: {
    label: 'Review',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  planning: {
    label: 'Plan',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
};

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const { updateProjectStatus, deleteProject, currentUser } = useApp();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const statusInfo = statusConfig[project.status] || statusConfig.in_progress;
  const members = project.members || [];

  const handleStatusChange = (newStatus: ProjectStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    updateProjectStatus(project.id, newStatus);
    setDropdownOpen(false);
  };

  return (
    <>
      <div
        className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:border-blue-400 hover:shadow-md"
      >
        <div>
          {/* Header: Project Name & Status Badge & Actions */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {project.name}
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Client: <span className="text-slate-700 font-semibold">{project.client_name}</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
              >
                {statusInfo.label}
              </span>

              {/* Admin Action Menu for CRUD */}
              {currentUser.role === 'admin' && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {dropdownOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-30 text-xs animate-in fade-in"
                    >
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setIsEditOpen(true);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-50 text-left"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                        <span>Edit / Status (CRUD)</span>
                      </button>

                      <div className="border-t border-slate-100 my-1 pt-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5">Quick Status</p>
                        {(['planning', 'in_progress', 'review', 'completed'] as ProjectStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={(e) => handleStatusChange(st, e)}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-[11px] capitalize ${
                              project.status === st ? 'font-bold text-blue-700 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span>{st.replace('_', ' ')}</span>
                            {project.status === st && <CheckCircle2 className="h-3 w-3 text-blue-600" />}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 my-1 pt-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            deleteProject(project.id);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 font-medium text-rose-600 hover:bg-rose-50 text-left"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Project</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Assigned Developers Avatars with Tooltips */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-500 mr-1">Assigned devs</span>
              <div className="flex -space-x-2 overflow-hidden">
                {members.length > 0 ? (
                  members.map((member, i) => (
                    <div key={i} className="group/avatar relative">
                      <img
                        src={member.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={member.full_name}
                        className="inline-block h-7 w-7 rounded-full border-2 border-white object-cover ring-1 ring-slate-200 transition-transform group-hover/avatar:scale-110 group-hover/avatar:z-10"
                      />
                      <div className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-sm transition-opacity group-hover/avatar:opacity-100 z-30">
                        {member.full_name}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-50 text-[10px] text-slate-400">
                    <Users className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>Daily {project.scheduled_report_time ? project.scheduled_report_time.slice(0, 5) : '17:00'}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="mt-5 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
            <span className="text-[11px] text-slate-500 font-normal">Progress Bar</span>
            <span className="text-slate-900 font-bold">{project.progress_pct || 0}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                (project.progress_pct || 0) >= 90
                  ? 'bg-emerald-500'
                  : (project.progress_pct || 0) >= 50
                  ? 'bg-emerald-600'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${project.progress_pct || 0}%` }}
            />
          </div>
        </div>
      </div>

      <EditProjectModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        project={project}
      />
    </>
  );
}

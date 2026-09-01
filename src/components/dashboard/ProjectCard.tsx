'use client';

import React, { useState } from 'react';
import { Project, ProjectStatus } from '@/types';
import { Clock, CheckCircle2, AlertCircle, Edit, Trash2, ChevronDown } from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import { EditProjectModal } from '@/components/modals/EditProjectModal';
import { UserAvatar } from '@/components/ui/UserAvatar';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { updateProjectStatus, deleteProject, currentUser } = useApp();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'review':
        return 'Under Review';
      case 'completed':
        return 'Completed';
      default:
        return 'Planning';
    }
  };

  const handleStatusChange = (newStatus: ProjectStatus) => {
    updateProjectStatus(project.id, newStatus);
    setIsStatusDropdownOpen(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      deleteProject(project.id);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <>
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-slate-300 relative group">
        <div>
          {/* Top row: Client Tag, Status Dropdown, and Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
              {project.client_name}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Interactive Status Selector for Admin */}
              <div className="relative">
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition hover:opacity-80 ${getStatusColor(
                    project.status
                  )}`}
                >
                  <span>{getStatusLabel(project.status)}</span>
                  {isAdmin && <ChevronDown className="h-3 w-3 opacity-60" />}
                </button>

                {isStatusDropdownOpen && isAdmin && (
                  <div className="absolute right-0 mt-1 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg z-20 text-xs animate-in fade-in">
                    <button
                      onClick={() => handleStatusChange('planning')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Planning
                    </button>
                    <button
                      onClick={() => handleStatusChange('in_progress')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-blue-700 hover:bg-blue-50 font-medium"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange('review')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-amber-700 hover:bg-amber-50 font-medium"
                    >
                      Under Review
                    </button>
                    <button
                      onClick={() => handleStatusChange('completed')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 font-medium"
                    >
                      Completed
                    </button>
                  </div>
                )}
              </div>

              {/* Admin Edit / Delete Actions */}
              {isAdmin && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition"
                    title="Edit Project"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                    title="Delete Project"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Project Title & Description */}
          <h3 className="mt-3 text-base font-extrabold tracking-tight text-slate-900 leading-snug">
            {project.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {project.description || 'Continuous project tracking & daily developer work reporting.'}
          </p>

          {/* Progress Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Completion</span>
              <span className="font-extrabold text-slate-900">{project.progress_pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  project.progress_pct === 100
                    ? 'bg-emerald-500'
                    : project.progress_pct > 60
                    ? 'bg-blue-600'
                    : 'bg-indigo-500'
                }`}
                style={{ width: `${project.progress_pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: Report Time & Member Avatars */}
        <div className="mt-5 border-t border-slate-100 pt-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>Daily report: <strong className="text-slate-800 font-bold">{project.scheduled_report_time || '5:00 PM'}</strong></span>
          </div>

          {/* Assigned Developer Member Avatars with Initials Fallback */}
          <div className="flex -space-x-2 overflow-hidden">
            {(project.members || []).slice(0, 3).map((member, idx) => (
              <UserAvatar
                key={member.id || idx}
                avatarUrl={member.avatar_url}
                name={member.full_name}
                email={member.email}
                sizeClassName="h-6 w-6"
                textSizeClassName="text-[8px]"
                className="border-2 border-white ring-1 ring-slate-200"
              />
            ))}
            {(project.members || []).length > 3 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 border-2 border-white text-[9px] font-bold text-slate-600">
                +{(project.members || []).length - 3}
              </div>
            )}
            {(!project.members || project.members.length === 0) && (
              <span className="text-[10px] text-slate-400 italic">No devs assigned</span>
            )}
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

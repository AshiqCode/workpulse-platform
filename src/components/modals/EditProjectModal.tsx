'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Clock, Calendar, Building, Trash2, Check, AlertCircle } from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import { Project, ProjectStatus } from '@/types';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const { updateProject, deleteProject, developers } = useApp();
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [progressPct, setProgressPct] = useState<number>(0);
  const [scheduledReportTime, setScheduledReportTime] = useState('17:00:00');
  const [deadline, setDeadline] = useState('');
  const [selectedDevIds, setSelectedDevIds] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClientName(project.client_name);
      setDescription(project.description || '');
      setStatus(project.status);
      setProgressPct(project.progress_pct || 0);
      setScheduledReportTime(project.scheduled_report_time || '17:00:00');
      setDeadline(project.deadline ? project.deadline.split('T')[0] : '');
      setSelectedDevIds(project.assigned_dev_ids || []);
      setConfirmDelete(false);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const toggleDevSelection = (id: string) => {
    setSelectedDevIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientName) return;

    updateProject(project.id, {
      name,
      client_name: clientName,
      description,
      status,
      progress_pct: Number(progressPct),
      scheduled_report_time: scheduledReportTime,
      deadline: deadline ? new Date(deadline).toISOString() : project.deadline,
      assigned_dev_ids: selectedDevIds,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleDelete = () => {
    deleteProject(project.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Edit Project Details</h3>
            <p className="text-xs text-slate-500">Update project scope, change status, or reassign engineers</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSaved ? (
          <div className="py-12 text-center animate-in fade-in zoom-in">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-base font-bold text-slate-900">Project Updated!</h4>
            <p className="mt-1 text-xs text-slate-500">All changes and developer assignments saved.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Client Name *</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Status & Progress Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Status (CRUD)</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-semibold text-slate-800 text-xs focus:border-blue-600 focus:outline-none"
                >
                  <option value="planning">Plan (Planning)</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between font-bold text-slate-700 mb-1">
                  <span>Progress Percentage</span>
                  <span className="text-blue-600">{progressPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPct}
                  onChange={(e) => setProgressPct(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Daily Report Deadline</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={scheduledReportTime}
                    onChange={(e) => setScheduledReportTime(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                  >
                    <option value="16:00:00">4:00 PM (16:00)</option>
                    <option value="17:00:00">5:00 PM (17:00)</option>
                    <option value="18:00:00">6:00 PM (18:00)</option>
                    <option value="19:00:00">7:00 PM (19:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Developer Assignment Section */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Assigned Developers ({selectedDevIds.length} assigned)
              </label>
              {developers.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No developers on team yet. Invite developers first.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto rounded-xl border border-slate-200 p-2 bg-slate-50/50">
                  {developers.map((dev) => {
                    const isSelected = selectedDevIds.includes(dev.id);
                    return (
                      <div
                        key={dev.id}
                        onClick={() => toggleDevSelection(dev.id)}
                        className={`flex items-center gap-2.5 rounded-lg border p-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={dev.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={dev.full_name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span className="truncate text-xs">{dev.full_name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions: Delete or Save */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="text-xs text-slate-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Project</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

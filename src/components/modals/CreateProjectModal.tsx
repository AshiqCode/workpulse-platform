'use client';

import React, { useState } from 'react';
import { X, FolderPlus, Clock, Calendar, Building, Check } from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import { ProjectStatus } from '@/types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { addProject, developers } = useApp();
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledReportTime, setScheduledReportTime] = useState('17:00:00');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [selectedDevIds, setSelectedDevIds] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleDevSelection = (id: string) => {
    setSelectedDevIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientName) return;

    addProject({
      name,
      client_name: clientName,
      description,
      status,
      progress_pct: 15,
      deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
      scheduled_report_time: scheduledReportTime,
      assigned_dev_ids: selectedDevIds,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setName('');
      setClientName('');
      setDescription('');
      setSelectedDevIds([]);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold">
              <FolderPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create New Project</h3>
              <p className="text-xs text-slate-500">Configure milestones and assign developers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center animate-in fade-in zoom-in">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-base font-bold text-slate-900">Project Created!</h4>
            <p className="mt-1 text-xs text-slate-500">
              Assigned developers have been notified to report work daily.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Gen Mobile App"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Client Name *</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Project Description</label>
              <textarea
                rows={2}
                placeholder="High-level project scope, architectural goals, or deliverable requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Scheduled Daily Report Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={scheduledReportTime}
                    onChange={(e) => setScheduledReportTime(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                  >
                    <option value="16:00:00">4:00 PM (16:00)</option>
                    <option value="17:00:00">5:00 PM (17:00) - Standard</option>
                    <option value="18:00:00">6:00 PM (18:00)</option>
                    <option value="19:00:00">7:00 PM (19:00)</option>
                  </select>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Developers report deadline each workday</p>
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
                Assign Developers ({selectedDevIds.length} selected)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto rounded-xl border border-slate-200 p-2 bg-slate-50/50">
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
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-2">
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
                <FolderPlus className="h-3.5 w-3.5" />
                <span>Create & Assign</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

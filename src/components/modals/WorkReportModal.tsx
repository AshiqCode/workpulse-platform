'use client';

import React, { useState } from 'react';
import { X, Send, Clock, CheckCircle2, AlertTriangle, Sparkles, FileText, Check } from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import confetti from 'canvas-confetti';

interface WorkReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export function WorkReportModal({ isOpen, onClose, defaultProjectId }: WorkReportModalProps) {
  const { projects, submitReport, currentUser } = useApp();
  // Developers may only report on projects assigned to them; admins can pick any.
  const reportableProjects =
    currentUser && currentUser.role !== 'admin'
      ? projects.filter((p) => (p.assigned_dev_ids || []).includes(currentUser.id))
      : projects;
  const [selectedProjectId, setSelectedProjectId] = useState(
    defaultProjectId || reportableProjects[0]?.id || ''
  );
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [timeSpentHours, setTimeSpentHours] = useState('4.5');
  const [prLinks, setPrLinks] = useState('');
  const [blockers, setBlockers] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ submitted: boolean; isOnTime: boolean } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasksCompleted || !selectedProjectId) return;

    setIsSubmitting(true);
    const isOnTime = await submitReport({
      project_id: selectedProjectId,
      tasks_completed: tasksCompleted,
      time_spent_hours: parseFloat(timeSpentHours) || 0,
      pr_commit_links: prLinks,
      blockers: blockers,
      tomorrow_plan: tomorrowPlan,
      developer_id: currentUser?.id || 'dev-anon',
    });
    setIsSubmitting(false);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (_) {}

    setSubmissionResult({ submitted: true, isOnTime });

    setTimeout(() => {
      setSubmissionResult(null);
      setTasksCompleted('');
      setPrLinks('');
      setBlockers('');
      setTomorrowPlan('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Submit Daily Work Report</h3>
              <p className="text-xs text-slate-500">Record tasks, engineering hours, and commit references</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submissionResult ? (
          <div className="py-10 text-center animate-in fade-in zoom-in space-y-3">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                submissionResult.isOnTime ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}
            >
              <Check className="h-7 w-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Report Successfully Submitted!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your daily engineering log has been permanently recorded in Supabase.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Status: {submissionResult.isOnTime ? 'On-Time Submission' : 'Delayed Submission'}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Project *</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                required
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 font-semibold"
              >
                {reportableProjects.length === 0 && (
                  <option value="">No projects assigned to you yet</option>
                )}
                {reportableProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.client_name}) - Deadline: {p.scheduled_report_time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tasks Completed Today *</label>
              <textarea
                required
                rows={3}
                placeholder="Bullet points of features built, bugs fixed, or PRs merged..."
                value={tasksCompleted}
                onChange={(e) => setTasksCompleted(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-slate-800 text-xs placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hours Spent *</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="18"
                    required
                    value={timeSpentHours}
                    onChange={(e) => setTimeSpentHours(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-slate-800 text-xs focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">PR / GitHub Link</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={prLinks}
                  onChange={(e) => setPrLinks(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-slate-800 text-xs placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Blockers / Dependencies (Optional)</label>
              <input
                type="text"
                placeholder="None or specify API/design dependencies..."
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-slate-800 text-xs placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tomorrow's Objectives (Optional)</label>
              <input
                type="text"
                placeholder="Next planned feature or refactoring task..."
                value={tomorrowPlan}
                onChange={(e) => setTomorrowPlan(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-slate-800 text-xs placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-3 text-[11px] text-blue-900">
              <span className="font-bold">⏰ Deadline Compliance:</span> Reports submitted before 5:00 PM PST are verified and flagged as On-Time.
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting to Supabase...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Daily Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

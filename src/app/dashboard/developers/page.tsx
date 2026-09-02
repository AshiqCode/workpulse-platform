'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { InviteDeveloperModal } from '@/components/modals/InviteDeveloperModal';
import { PaywallGate } from '@/components/layout/PaywallGate';
import { useApp } from '@/lib/auth-context';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { UserPlus, Clock, Users, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DevelopersPage() {
  const { developers, projects, workReports, deleteDeveloper } = useApp();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDelete = async (devId: string, devName: string) => {
    setDeleteError(null);
    setDeleteSuccess(null);

    // Check project assignment on client first for instant feedback
    const assignedProjects = projects.filter((p) =>
      (p.assigned_dev_ids || []).includes(devId)
    );

    if (assignedProjects.length > 0) {
      const projNames = assignedProjects.map((p) => `"${p.name}"`).join(', ');
      setDeleteError(
        `Cannot delete ${devName}: Developer is currently assigned to project(s): ${projNames}. Please remove ${devName} from those projects first.`
      );
      return;
    }

    if (!confirm(`Are you sure you want to remove ${devName} from the workspace?`)) {
      return;
    }

    setDeletingId(devId);
    const res = await deleteDeveloper(devId);
    setDeletingId(null);

    if (res.success) {
      setDeleteSuccess(`${devName} has been successfully removed.`);
      setTimeout(() => setDeleteSuccess(null), 3500);
    } else {
      setDeleteError(res.error || 'Failed to delete developer.');
    }
  };

  return (
    <PaywallGate requiredRole="admin">
      <div className="min-h-screen bg-[#F8FAFC]">
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <Navbar
            onOpenInviteModal={() => setIsInviteOpen(true)}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Developer Roster</h1>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Monitor team performance, on-time report compliance, and project allocation.
                </p>
              </div>

              <button
                onClick={() => setIsInviteOpen(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                <UserPlus className="h-4 w-4" />
                <span>+ Invite Developer</span>
              </button>
            </div>

            {/* Status alerts */}
            {deleteError && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 p-4 text-rose-800 border border-rose-200 text-xs shadow-xs animate-in fade-in">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-rose-900">Deletion Blocked</p>
                  <p className="mt-0.5 text-rose-700">{deleteError}</p>
                </div>
                <button
                  onClick={() => setDeleteError(null)}
                  className="text-rose-500 hover:text-rose-800 font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {deleteSuccess && (
              <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 p-4 text-emerald-800 border border-emerald-200 text-xs shadow-xs animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{deleteSuccess}</span>
              </div>
            )}

            {/* Developer Cards Grid */}
            {developers.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {developers.map((dev) => {
                  const assignedProjects = projects.filter((p) =>
                    (p.assigned_dev_ids || []).includes(dev.id)
                  );
                  const assignedCount = assignedProjects.length;
                  const devReports = workReports.filter((r) => r.developer_id === dev.id);
                  const onTimeCount = devReports.filter((r) => r.is_on_time).length;
                  const onTimePct = devReports.length > 0 ? Math.round((onTimeCount / devReports.length) * 100) : 0;
                  const totalHours = devReports.reduce((acc, r) => acc + (Number(r.time_spent_hours) || 0), 0);

                  return (
                    <div
                      key={dev.id}
                      className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs transition hover:shadow-md hover:border-slate-300 relative group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            avatarUrl={dev.avatar_url}
                            name={dev.full_name}
                            email={dev.email}
                            sizeClassName="h-11 w-11 sm:h-12 sm:w-12"
                            textSizeClassName="text-sm"
                            className="border-2 border-slate-100 shadow-xs shrink-0"
                          />
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm truncate">{dev.full_name}</h3>
                            <p className="text-xs text-slate-500 truncate">{dev.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                          <button
                            onClick={() => handleDelete(dev.id, dev.full_name)}
                            disabled={deletingId === dev.id}
                            title={
                              assignedCount > 0
                                ? `Assigned to ${assignedCount} project(s). Remove from projects first to delete.`
                                : 'Delete developer'
                            }
                            className={`p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition ${
                              assignedCount > 0 ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-b border-slate-100 py-3 text-center text-xs">
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">Projects</p>
                          <p className="text-sm font-extrabold text-slate-800 mt-0.5">{assignedCount}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">On-Time</p>
                          <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{onTimePct}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">Hours</p>
                          <p className="text-sm font-extrabold text-blue-600 mt-0.5">{totalHours}h</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" /> Daily: 5:00 PM
                        </span>
                        {assignedCount > 0 ? (
                          <span className="text-blue-600 font-semibold text-[11px] bg-blue-50 px-2 py-0.5 rounded-md">
                            {assignedCount} Assigned
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium text-[11px]">Unassigned</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Developers Invited Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Invite your developers with email and password. They will receive an email via Resend to log in.
                </p>
                <button
                  onClick={() => setIsInviteOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Invite Developer</span>
                </button>
              </div>
            )}
          </main>
        </div>

        <InviteDeveloperModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
      </div>
    </PaywallGate>
  );
}

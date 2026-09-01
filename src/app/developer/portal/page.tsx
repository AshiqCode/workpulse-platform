'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Send,
  GitPullRequest,
  CheckSquare,
  Square,
  Flame,
  Activity,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  FileText,
  UserCheck,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useApp } from '@/lib/auth-context';
import { WorkReportModal } from '@/components/modals/WorkReportModal';
import { PaywallGate } from '@/components/layout/PaywallGate';
import { AdminProfileModal } from '@/components/modals/AdminProfileModal';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useRouter } from 'next/navigation';

export default function DeveloperPortalPage() {
  const router = useRouter();
  const { currentUser, projects, workReports, logout } = useApp();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Task checklist local state for interactive demo
  const [tasksState, setTasksState] = useState([
    { id: 1, text: 'Review assigned tasks and check project sprint board', completed: true, priority: 'High' },
    { id: 2, text: 'Complete planned commits and push PR to repository', completed: false, priority: 'High' },
    { id: 3, text: 'Submit daily work report before 5:00 PM deadline', completed: false, priority: 'Medium' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTask = (id: number) => {
    setTasksState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const devUser = currentUser || {
    id: 'developer-guest',
    email: 'developer@example.com',
    full_name: 'Developer Member',
    role: 'developer' as const,
    avatar_url: undefined,
  };

  // Find projects assigned to current developer in Supabase
  const myProjects = projects.filter((p) =>
    (p.assigned_dev_ids || []).includes(devUser.id)
  );
  const displayProjects = myProjects.length > 0 ? myProjects : projects;

  // Current developer's reports in Supabase
  const myReports = workReports.filter((r) => r.developer_id === devUser.id);
  const onTimeCount = myReports.filter((r) => r.is_on_time).length;
  const onTimePct = myReports.length > 0 ? Math.round((onTimeCount / myReports.length) * 100) : 0;
  const totalHoursLogged = myReports.reduce((acc, r) => acc + (Number(r.time_spent_hours) || 0), 0);

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <PaywallGate requiredRole="developer">
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Top Portal Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition text-xs font-semibold">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Admin Dashboard</span>
            </Link>
            <div className="h-4 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                <Activity className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">WorkPulse <span className="text-blue-600 font-bold text-xs ml-1 bg-blue-50 px-2 py-0.5 rounded-md">Developer Portal</span></span>
            </div>
          </div>

          {/* Right Side: Profile & Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <UserAvatar
                avatarUrl={devUser.avatar_url}
                name={devUser.full_name}
                email={devUser.email}
                sizeClassName="h-6 w-6"
                textSizeClassName="text-[9px]"
              />
              <span className="hidden sm:inline">Edit Profile & DP</span>
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            <button
              onClick={() => {
                setSelectedProjectId(displayProjects[0]?.id || '');
                setIsReportModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 active:scale-98 transition"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit Daily Work Report</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 sm:p-8 max-w-[1400px] mx-auto space-y-6">
          {/* Welcome & Timer Hero Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <UserAvatar
                  avatarUrl={devUser.avatar_url}
                  name={devUser.full_name}
                  email={devUser.email}
                  sizeClassName="h-16 w-16"
                  textSizeClassName="text-xl"
                  className="border-2 border-blue-400 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black">Welcome, {devUser.full_name}</h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                      <UserCheck className="h-3 w-3" /> Active
                    </span>
                  </div>
                  <p className="text-xs text-blue-200 mt-1">
                    Scheduled Daily Report Deadline: <strong className="text-white">5:00 PM PST</strong>
                  </p>
                </div>
              </div>

              {/* Deadline & Clock status */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Current Time</p>
                  <p className="text-lg font-mono font-bold text-white mt-0.5">{currentTime || 'Loading...'}</p>
                </div>
                <div className="h-8 w-[1px] bg-white/20" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Scheduled Time</p>
                  <p className="text-sm font-bold text-emerald-300 mt-0.5 flex items-center gap-1">
                    <Clock className="h-4 w-4" /> 5:00 PM Daily
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">Assigned Projects</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{myProjects.length}</p>
              <p className="text-xs text-slate-400 mt-1">{projects.length} available in workspace</p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">On-Time Report Rate</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{onTimePct}%</p>
              <p className="text-xs text-slate-400 mt-1">{onTimeCount} of {myReports.length} reports on-time</p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Hours Logged</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{totalHoursLogged}h</p>
              <p className="text-xs text-slate-400 mt-1">Recorded in Supabase database</p>
            </div>
          </div>

          {/* Two Columns: Assigned Projects + Daily Tasks Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Assigned Projects Grid */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Your Assigned Projects ({displayProjects.length})</h2>
              </div>

              {displayProjects.length > 0 ? (
                <div className="space-y-3">
                  {displayProjects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-slate-300"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{project.client_name}</span>
                          <h3 className="text-base font-bold text-slate-900 mt-0.5">{project.name}</h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{project.description || 'Continuous project tracking.'}</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200 capitalize">
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                        <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                          <Clock className="h-3.5 w-3.5 text-slate-400" /> Scheduled report: <strong>{project.scheduled_report_time || '5:00 PM'}</strong>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            setIsReportModalOpen(true);
                          }}
                          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                          <span>File Report</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                  <p className="text-xs text-slate-500">No projects currently assigned. Contact administrator Muhammad Ashiq.</p>
                </div>
              )}
            </div>

            {/* Right: Daily Checklist */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Today's Action Checklist</h2>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
                {tasksState.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                      task.completed ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button className="mt-0.5 text-blue-600 shrink-0">
                      {task.completed ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4 text-slate-400" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submissions History Table */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Your Recent Daily Submissions in Supabase</h2>
            {myReports.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 px-4">Project</th>
                      <th className="pb-3 px-4">Tasks Completed</th>
                      <th className="pb-3 px-4">Hours</th>
                      <th className="pb-3 pl-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myReports.map((rep) => (
                      <tr key={rep.id}>
                        <td className="py-3 pr-4 font-mono text-slate-600">{rep.report_date}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{rep.project_name}</td>
                        <td className="py-3 px-4 max-w-sm text-slate-600 truncate">{rep.tasks_completed}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{rep.time_spent_hours}h</td>
                        <td className="py-3 pl-4">
                          {rep.is_on_time ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                              On-Time
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                              Delayed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                You haven't submitted any daily reports yet. Click "Submit Daily Work Report" above to file your first report.
              </div>
            )}
          </div>
        </main>

        <WorkReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          defaultProjectId={selectedProjectId}
        />

        <AdminProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </div>
    </PaywallGate>
  );
}

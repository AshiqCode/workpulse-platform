'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, Project, WorkReport, DashboardStats } from '@/types';
import { INITIAL_PROFILES, INITIAL_PROJECTS, INITIAL_WORK_LOGS, INITIAL_STATS } from './mock-data';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchUser: (role: UserRole, id?: string) => void;
  isPaidAdmin: boolean;
  setIsPaidAdmin: (paid: boolean) => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  workReports: WorkReport[];
  setWorkReports: React.Dispatch<React.SetStateAction<WorkReport[]>>;
  developers: UserProfile[];
  setDevelopers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  stats: DashboardStats;
  addProject: (project: Omit<Project, 'id' | 'created_at'>) => void;
  inviteDeveloper: (email: string, fullName: string) => void;
  submitReport: (report: Omit<WorkReport, 'id' | 'report_date' | 'submitted_at' | 'status' | 'is_on_time'>) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [developers, setDevelopers] = useState<UserProfile[]>(INITIAL_PROFILES.filter((p) => p.role === 'developer'));
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_PROFILES[0]); // Default Admin
  const [isPaidAdmin, setIsPaidAdmin] = useState<boolean>(true); // $62 Pro access
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [workReports, setWorkReports] = useState<WorkReport[]>(INITIAL_WORK_LOGS);
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);

  // Recalculate stats when projects or reports change
  useEffect(() => {
    const onTimeReports = workReports.filter((r) => r.is_on_time).length;
    const totalReports = workReports.length;
    const onTimePct = totalReports > 0 ? Math.round((onTimeReports / totalReports) * 100) : 100;
    const totalHours = workReports.reduce((acc, r) => acc + (r.time_spent_hours || 0), 0) + 540;

    setStats({
      activeProjects: projects.filter((p) => p.status !== 'completed').length,
      assignedDevelopers: developers.length,
      todaysReportsSubmitted: totalReports,
      todaysReportsExpected: developers.length + 2,
      totalWeeklyHours: totalHours,
      onTimeRatePct: onTimePct,
      activeProjectsChangePct: 3,
      weeklyHoursChange: 25,
    });
  }, [projects, workReports, developers]);

  const switchUser = (role: UserRole, id?: string) => {
    if (role === 'admin') {
      setCurrentUser({ ...INITIAL_PROFILES[0], is_paid_admin: isPaidAdmin });
    } else {
      const dev = developers.find((d) => (id ? d.id === id : true)) || developers[0];
      setCurrentUser(dev);
    }
  };

  const addProject = (newProj: Omit<Project, 'id' | 'created_at'>) => {
    const assignedMembers = developers.filter((d) => (newProj.assigned_dev_ids || []).includes(d.id));
    const created: Project = {
      ...newProj,
      id: `proj-${Date.now()}`,
      created_at: new Date().toISOString(),
      members: assignedMembers,
    };
    setProjects((prev) => [created, ...prev]);
  };

  const inviteDeveloper = (email: string, fullName: string) => {
    const newDev: UserProfile = {
      id: `dev-${Date.now()}`,
      email,
      full_name: fullName,
      role: 'developer',
      avatar_url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=150`,
      is_paid_admin: false,
      assigned_projects_count: 0,
      on_time_rate_pct: 100,
      total_hours_logged: 0,
    };
    setDevelopers((prev) => [...prev, newDev]);
  };

  const submitReport = (reportData: Omit<WorkReport, 'id' | 'report_date' | 'submitted_at' | 'status' | 'is_on_time'>): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    // Check if on-time (before 17:00 / 5 PM local)
    const isOnTime = currentHour < 17 || (currentHour === 17 && currentMin <= 15);
    const targetProject = projects.find((p) => p.id === reportData.project_id);

    const newReport: WorkReport = {
      ...reportData,
      id: `report-${Date.now()}`,
      project_name: targetProject?.name || 'Project Assignment',
      client_name: targetProject?.client_name || 'Client',
      developer_id: currentUser.id,
      developer_name: currentUser.full_name,
      developer_avatar: currentUser.avatar_url,
      developer_email: currentUser.email,
      report_date: now.toISOString().split('T')[0],
      scheduled_time: targetProject?.scheduled_report_time || '5:00 PM PST',
      submitted_at: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      is_on_time: isOnTime,
      status: isOnTime ? 'submitted' : 'delayed',
    };

    setWorkReports((prev) => [newReport, ...prev]);

    // Update developer stats
    setDevelopers((prev) =>
      prev.map((d) =>
        d.id === currentUser.id
          ? {
              ...d,
              total_hours_logged: (d.total_hours_logged || 0) + reportData.time_spent_hours,
            }
          : d
      )
    );

    return isOnTime;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUser,
        isPaidAdmin,
        setIsPaidAdmin,
        projects,
        setProjects,
        workReports,
        setWorkReports,
        developers,
        setDevelopers,
        stats,
        addProject,
        inviteDeveloper,
        submitReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

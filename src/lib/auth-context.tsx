'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, Project, WorkReport, DashboardStats, ProjectStatus } from '@/types';
import { ADMIN_USER, INITIAL_PROJECTS, INITIAL_WORK_LOGS, INITIAL_STATS } from './mock-data';

interface AuthResult {
  success: boolean;
  role?: UserRole;
  error?: string;
}

interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  isAuthenticated: boolean;
  adminProfile: UserProfile;
  login: (email: string, password: string) => AuthResult;
  signup: (email: string, password: string, fullName: string) => AuthResult;
  logout: () => void;
  switchUser: (role: UserRole, id?: string) => void;
  updateAdminProfile: (updates: Partial<UserProfile>) => void;
  invitedEmails: string[];
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  workReports: WorkReport[];
  setWorkReports: React.Dispatch<React.SetStateAction<WorkReport[]>>;
  developers: UserProfile[];
  setDevelopers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  stats: DashboardStats;
  addProject: (project: Omit<Project, 'id' | 'created_at'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  updateProjectStatus: (id: string, status: ProjectStatus) => void;
  deleteProject: (id: string) => void;
  inviteDeveloper: (email: string, fullName: string) => void;
  submitReport: (report: Omit<WorkReport, 'id' | 'report_date' | 'submitted_at' | 'status' | 'is_on_time'>) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [adminProfile, setAdminProfile] = useState<UserProfile>(ADMIN_USER);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(ADMIN_USER); // Logged in as Admin by default for convenience
  const [developers, setDevelopers] = useState<UserProfile[]>([]);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([
    'demo.dev@workpulse.io',
    'sarah.dev@workpulse.io'
  ]);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [workReports, setWorkReports] = useState<WorkReport[]>(INITIAL_WORK_LOGS);
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);

  // Recalculate stats when projects, reports, or developers change
  useEffect(() => {
    const onTimeReports = workReports.filter((r) => r.is_on_time).length;
    const totalReports = workReports.length;
    const onTimePct = totalReports > 0 ? Math.round((onTimeReports / totalReports) * 100) : 100;
    const totalHours = workReports.reduce((acc, r) => acc + (r.time_spent_hours || 0), 0);

    setStats({
      activeProjects: projects.filter((p) => p.status !== 'completed').length,
      assignedDevelopers: developers.length,
      todaysReportsSubmitted: totalReports,
      todaysReportsExpected: developers.length,
      totalWeeklyHours: totalHours,
      onTimeRatePct: onTimePct,
      activeProjectsChangePct: projects.length > 0 ? 100 : 0,
      weeklyHoursChange: totalHours,
    });
  }, [projects, workReports, developers]);

  const login = (email: string, password: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Admin Login Check
    if (cleanEmail === 'muhammadashiq.dev@gmail.com') {
      if (password === 'krazy8' || password === adminProfile.password) {
        setCurrentUser(adminProfile);
        return { success: true, role: 'admin' };
      } else {
        return { success: false, error: 'Incorrect admin password. (Default is krazy8)' };
      }
    }

    // 2. Developer Login Check - MUST BE INVITED BY ADMIN
    const isInvited = invitedEmails.map((e) => e.toLowerCase()).includes(cleanEmail);
    const existingDev = developers.find((d) => d.email.toLowerCase() === cleanEmail);

    if (!isInvited && !existingDev) {
      return {
        success: false,
        error:
          'Access Denied: You must be invited by the Administrator (muhammadashiq.dev@gmail.com) to access the developer portal.',
      };
    }

    if (existingDev) {
      if (existingDev.password && existingDev.password !== password) {
        return { success: false, error: 'Incorrect developer password.' };
      }
      setCurrentUser(existingDev);
      return { success: true, role: 'developer' };
    }

    // If invited but hasn't created a password yet, create dev profile
    const newDev: UserProfile = {
      id: `dev-${Date.now()}`,
      email: cleanEmail,
      full_name: cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      role: 'developer',
      avatar_url: `https://images.unsplash.com/photo-1535713875002?w=150`,
      is_invited: true,
      password: password,
      assigned_projects_count: 0,
      on_time_rate_pct: 100,
      total_hours_logged: 0,
    };

    setDevelopers((prev) => [...prev, newDev]);
    setCurrentUser(newDev);
    return { success: true, role: 'developer' };
  };

  const signup = (email: string, password: string, fullName: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'muhammadashiq.dev@gmail.com') {
      const updated = { ...adminProfile, full_name: fullName, password };
      setAdminProfile(updated);
      setCurrentUser(updated);
      return { success: true, role: 'admin' };
    }

    // Developer signup - verify invitation
    const isInvited = invitedEmails.map((e) => e.toLowerCase()).includes(cleanEmail);
    if (!isInvited) {
      return {
        success: false,
        error:
          'Registration Denied: This email has not been invited by the Administrator (muhammadashiq.dev@gmail.com). Ask your admin to send an invitation first.',
      };
    }

    const newDev: UserProfile = {
      id: `dev-${Date.now()}`,
      email: cleanEmail,
      full_name: fullName,
      role: 'developer',
      avatar_url: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?w=150`,
      is_invited: true,
      password: password,
      assigned_projects_count: 0,
      on_time_rate_pct: 100,
      total_hours_logged: 0,
    };

    setDevelopers((prev) => [...prev.filter((d) => d.email.toLowerCase() !== cleanEmail), newDev]);
    setCurrentUser(newDev);
    return { success: true, role: 'developer' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (role: UserRole, id?: string) => {
    if (role === 'admin') {
      setCurrentUser(adminProfile);
    } else {
      const dev = developers.find((d) => (id ? d.id === id : true)) || developers[0] || {
        id: 'guest-dev',
        email: 'developer@example.com',
        full_name: 'Developer Member',
        role: 'developer' as const,
      };
      setCurrentUser(dev);
    }
  };

  const updateAdminProfile = (updates: Partial<UserProfile>) => {
    setAdminProfile((prev) => {
      const updated = { ...prev, ...updates, updated_at: new Date().toISOString() };
      if (currentUser?.role === 'admin') {
        setCurrentUser(updated);
      }
      return updated;
    });
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

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updatedDevIds = updates.assigned_dev_ids !== undefined ? updates.assigned_dev_ids : p.assigned_dev_ids;
        const updatedMembers = developers.filter((d) => (updatedDevIds || []).includes(d.id));
        return {
          ...p,
          ...updates,
          members: updatedMembers,
          updated_at: new Date().toISOString(),
        };
      })
    );
  };

  const updateProjectStatus = (id: string, status: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, updated_at: new Date().toISOString() } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setWorkReports((prev) => prev.filter((r) => r.project_id !== id));
  };

  const inviteDeveloper = (email: string, fullName: string) => {
    const cleanEmail = email.trim().toLowerCase();
    setInvitedEmails((prev) => (prev.includes(cleanEmail) ? prev : [...prev, cleanEmail]));

    const newDev: UserProfile = {
      id: `dev-${Date.now()}`,
      email: cleanEmail,
      full_name: fullName,
      role: 'developer',
      avatar_url: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 10000)}?w=150`,
      is_invited: true,
      assigned_projects_count: 0,
      on_time_rate_pct: 100,
      total_hours_logged: 0,
    };

    setDevelopers((prev) => [...prev.filter((d) => d.email.toLowerCase() !== cleanEmail), newDev]);
  };

  const submitReport = (reportData: Omit<WorkReport, 'id' | 'report_date' | 'submitted_at' | 'status' | 'is_on_time'>): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    // Check if on-time (before 17:00 / 5 PM local)
    const isOnTime = currentHour < 17 || (currentHour === 17 && currentMin <= 15);
    const targetProject = projects.find((p) => p.id === reportData.project_id);

    const devName = currentUser?.full_name || 'Developer Member';
    const devAvatar = currentUser?.avatar_url || 'https://images.unsplash.com/photo-1535713875002?w=150';
    const devId = currentUser?.id || `dev-${Date.now()}`;
    const devEmail = currentUser?.email || 'developer@example.com';

    const newReport: WorkReport = {
      ...reportData,
      id: `report-${Date.now()}`,
      project_name: targetProject?.name || 'Project Assignment',
      client_name: targetProject?.client_name || 'Client',
      developer_id: devId,
      developer_name: devName,
      developer_avatar: devAvatar,
      developer_email: devEmail,
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
        d.id === devId
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
        isAuthenticated: !!currentUser,
        adminProfile,
        login,
        signup,
        logout,
        switchUser,
        updateAdminProfile,
        invitedEmails,
        projects,
        setProjects,
        workReports,
        setWorkReports,
        developers,
        setDevelopers,
        stats,
        addProject,
        updateProject,
        updateProjectStatus,
        deleteProject,
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

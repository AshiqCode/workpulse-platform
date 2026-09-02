'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole, Project, WorkReport, DashboardStats, ProjectStatus } from '@/types';
import { ADMIN_USER, INITIAL_STATS } from './mock-data';
import {
  getProjects,
  getDevelopers,
  getWorkReports,
  getAdminProfile,
  updateProfileInDb,
  createProject as createProjectInDb,
  updateProject as updateProjectInDb,
  updateProjectStatus as updateProjectStatusInDb,
  deleteProject as deleteProjectInDb,
  submitWorkReport as submitWorkReportInDb,
  getAllProfiles,
} from './supabase';

interface AuthResult {
  success: boolean;
  role?: UserRole;
  error?: string;
  user?: UserProfile;
}

interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  isAuthenticated: boolean;
  adminProfile: UserProfile;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string, fullName: string) => Promise<AuthResult>;
  logout: () => void;
  switchUser: (role: UserRole, id?: string) => void;
  updateAdminProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateUserProfile: (id: string, updates: Partial<UserProfile>) => Promise<boolean>;
  invitedEmails: string[];
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  workReports: WorkReport[];
  setWorkReports: React.Dispatch<React.SetStateAction<WorkReport[]>>;
  developers: UserProfile[];
  setDevelopers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  stats: DashboardStats;
  isLoadingData: boolean;
  refreshData: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'created_at'>) => Promise<boolean>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<boolean>;
  updateProjectStatus: (id: string, status: ProjectStatus) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  inviteDeveloper: (email: string, fullName: string, password?: string, projectId?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  deleteDeveloper: (id: string) => Promise<{ success: boolean; error?: string }>;
  submitReport: (report: Omit<WorkReport, 'id' | 'report_date' | 'submitted_at' | 'status' | 'is_on_time'>) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [adminProfile, setAdminProfile] = useState<UserProfile>(ADMIN_USER);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [developers, setDevelopers] = useState<UserProfile[]>([]);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workReports, setWorkReports] = useState<WorkReport[]>([]);
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Load live data from Supabase
  const refreshData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [fetchedProjects, fetchedDevs, fetchedReports, fetchedAdmin, allProfiles] = await Promise.all([
        getProjects(),
        getDevelopers(),
        getWorkReports(),
        getAdminProfile(),
        getAllProfiles(),
      ]);

      setProjects(fetchedProjects);
      setDevelopers(fetchedDevs);
      setWorkReports(fetchedReports);

      if (fetchedAdmin) {
        setAdminProfile(fetchedAdmin);
      }

      // Collect all developer emails
      const devEmails = allProfiles
        .filter((p) => p.role === 'developer')
        .map((p) => p.email.toLowerCase());
      setInvitedEmails(devEmails);
    } catch (err) {
      console.error('Error loading Supabase data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Recalculate true stats dynamically from Supabase collections
  useEffect(() => {
    const activeProjectsCount = projects.filter((p) => p.status !== 'completed').length;
    const devCount = developers.length;
    const totalReports = workReports.length;
    const onTimeReports = workReports.filter((r) => r.is_on_time).length;
    const onTimePct = totalReports > 0 ? Math.round((onTimeReports / totalReports) * 100) : 0;
    const totalHours = workReports.reduce((acc, r) => acc + (Number(r.time_spent_hours) || 0), 0);

    setStats({
      activeProjects: activeProjectsCount,
      assignedDevelopers: devCount,
      todaysReportsSubmitted: totalReports,
      todaysReportsExpected: devCount,
      totalWeeklyHours: totalHours,
      onTimeRatePct: onTimePct,
      activeProjectsChangePct: activeProjectsCount > 0 ? 0 : 0,
      weeklyHoursChange: 0,
    });
  }, [projects, workReports, developers]);

  // Unified direct login handler: Checks Supabase database status (Admin vs Developer) dynamically
  const login = async (email: string, password: string): Promise<AuthResult> => {
    const cleanEmail = email.trim().toLowerCase();

    // Fetch all real profiles from Supabase to dynamically check role & status
    const allProfiles = await getAllProfiles();
    const matchedProfile = allProfiles.find(
      (p) => p.email.toLowerCase() === cleanEmail
    );

    // 1. If user is found in Supabase database
    if (matchedProfile) {
      // Check password
      const expectedPassword = matchedProfile.password || (matchedProfile.role === 'admin' ? 'krazy8' : '');
      
      // If admin and default password fallback
      const isPasswordValid =
        password === expectedPassword ||
        (matchedProfile.role === 'admin' && (password === 'krazy8' || password === adminProfile.password));

      if (!isPasswordValid) {
        return {
          success: false,
          error: `Incorrect password for ${matchedProfile.role === 'admin' ? 'Administrator' : 'Developer'} account.`,
        };
      }

      // Check role status
      if (matchedProfile.role === 'admin') {
        const adminUser = { ...matchedProfile, role: 'admin' as const };
        setAdminProfile(adminUser);
        setCurrentUser(adminUser);
        return { success: true, role: 'admin', user: adminUser };
      } else {
        const devUser = { ...matchedProfile, role: 'developer' as const };
        setCurrentUser(devUser);
        return { success: true, role: 'developer', user: devUser };
      }
    }

    // 2. Fallback check for default primary admin if database is initializing
    if (cleanEmail === 'muhammadashiq.dev@gmail.com') {
      const adminPass = adminProfile.password || 'krazy8';
      if (password === 'krazy8' || password === adminPass) {
        const userToSet = { ...adminProfile, role: 'admin' as const };
        setCurrentUser(userToSet);
        return { success: true, role: 'admin', user: userToSet };
      } else {
        return { success: false, error: 'Incorrect admin password. (Default is krazy8)' };
      }
    }

    // 3. User does not exist in Supabase
    return {
      success: false,
      error:
        'Account Not Found: No account exists with this email. Developers must be invited by the Administrator (muhammadashiq.dev@gmail.com).',
    };
  };

  const signup = async (email: string, password: string, fullName: string): Promise<AuthResult> => {
    return login(email, password);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (role: UserRole, id?: string) => {
    if (role === 'admin') {
      setCurrentUser(adminProfile);
    } else {
      const dev = developers.find((d) => (id ? d.id === id : true)) || developers[0] || null;
      if (dev) setCurrentUser(dev);
    }
  };

  const updateAdminProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      const { success, profile } = await updateProfileInDb(adminProfile.id, updates);
      if (success && profile) {
        setAdminProfile(profile);
        if (currentUser?.role === 'admin') {
          setCurrentUser(profile);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating admin profile:', err);
      return false;
    }
  };

  const updateUserProfile = async (id: string, updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      const { success, profile } = await updateProfileInDb(id, updates);
      if (success && profile) {
        if (currentUser?.id === id) {
          setCurrentUser(profile);
        }
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating user profile:', err);
      return false;
    }
  };

  const addProject = async (newProj: Omit<Project, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      const res = await createProjectInDb({
        name: newProj.name,
        client_name: newProj.client_name,
        description: newProj.description || '',
        deadline: newProj.deadline,
        scheduled_report_time: newProj.scheduled_report_time,
        developer_ids: newProj.assigned_dev_ids || [],
        status: newProj.status,
        progress_pct: newProj.progress_pct,
      });

      if (res.success) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding project:', err);
      return false;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<boolean> => {
    try {
      const res = await updateProjectInDb(id, updates);
      if (res.success) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating project:', err);
      return false;
    }
  };

  const updateProjectStatus = async (id: string, status: ProjectStatus): Promise<boolean> => {
    try {
      const res = await updateProjectStatusInDb(id, status);
      if (res.success) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating status:', err);
      return false;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const res = await deleteProjectInDb(id);
      if (res.success) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting project:', err);
      return false;
    }
  };

  const inviteDeveloper = async (
    email: string,
    fullName: string,
    password?: string,
    projectId?: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const devPassword = password || 'dev' + Math.random().toString(36).substring(2, 6);

      const response = await fetch('/api/developers/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          fullName: fullName.trim(),
          password: devPassword,
          projectId: projectId || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to invite developer.' };
      }

      await refreshData();
      return { success: true, message: data.message };
    } catch (err: any) {
      console.error('Error in inviteDeveloper:', err);
      return { success: false, error: err?.message || 'Network error sending invite.' };
    }
  };

  const deleteDeveloper = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/developers/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to delete developer.' };
      }
      await refreshData();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting developer:', err);
      return { success: false, error: err?.message || 'Network error deleting developer.' };
    }
  };

  const submitReport = async (
    reportData: Omit<WorkReport, 'id' | 'report_date' | 'submitted_at' | 'status' | 'is_on_time'>
  ): Promise<boolean> => {
    try {
      const devId = currentUser?.id || adminProfile.id;
      const res = await submitWorkReportInDb({
        project_id: reportData.project_id,
        developer_id: devId,
        tasks_completed: reportData.tasks_completed,
        time_spent_hours: reportData.time_spent_hours,
        pr_commit_links: reportData.pr_commit_links,
        blockers: reportData.blockers,
        tomorrow_plan: reportData.tomorrow_plan,
        scheduled_time: reportData.scheduled_time,
      });

      if (res.success) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error submitting report:', err);
      return false;
    }
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
        updateUserProfile,
        invitedEmails,
        projects,
        setProjects,
        workReports,
        setWorkReports,
        developers,
        setDevelopers,
        stats,
        isLoadingData,
        refreshData,
        addProject,
        updateProject,
        updateProjectStatus,
        deleteProject,
        inviteDeveloper,
        deleteDeveloper,
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

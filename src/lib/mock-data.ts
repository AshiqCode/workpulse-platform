import { UserProfile, Project, WorkReport, DashboardStats } from '@/types';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'admin-primary-001',
    email: 'admin@workpulse.io',
    full_name: 'Platform Admin',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    is_paid_admin: false, // Default unpaid until $62 is paid
  }
];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_WORK_LOGS: WorkReport[] = [];

export const INITIAL_STATS: DashboardStats = {
  activeProjects: 0,
  assignedDevelopers: 0,
  todaysReportsSubmitted: 0,
  todaysReportsExpected: 0,
  totalWeeklyHours: 0,
  onTimeRatePct: 100,
  activeProjectsChangePct: 0,
  weeklyHoursChange: 0,
};

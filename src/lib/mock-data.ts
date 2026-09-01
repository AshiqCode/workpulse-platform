import { UserProfile, Project, WorkReport, DashboardStats } from '@/types';

export const ADMIN_USER: UserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'muhammadashiq.dev@gmail.com',
  full_name: 'Muhammad Ashiq',
  role: 'admin',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  company: 'Ashiq Dev Studio',
  bio: 'Lead Engineer & Project Administrator',
  password: 'krazy8',
};

export const INITIAL_PROFILES: UserProfile[] = [ADMIN_USER];

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

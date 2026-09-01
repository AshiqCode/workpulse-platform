export type UserRole = 'admin' | 'developer';

export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed';

export type ReportStatus = 'submitted' | 'delayed' | 'approved' | 'flagged';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  company?: string;
  is_invited?: boolean;
  password?: string;
  created_at?: string;
  updated_at?: string;
  // Computed stats
  assigned_projects_count?: number;
  on_time_rate_pct?: number;
  total_hours_logged?: number;
}

export interface Project {
  id: string;
  name: string;
  client_name: string;
  description?: string;
  status: ProjectStatus;
  progress_pct: number;
  deadline?: string;
  scheduled_report_time: string; // e.g. "17:00:00"
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  // Expanded relations
  members?: UserProfile[];
  assigned_dev_ids?: string[];
}

export interface ProjectMember {
  id: string;
  project_id: string;
  developer_id: string;
  role_in_project: string;
  assigned_at?: string;
}

export interface WorkReport {
  id: string;
  project_id: string;
  project_name?: string;
  client_name?: string;
  developer_id: string;
  developer_name?: string;
  developer_email?: string;
  developer_avatar?: string;
  report_date: string; // YYYY-MM-DD
  scheduled_time?: string; // HH:mm:ss
  submitted_at: string; // ISO string
  is_on_time: boolean;
  tasks_completed: string;
  time_spent_hours: number;
  pr_commit_links?: string;
  blockers?: string;
  tomorrow_plan?: string;
  status: ReportStatus;
  created_at?: string;
}

export interface Invitation {
  id: string;
  invited_by: string;
  email: string;
  role: UserRole;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at?: string;
}

export interface DashboardStats {
  activeProjects: number;
  assignedDevelopers: number;
  todaysReportsSubmitted: number;
  todaysReportsExpected: number;
  totalWeeklyHours: number;
  onTimeRatePct: number;
  activeProjectsChangePct: number;
  weeklyHoursChange: number;
}

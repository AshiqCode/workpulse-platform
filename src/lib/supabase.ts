import { createClient } from '@supabase/supabase-js';
import { Project, UserProfile, WorkReport, ProjectStatus } from '@/types';
import { INITIAL_PROFILES, INITIAL_PROJECTS, INITIAL_WORK_LOGS } from './mock-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xzdizzxghqijqkvriold.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6ZGl6enhnaHFpanFrdnJpb2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3OTU0MDEsImV4cCI6MjA4NjM3MTQwMX0.mZyqMrukhUBXU-Nw2nQhWIRYoCDO336rZJDo0tj_b6Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProjects(): Promise<Project[]> {
  try {
    const { data: projectsData, error: projError } = await supabase
      .from('workpulse_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (projError || !projectsData) {
      return [];
    }

    const { data: membersData } = await supabase
      .from('workpulse_project_members')
      .select('project_id, developer_id, role_in_project');

    const { data: profilesData } = await supabase
      .from('workpulse_profiles')
      .select('*');

    const profilesMap = new Map<string, UserProfile>();
    (profilesData || []).forEach((p) => profilesMap.set(p.id, p));

    return projectsData.map((p) => {
      const assignedMembers: UserProfile[] = [];
      const assignedIds: string[] = [];

      if (membersData) {
        membersData
          .filter((m) => m.project_id === p.id)
          .forEach((m) => {
            assignedIds.push(m.developer_id);
            const prof = profilesMap.get(m.developer_id);
            if (prof) assignedMembers.push(prof);
          });
      }

      return {
        ...p,
        assigned_dev_ids: assignedIds,
        members: assignedMembers,
      };
    });
  } catch (err) {
    console.warn('Error fetching projects:', err);
    return [];
  }
}

export async function createProject(projectData: {
  name: string;
  client_name: string;
  description: string;
  deadline: string;
  scheduled_report_time: string;
  developer_ids: string[];
  status?: ProjectStatus;
  progress_pct?: number;
}): Promise<{ success: boolean; project?: any; error?: string }> {
  try {
    const { data: proj, error: pError } = await supabase
      .from('workpulse_projects')
      .insert({
        name: projectData.name,
        client_name: projectData.client_name,
        description: projectData.description,
        deadline: projectData.deadline,
        scheduled_report_time: projectData.scheduled_report_time || '17:00:00',
        status: projectData.status || 'in_progress',
        progress_pct: projectData.progress_pct || 0,
      })
      .select()
      .single();

    if (pError) throw pError;

    if (projectData.developer_ids && projectData.developer_ids.length > 0) {
      const membersToInsert = projectData.developer_ids.map((devId) => ({
        project_id: proj.id,
        developer_id: devId,
        role_in_project: 'Developer',
      }));

      await supabase.from('workpulse_project_members').insert(membersToInsert);
    }

    return { success: true, project: proj };
  } catch (err: any) {
    console.error('Error creating project:', err);
    return { success: false, error: err.message };
  }
}

export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<{ success: boolean; project?: any; error?: string }> {
  try {
    const { assigned_dev_ids, members, ...projectFields } = updates;

    const { data: proj, error } = await supabase
      .from('workpulse_projects')
      .update({
        ...projectFields,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (assigned_dev_ids !== undefined) {
      // Re-assign members
      await supabase.from('workpulse_project_members').delete().eq('project_id', id);
      if (assigned_dev_ids.length > 0) {
        const membersToInsert = assigned_dev_ids.map((devId) => ({
          project_id: id,
          developer_id: devId,
          role_in_project: 'Developer',
        }));
        await supabase.from('workpulse_project_members').insert(membersToInsert);
      }
    }

    return { success: true, project: proj };
  } catch (err: any) {
    console.error('Error updating project:', err);
    return { success: false, error: err.message };
  }
}

export async function updateProjectStatus(
  id: string,
  status: ProjectStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('workpulse_projects')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Error updating status:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('workpulse_projects').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting project:', err);
    return { success: false, error: err.message };
  }
}

export async function getDevelopers(): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('workpulse_profiles')
      .select('*')
      .eq('role', 'developer');

    if (error || !data) {
      return [];
    }
    return data;
  } catch (err) {
    console.warn('Error fetching developers:', err);
    return [];
  }
}

export async function getWorkReports(): Promise<WorkReport[]> {
  try {
    const { data, error } = await supabase
      .from('workpulse_work_reports')
      .select(`
        *,
        project:workpulse_projects(name, client_name),
        developer:workpulse_profiles(full_name, avatar_url, email)
      `)
      .order('submitted_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((r: any) => ({
      id: r.id,
      project_id: r.project_id,
      project_name: r.project?.name || 'Project Task',
      client_name: r.project?.client_name || 'Client',
      developer_id: r.developer_id,
      developer_name: r.developer?.full_name || 'Developer',
      developer_email: r.developer?.email,
      developer_avatar: r.developer?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      report_date: r.report_date,
      scheduled_time: r.scheduled_time || '5:00 PM PST',
      submitted_at: new Date(r.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      is_on_time: r.is_on_time,
      tasks_completed: r.tasks_completed,
      time_spent_hours: Number(r.time_spent_hours),
      pr_commit_links: r.pr_commit_links,
      blockers: r.blockers,
      tomorrow_plan: r.tomorrow_plan,
      status: r.status,
    }));
  } catch (err) {
    console.warn('Error fetching work logs:', err);
    return [];
  }
}

export async function submitWorkReport(reportData: {
  project_id: string;
  developer_id: string;
  tasks_completed: string;
  time_spent_hours: number;
  pr_commit_links?: string;
  blockers?: string;
  tomorrow_plan?: string;
  scheduled_time?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const is_on_time = currentHour < 17 || (currentHour === 17 && currentMin <= 15);

    const { data, error } = await supabase
      .from('workpulse_work_reports')
      .insert({
        project_id: reportData.project_id,
        developer_id: reportData.developer_id,
        tasks_completed: reportData.tasks_completed,
        time_spent_hours: reportData.time_spent_hours,
        pr_commit_links: reportData.pr_commit_links,
        blockers: reportData.blockers || 'None',
        tomorrow_plan: reportData.tomorrow_plan,
        scheduled_time: reportData.scheduled_time || '17:00:00',
        submitted_at: now.toISOString(),
        is_on_time: is_on_time,
        status: is_on_time ? 'submitted' : 'delayed',
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error('Error submitting work report:', err);
    return { success: false, error: err.message };
  }
}

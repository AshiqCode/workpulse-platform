import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// DELETE /api/developers/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Developer ID is required' }, { status: 400 });
    }

    // 1. Check if developer is assigned to any active project
    const { data: memberRows, error: memberErr } = await supabase
      .from('workpulse_project_members')
      .select('project_id, workpulse_projects(id, name, client_name)')
      .eq('developer_id', id);

    if (memberErr) {
      console.error('Error checking project membership:', memberErr);
    }

    if (memberRows && memberRows.length > 0) {
      const projectNames = memberRows
        .map((m: any) => m.workpulse_projects?.name || 'Project')
        .filter(Boolean)
        .join(', ');

      return NextResponse.json(
        {
          error: `Cannot delete developer: This developer is currently assigned to project(s): ${projectNames}. Please remove them from all assigned projects first before deleting.`,
          assigned_projects: memberRows,
        },
        { status: 400 }
      );
    }

    // 2. Delete developer's submitted reports or disassociate them
    await supabase.from('workpulse_work_reports').delete().eq('developer_id', id);

    // 3. Delete from workpulse_profiles in Supabase
    const { error: deleteErr } = await supabase
      .from('workpulse_profiles')
      .delete()
      .eq('id', id);

    if (deleteErr) {
      throw deleteErr;
    }

    return NextResponse.json({
      success: true,
      message: 'Developer successfully deleted from workspace.',
    });
  } catch (err: any) {
    console.error('Error deleting developer:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to delete developer' },
      { status: 500 }
    );
  }
}

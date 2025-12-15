import { NextResponse } from 'next/server';
import { createClient, getUser } from '@/lib/supabase/server';

export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // First verify the upload belongs to the user
    const { data: upload, error: fetchError } = await supabase
      .from('uploads')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (fetchError || !upload) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      );
    }

    if (upload.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete the upload
    const { error: deleteError } = await supabase
      .from('uploads')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Upload delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete upload' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Upload API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

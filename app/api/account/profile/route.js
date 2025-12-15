import { NextResponse } from 'next/server';
import { createClient, getUser } from '@/lib/supabase/server';

export async function PATCH(request) {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { full_name, phone } = body;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name,
        phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Profile API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

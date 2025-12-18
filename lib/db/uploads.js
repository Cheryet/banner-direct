import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * Fetch all uploads with optional filters
 */
export async function getUploads({
  status = null,
  userId = null,
  limit = null,
  offset = 0,
  sortBy = 'created_at',
  sortOrder = 'desc',
} = {}) {
  const supabase = await createAdminClient();

  let query = supabase
    .from('uploads')
    .select('*, profile:profiles(id, email, first_name, last_name)', { count: 'exact' });

  if (status) {
    query = query.eq('status', status);
  }

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const ascending = sortOrder === 'asc';
  query = query.order(sortBy, { ascending });

  if (limit) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching uploads:', error);
    return { uploads: [], count: 0 };
  }

  return { uploads: data || [], count: count || 0 };
}

/**
 * Fetch a single upload by ID
 */
export async function getUploadById(id) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('uploads')
    .select('*, profile:profiles(id, email, first_name, last_name)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching upload:', error);
    return null;
  }

  return data;
}

/**
 * Get upload statistics for dashboard
 */
export async function getUploadStats() {
  const supabase = await createAdminClient();

  const { data, error } = await supabase.from('uploads').select('status');

  if (error) {
    console.error('Error fetching upload stats:', error);
    return null;
  }

  const stats = {
    total: data?.length || 0,
    pending: 0,
    processing: 0,
    approved: 0,
    rejected: 0,
  };

  data?.forEach((upload) => {
    if (stats.hasOwnProperty(upload.status)) {
      stats[upload.status]++;
    }
  });

  return stats;
}

/**
 * Get recent uploads for dashboard
 */
export async function getRecentUploads(limit = 5) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('uploads')
    .select('*, profile:profiles(id, email, first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent uploads:', error);
    return [];
  }

  return data || [];
}

/**
 * Get pending uploads that need review
 */
export async function getPendingUploads(limit = 10) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('uploads')
    .select('*, profile:profiles(id, email, first_name, last_name)')
    .in('status', ['pending', 'processing'])
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching pending uploads:', error);
    return [];
  }

  return data || [];
}

/**
 * Update upload status
 */
export async function updateUploadStatus(uploadId, status, adminNotes = null) {
  const supabase = await createAdminClient();

  const updateData = { status };
  if (adminNotes !== null) {
    updateData.admin_notes = adminNotes;
  }

  const { data, error } = await supabase
    .from('uploads')
    .update(updateData)
    .eq('id', uploadId)
    .select()
    .single();

  if (error) {
    console.error('Error updating upload status:', error);
    return null;
  }

  return data;
}

/**
 * Get uploads by user ID
 */
export async function getUploadsByUserId(userId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user uploads:', error);
    return [];
  }

  return data || [];
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

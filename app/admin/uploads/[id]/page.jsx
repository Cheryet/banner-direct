'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  FileImage,
  User,
  Calendar,
  HardDrive,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  File,
  Mail,
  ExternalLink,
} from 'lucide-react';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatFileSize(bytes) {
  if (!bytes) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function getFileIcon(mimeType) {
  if (mimeType?.startsWith('image/')) return ImageIcon;
  if (mimeType?.includes('pdf')) return FileText;
  return File;
}

export default function AdminUploadDetailPage({ params }) {
  const router = useRouter();
  const [upload, setUpload] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [rejectionReason, setRejectionReason] = React.useState('');

  React.useEffect(() => {
    async function fetchUpload() {
      const supabase = createClient();
      const { id } = await params;

      const { data, error } = await supabase
        .from('uploads')
        .select(
          `
          *,
          profiles:user_id (
            id,
            full_name,
            email,
            phone
          )
        `
        )
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Upload not found');
        setIsLoading(false);
        return;
      }

      setUpload(data);
      setRejectionReason(data.rejection_reason || '');
      setIsLoading(false);
    }

    fetchUpload();
  }, [params]);

  const updateStatus = async (newStatus) => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      const { id } = await params;

      const updateData = {
        status: newStatus,
        reviewed_at: new Date().toISOString(),
      };

      if (newStatus === 'rejected' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase.from('uploads').update(updateData).eq('id', id);

      if (error) throw error;

      setUpload({ ...upload, status: newStatus, ...updateData });
      setSuccess(`Upload ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update upload');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error && !upload) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-600">{error}</p>
        <Link href="/admin/uploads" className="mt-4 text-emerald-600 hover:underline">
          Back to Uploads
        </Link>
      </div>
    );
  }

  const FileIcon = getFileIcon(upload.mime_type);
  const isImage = upload.mime_type?.startsWith('image/');

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/uploads"
          className="mb-3 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Uploads
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Review Upload</h1>
            <p className="truncate text-sm text-muted-foreground">{upload.file_name}</p>
          </div>
          <div className="flex gap-2">
            {upload.url && (
              <a
                href={upload.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-emerald-700">
          <CheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - File Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>File Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-gray-50 overflow-hidden">
                {isImage && upload.url ? (
                  <img
                    src={upload.url}
                    alt={upload.file_name}
                    className="w-full h-auto max-h-[600px] object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <FileIcon className="h-24 w-24 text-gray-300" />
                    <p className="mt-4 text-gray-500">Preview not available</p>
                    {upload.url && (
                      <a
                        href={upload.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-emerald-600 hover:underline"
                      >
                        Open file
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Review Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Review Actions</CardTitle>
              <CardDescription>Approve or reject this upload</CardDescription>
            </CardHeader>
            <CardContent>
              {upload.status === 'pending' ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rejection_reason">Rejection Reason (optional)</Label>
                    <textarea
                      id="rejection_reason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="If rejecting, explain why..."
                      rows={3}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => updateStatus('approved')}
                      disabled={isSaving}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Approve
                    </Button>
                    <Button
                      onClick={() => updateStatus('rejected')}
                      disabled={isSaving}
                      variant="outline"
                      className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-lg p-4 ${
                    upload.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {upload.status === 'approved' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    <span className="font-medium">This upload has been {upload.status}</span>
                  </div>
                  {upload.rejection_reason && (
                    <p className="mt-2 text-sm">Reason: {upload.rejection_reason}</p>
                  )}
                  {upload.reviewed_at && (
                    <p className="mt-1 text-sm opacity-75">
                      Reviewed on {formatDate(upload.reviewed_at)}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* File Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                File Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">File Name</p>
                <p className="text-gray-900 break-all">{upload.file_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">File Type</p>
                <p className="text-gray-900">{upload.mime_type || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">File Size</p>
                <p className="text-gray-900">{formatFileSize(upload.file_size)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Uploaded</p>
                <p className="text-gray-900">{formatDate(upload.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    upload.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : upload.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {upload.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                  {upload.status === 'rejected' && <XCircle className="h-3 w-3" />}
                  {upload.status === 'pending' && <Clock className="h-3 w-3" />}
                  {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          {upload.profiles && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Uploaded By
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-700">
                    {(upload.profiles.full_name || upload.profiles.email || 'U')
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {upload.profiles.full_name || 'No name'}
                    </p>
                    {upload.profiles.email && (
                      <p className="text-sm text-gray-500">{upload.profiles.email}</p>
                    )}
                  </div>
                </div>
                {upload.profiles.email && (
                  <a
                    href={`mailto:${upload.profiles.email}`}
                    className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Customer
                  </a>
                )}
                <Link
                  href={`/admin/customers/${upload.profiles.id}`}
                  className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:underline"
                >
                  <User className="h-4 w-4" />
                  View Customer Profile
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

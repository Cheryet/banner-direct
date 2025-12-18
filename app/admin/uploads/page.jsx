import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import Link from 'next/link';
import {
  FileImage,
  Search,
  Eye,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  User,
  Calendar,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  FileText,
  File,
  RefreshCw,
} from 'lucide-react';
import { getUploads, getUploadStats, formatFileSize } from '@/lib/db/uploads';
import { formatDateTime } from '@/lib/format';

export const metadata = {
  title: 'Uploads - Admin',
  description: 'Manage customer file uploads',
};

function getFileIcon(mimeType) {
  if (mimeType?.startsWith('image/')) return ImageIcon;
  if (mimeType?.includes('pdf')) return FileText;
  return File;
}

function getStatusBadge(status) {
  const styles = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending Review' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: RefreshCw, label: 'Processing' },
    approved: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      icon: CheckCircle,
      label: 'Approved',
    },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Rejected' },
  };

  const style = styles[status] || styles.pending;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}
    >
      <Icon className="h-3 w-3" />
      {style.label}
    </span>
  );
}

export default async function AdminUploadsPage({ searchParams }) {
  const params = await searchParams;

  const statusFilter = params?.status || 'all';
  const page = parseInt(params?.page || '1');
  const perPage = 20;
  const offset = (page - 1) * perPage;

  // Fetch uploads and stats using modular utilities
  const [uploadsResult, uploadStats] = await Promise.all([
    getUploads({
      status: statusFilter !== 'all' ? statusFilter : null,
      limit: perPage,
      offset,
      sortBy: 'created_at',
      sortOrder: 'desc',
    }),
    getUploadStats(),
  ]);

  const { uploads, count } = uploadsResult;

  const stats = {
    total: uploadStats?.total || 0,
    pending: uploadStats?.pending || 0,
    processing: uploadStats?.processing || 0,
    approved: uploadStats?.approved || 0,
    rejected: uploadStats?.rejected || 0,
  };

  const totalPages = Math.ceil((count || 0) / perPage);

  const statusFilters = [
    { value: 'all', label: 'All Uploads', count: stats.total },
    { value: 'pending', label: 'Pending', count: stats.pending },
    { value: 'approved', label: 'Approved', count: stats.approved },
    { value: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

  return (
    <div className="min-w-0">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Uploads</h1>
        <p className="text-sm text-muted-foreground">Review and manage customer artwork uploads</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Uploads</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileImage className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Storage Used</p>
                <p className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</p>
              </div>
              <HardDrive className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <Link
            key={filter.value}
            href={`/admin/uploads${filter.value !== 'all' ? `?status=${filter.value}` : ''}`}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === filter.value
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                statusFilter === filter.value
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {filter.count}
            </span>
          </Link>
        ))}
      </div>

      {/* Uploads Grid */}
      {!uploads || uploads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileImage className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No uploads found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter !== 'all'
                ? `No ${statusFilter} uploads at the moment.`
                : 'Customer uploads will appear here.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {uploads.map((upload) => {
              const FileIcon = getFileIcon(upload.mime_type);
              return (
                <Card key={upload.id} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100 relative">
                    {upload.mime_type?.startsWith('image/') && upload.url ? (
                      <img
                        src={upload.url}
                        alt={upload.file_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FileIcon className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">{getStatusBadge(upload.status)}</div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="truncate font-medium text-gray-900" title={upload.file_name}>
                      {upload.file_name}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate">
                          {upload.profile?.first_name || upload.profile?.last_name
                            ? `${upload.profile?.first_name || ''} ${upload.profile?.last_name || ''}`.trim()
                            : upload.profile?.email || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDateTime(upload.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <HardDrive className="h-3.5 w-3.5" />
                        <span>{formatFileSize(upload.file_size)}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/admin/uploads/${upload.id}`}
                        className="flex-1 rounded-lg border px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <Eye className="mr-1 inline h-4 w-4" />
                        Review
                      </Link>
                      {upload.url && (
                        <a
                          href={upload.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {offset + 1} to {Math.min(offset + perPage, count)} of {count} uploads
              </p>
              <div className="flex gap-2">
                <Link
                  href={`/admin/uploads?page=${page - 1}${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`}
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium ${
                    page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
                <Link
                  href={`/admin/uploads?page=${page + 1}${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`}
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium ${
                    page >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50'
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

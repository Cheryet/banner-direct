'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import {
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  FileImage,
  Plus,
  ArrowRight,
} from 'lucide-react';

export function SavedDesignsSection({ uploads }) {
  const [deletingId, setDeletingId] = React.useState(null);

  const handleDelete = async (uploadId) => {
    if (!confirm('Are you sure you want to delete this design?')) return;

    setDeletingId(uploadId);
    try {
      const response = await fetch(`/api/account/uploads/${uploadId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      window.location.reload();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete design. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      approved: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-red-100 text-red-700',
    };

    return (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || styles.pending}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <ImageIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Saved Designs</CardTitle>
              <CardDescription>Your uploaded artwork and designs</CardDescription>
            </div>
          </div>
          <LinkButton href="/products" size="sm" variant="outline">
            <Plus className="mr-1 h-4 w-4" />
            New Design
          </LinkButton>
        </div>
      </CardHeader>
      <CardContent>
        {uploads.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 text-center">
            <FileImage className="mb-3 h-12 w-12 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No designs yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload your artwork when you create a banner order.
            </p>
            <LinkButton href="/products" className="mt-4">
              Browse Banners
              <ArrowRight className="ml-2 h-4 w-4" />
            </LinkButton>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="group relative overflow-hidden rounded-lg border bg-gray-50 transition-all hover:border-emerald-300 hover:shadow-md"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100">
                  {upload.file_type?.startsWith('image/') ? (
                    <img
                      src={upload.file_url}
                      alt={upload.file_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FileImage className="h-12 w-12 text-gray-300" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute left-2 top-2">{getStatusBadge(upload.status)}</div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <a
                      href={upload.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-white p-2 text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                    <button
                      onClick={() => handleDelete(upload.id)}
                      disabled={deletingId === upload.id}
                      className="rounded-lg bg-white p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="truncate font-medium text-gray-900" title={upload.file_name}>
                    {upload.file_name}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(upload.file_size)}</span>
                    <span>{formatDate(upload.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {uploads.length > 0 && (
          <div className="mt-4 text-center">
            <LinkButton href="/account" variant="ghost" size="sm">
              View All Designs
              <ArrowRight className="ml-1 h-4 w-4" />
            </LinkButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

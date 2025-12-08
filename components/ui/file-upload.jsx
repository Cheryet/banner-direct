'use client';

import * as React from 'react';
import { Upload, X, FileImage, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/svg+xml': ['.svg'],
  'application/pdf': ['.pdf'],
  'image/tiff': ['.tiff', '.tif'],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

function FileUpload({
  className,
  onFilesChange,
  maxFiles = 5,
  accept = ACCEPTED_FILE_TYPES,
  maxSize = MAX_FILE_SIZE,
  disabled = false,
  ...props
}) {
  const [files, setFiles] = React.useState([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState(null);
  const inputRef = React.useRef(null);

  const handleDragOver = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = React.useCallback((file) => {
    const acceptedTypes = Object.keys(accept);
    if (!acceptedTypes.some((type) => file.type === type)) {
      return 'File type not supported. Please upload JPG, PNG, SVG, PDF, or TIFF files.';
    }
    if (file.size > maxSize) {
      return `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit.`;
    }
    return null;
  }, [accept, maxSize]);

  const processFiles = React.useCallback((newFiles) => {
    setError(null);
    const validFiles = [];

    for (const file of newFiles) {
      if (files.length + validFiles.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed.`);
        break;
      }
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }
      validFiles.push({
        file,
        id: `${file.name}-${Date.now()}`,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      });
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles.map((f) => f.file));
    }
  }, [files, maxFiles, validateFile, onFilesChange]);

  const handleDrop = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [disabled, processFiles]);

  const handleFileSelect = React.useCallback((e) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
    if (inputRef.current) inputRef.current.value = '';
  }, [processFiles]);

  const removeFile = React.useCallback((id) => {
    const fileToRemove = files.find((f) => f.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    const updatedFiles = files.filter((f) => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles.map((f) => f.file));
    setError(null);
  }, [files, onFilesChange]);

  React.useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, []);

  const getFileIcon = (file) => {
    if (file.file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <FileImage className="h-8 w-8 text-primary" />;
  };

  return (
    <div className={cn('space-y-4', className)} {...props}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload files by dropping them here or clicking to browse"
        aria-disabled={disabled}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          'relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
          disabled && 'cursor-not-allowed opacity-50',
          error && 'border-destructive'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={Object.values(accept).flat().join(',')}
          onChange={handleFileSelect}
          disabled={disabled}
          className="sr-only"
          aria-describedby={error ? 'file-upload-error' : undefined}
        />
        <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
        <p className="mb-2 text-sm font-medium">
          {isDragging ? 'Drop files here' : 'Drag & drop your artwork here'}
        </p>
        <p className="text-xs text-muted-foreground">
          or click to browse • JPG, PNG, SVG, PDF, TIFF up to 50MB
        </p>
      </div>

      {error && (
        <p id="file-upload-error" className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Uploaded files ({files.length}/{maxFiles})
          </p>
          <ul className="grid gap-2 sm:grid-cols-2" role="list">
            {files.map((fileItem) => (
              <li
                key={fileItem.id}
                className="flex items-center gap-3 rounded-md border bg-muted/30 p-3"
              >
                {fileItem.preview ? (
                  <img
                    src={fileItem.preview}
                    alt={`Preview of ${fileItem.file.name}`}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  getFileIcon(fileItem)
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{fileItem.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(fileItem.id);
                  }}
                  aria-label={`Remove ${fileItem.file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export { FileUpload };

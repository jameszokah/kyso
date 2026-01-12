'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Download, Loader2, Plus, Search, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui-test/button';
import { Input } from '@/components/ui-test/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useStore from '@/store/store';

const SUPPORTED_EXTENSIONS = [
  'pdf',
  'csv',
  'doc',
  'docx',
  'txt',
  'md',
  'xlsx',
  'xls',
  'html',
  'htm',
  'pptx',
  'ppt',
  'json',
  'yaml',
  'yml',
  'mp3',
  'm4a',
  'wav',
  'webm',
  'ogg',
  'flac',
  'aac',
  'opus',
  'mp4',
  'mov',
  'avi',
  'mkv',
] as const;

const ACCEPT_ATTR = SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`).join(',');

export function Files() {
  const files = useStore((state) => state.files);
  const addFile = useStore((state) => state.addFile);
  const removeFile = useStore((state) => state.removeFile);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = useMemo(() => {
    if (!search) return files;
    const q = search.toLowerCase();
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, search]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list || list.length === 0) return;

    try {
      setUploading(true);
      setUploadError(null);

      const filesToUpload = Array.from(list);
      const unsupported: string[] = [];

      for (const file of filesToUpload) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        if (!SUPPORTED_EXTENSIONS.includes(ext as (typeof SUPPORTED_EXTENSIONS)[number])) {
          unsupported.push(file.name);
          continue;
        }

        // Add file to store (in real app, would upload to server)
        addFile({
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }

      if (unsupported.length) {
        setUploadError(`Unsupported file type: ${unsupported.join(', ')}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = useCallback(
    (fileId: string) => {
      removeFile(fileId);
    },
    [removeFile],
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(2);
    return `${mm}/${dd}/${yy}`;
  };

  return (
    <div className="flex h-full flex-col gap-2">
      {/* Search and Upload */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border bg-muted/30 px-2 py-1.5">
          <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" strokeWidth={2} />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-auto flex-1 border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
          accept={ACCEPT_ATTR}
          multiple
        />
        <Button onClick={handleUploadClick} disabled={uploading} size="sm">
          {uploading ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="mr-1.5 h-3.5 w-3.5" />
          )}
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>

      {/* Error message */}
      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}

      {/* Files List */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No files uploaded yet
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">No files found matching "{search}"</div>
        ) : (
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Name</TableHead>
                <TableHead className="w-[15%]">Size</TableHead>
                <TableHead className="w-[20%]">Uploaded</TableHead>
                <TableHead className="w-[15%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="truncate font-medium">{file.name}</TableCell>
                  <TableCell className="text-muted-foreground">{formatFileSize(file.size)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(file.uploadedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(file.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

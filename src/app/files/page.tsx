'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import FileGrid from '@/components/FileGrid';

interface FileItem {
  _id: string;
  filename: string;
  contentType: string;
  uploadDate: string;
  size: number;
  url: string;
  ocrText?: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Temporary user ID for demo purposes
  const userId = 'demo-user';

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/files?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch files');
      const data = await response.json();
      setFiles(data);
    } catch (err) {
      setError('Failed to load files');
      console.error(err);
    }
  };

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    setError(null);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
      }

      fetchFiles();
    } catch (err) {
      setError('Failed to upload one or more files');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files?fileId=${fileId}&userId=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete file');
      
      setFiles(files.filter(file => file._id !== fileId));
    } catch (err) {
      setError('Failed to delete file');
      console.error(err);
    }
  };

  const handleOcrComplete = async (fileId: string, ocrText: string) => {
    try {
      const response = await fetch(`/api/files/ocr?userId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId, ocrText }),
      });

      if (!response.ok) throw new Error('Failed to update OCR text');

      const updatedFile = await response.json();
      setFiles(files.map(file => 
        file._id === fileId ? { ...file, ocrText: updatedFile.ocrText } : file
      ));
    } catch (err) {
      setError('Failed to save extracted text');
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Health Documents
        </h1>
        <FileUpload onUpload={handleUpload} isUploading={isUploading} />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Your Files
        </h2>
        <FileGrid 
          files={files} 
          onDelete={handleDelete}
          onOcrComplete={handleOcrComplete}
        />
      </div>
    </div>
  );
} 
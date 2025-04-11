import { useState } from 'react';
import { DocumentIcon, PhotoIcon, XMarkIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import OcrProcessor from './OcrProcessor';
import HealthDataDisplay from './HealthDataDisplay';
import { analyzeHealthData } from '@/lib/healthAnalyzer';
import type { HealthData } from '@/types/health';

interface FileItem {
  _id: string;
  filename: string;
  contentType: string;
  uploadDate: string;
  size: number;
  url: string;
  ocrText?: string;
  healthData?: HealthData;
}

interface FileGridProps {
  files: FileItem[];
  onDelete?: (fileId: string) => Promise<void>;
  onOcrComplete?: (fileId: string, text: string) => Promise<void>;
  onHealthDataUpdate?: (fileId: string, healthData: HealthData) => Promise<void>;
}

export default function FileGrid({ files, onDelete, onOcrComplete, onHealthDataUpdate }: FileGridProps) {
  const [processingOcr, setProcessingOcr] = useState<{ [key: string]: boolean }>({});
  const [analyzingHealth, setAnalyzingHealth] = useState<{ [key: string]: boolean }>({});
  const [expandedText, setExpandedText] = useState<{ [key: string]: boolean }>({});
  const [expandedHealth, setExpandedHealth] = useState<{ [key: string]: boolean }>({});
  const [ocrError, setOcrError] = useState<{ [key: string]: string }>({});
  const [healthError, setHealthError] = useState<{ [key: string]: string }>({});

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return <PhotoIcon className="h-8 w-8 text-blue-500" />;
    }
    return <DocumentIcon className="h-8 w-8 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleOcrComplete = async (fileId: string, text: string) => {
    setProcessingOcr(prev => ({ ...prev, [fileId]: false }));
    if (onOcrComplete) {
      await onOcrComplete(fileId, text);
      
      // Automatically start health data analysis after OCR
      handleAnalyzeHealth(fileId, text);
    }
  };

  const handleAnalyzeHealth = async (fileId: string, text: string) => {
    if (!text || analyzingHealth[fileId]) return;

    setAnalyzingHealth(prev => ({ ...prev, [fileId]: true }));
    setHealthError(prev => ({ ...prev, [fileId]: '' }));

    try {
      const healthData = await analyzeHealthData(text);
      if (onHealthDataUpdate) {
        await onHealthDataUpdate(fileId, healthData);
      }
    } catch (err) {
      setHealthError(prev => ({
        ...prev,
        [fileId]: err instanceof Error ? err.message : 'Failed to analyze health data'
      }));
    } finally {
      setAnalyzingHealth(prev => ({ ...prev, [fileId]: false }));
    }
  };

  const handleOcrError = (fileId: string, error: string) => {
    setProcessingOcr(prev => ({ ...prev, [fileId]: false }));
    setOcrError(prev => ({ ...prev, [fileId]: error }));
  };

  const toggleTextExpansion = (fileId: string) => {
    setExpandedText(prev => ({ ...prev, [fileId]: !prev[fileId] }));
  };

  const toggleHealthExpansion = (fileId: string) => {
    setExpandedHealth(prev => ({ ...prev, [fileId]: !prev[fileId] }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <div
          key={file._id}
          className="relative group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(file.contentType)}
              <div>
                <h3 className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                  {file.filename}
                </h3>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(file.uploadDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(file._id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-100 transition-opacity"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
          
          {file.contentType.startsWith('image/') && (
            <>
              <div className="mt-2">
                <img
                  src={file.url}
                  alt={file.filename}
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
              {!file.ocrText && !processingOcr[file._id] && onOcrComplete && (
                <button
                  onClick={() => setProcessingOcr(prev => ({ ...prev, [file._id]: true }))}
                  className="mt-2 flex items-center text-xs text-blue-600 hover:text-blue-800"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  Extract Text
                </button>
              )}
              {processingOcr[file._id] && (
                <OcrProcessor
                  file={file.url}
                  onComplete={(text) => handleOcrComplete(file._id, text)}
                  onError={(error) => handleOcrError(file._id, error)}
                />
              )}
            </>
          )}
          
          {file.ocrText && (
            <>
              <div className="mt-2">
                <button
                  onClick={() => toggleTextExpansion(file._id)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  {expandedText[file._id] ? 'Hide Text' : 'Show Extracted Text'}
                </button>
                {expandedText[file._id] && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-600 whitespace-pre-wrap">
                      {file.ocrText}
                    </p>
                  </div>
                )}
              </div>

              {!file.healthData && !analyzingHealth[file._id] && (
                <button
                  onClick={() => handleAnalyzeHealth(file._id, file.ocrText!)}
                  className="mt-2 flex items-center text-xs text-blue-600 hover:text-blue-800"
                >
                  <ChartBarIcon className="h-4 w-4 mr-1" />
                  Analyze Health Data
                </button>
              )}

              {analyzingHealth[file._id] && (
                <div className="mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <ChartBarIcon className="h-4 w-4 mr-1 animate-pulse" />
                    Analyzing health data...
                  </div>
                </div>
              )}

              {file.healthData && (
                <div className="mt-2">
                  <button
                    onClick={() => toggleHealthExpansion(file._id)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <ChartBarIcon className="h-4 w-4 mr-1" />
                    {expandedHealth[file._id] ? 'Hide Analysis' : 'Show Health Analysis'}
                  </button>
                  {expandedHealth[file._id] && (
                    <div className="mt-2">
                      <HealthDataDisplay data={file.healthData} />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {ocrError[file._id] && (
            <p className="mt-2 text-xs text-red-600">
              {ocrError[file._id]}
            </p>
          )}

          {healthError[file._id] && (
            <p className="mt-2 text-xs text-red-600">
              {healthError[file._id]}
            </p>
          )}
          
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 block"
          >
            View File
          </a>
        </div>
      ))}
    </div>
  );
} 
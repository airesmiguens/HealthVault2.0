import { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';

interface OcrProcessorProps {
  file: File | string;
  onComplete: (text: string) => void;
  onError: (error: string) => void;
}

export default function OcrProcessor({ file, onComplete, onError }: OcrProcessorProps) {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const processImage = async () => {
      try {
        const worker = await createWorker({
          logger: message => {
            if (message.status === 'recognizing text') {
              setProgress(parseInt(message.progress) * 100);
            }
          },
        });

        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        let result;
        if (typeof file === 'string') {
          // If file is a URL
          result = await worker.recognize(file);
        } else {
          // If file is a File object
          const imageUrl = URL.createObjectURL(file);
          result = await worker.recognize(imageUrl);
          URL.revokeObjectURL(imageUrl);
        }

        await worker.terminate();
        onComplete(result.data.text);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Failed to process image');
      }
    };

    if (file) {
      processImage();
    }
  }, [file, onComplete, onError]);

  return progress > 0 && progress < 100 ? (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">Processing text... {progress.toFixed(0)}%</p>
    </div>
  ) : null;
} 
import { CloudUpload } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react';

interface ImageUploadTabProps {
  onInsert: (url: string) => void;
  onClose?: () => void;
}

function ImageUploadTab({ onInsert, onClose }: ImageUploadTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFile = (file?: File) => {
    setError('');
    setPreviewUrl('');
    setFileName('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    setFileName(file.name);
    setIsReading(true);

    const reader = new FileReader();

    reader.onload = () => {
      setPreviewUrl(typeof reader.result === 'string' ? reader.result : '');
      setIsReading(false);
    };
    reader.onerror = () => {
      setError('Failed to read the file. Please try again.');
      setIsReading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounterRef.current += 1;
    setIsDragActive(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      setIsDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragActive(false);
    handleFile(event.dataTransfer.files?.[0]);
    event.dataTransfer.clearData();
  };

  const handleClear = () => {
    setError('');
    setPreviewUrl('');
    setFileName('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInsert = () => {
    if (!previewUrl) return;
    onInsert(previewUrl);
    onClose?.();
    handleClear();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label
          htmlFor="image-upload"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Upload image
        </label>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center text-sm transition-colors cursor-pointer ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300'
              : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-500 dark:border-gray-700 dark:text-gray-400'
          }`}
        >
          <CloudUpload size={22} />
          <span className="font-medium">Drop Image (or click)</span>
        </div>
        <input
          id="image-upload"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
        />
        {fileName && <p className="text-xs text-gray-500">Selected: {fileName}</p>}
        {error && (
          <p className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleInsert}
          disabled={!previewUrl || isReading}
          className={`rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors ${
            previewUrl && !isReading
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          {isReading ? 'Loading...' : 'Insert Image'}
        </button>
      </div>
    </div>
  );
}

export default ImageUploadTab;

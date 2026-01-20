import { useMemo, useState, type FormEvent } from 'react';

interface ImageURLTabProps {
  onInsert: (url: string) => void;
  onClose?: () => void;
}

function isValidUrl(value: string) {
  if (!value) return false;
  if (value.startsWith('data:') || value.startsWith('blob:')) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'data:'
    );
  } catch {
    return false;
  }
}

function ImageURLTab({ onInsert, onClose }: ImageURLTabProps) {
  const [url, setUrl] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const trimmedUrl = url.trim();
  const isUrlValid = useMemo(() => isValidUrl(trimmedUrl), [trimmedUrl]);
  const canInsert = isUrlValid && !previewError;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canInsert) return;

    onInsert(trimmedUrl);
    onClose?.();
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="image-url" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Image URL
        </label>
        <input
          id="image-url"
          type="url"
          inputMode="url"
          placeholder="https://example.com/image.png"
          autoComplete="url"
          value={url}
          onChange={event => {
            setUrl(event.target.value);
            setPreviewError(false);
          }}
          className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
            previewError
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:focus:border-blue-400'
          } bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
        />
        {previewError ? (
          <p className="text-xs text-red-500" role="alert">
            Unable to load image preview. Check the URL and try again.
          </p>
        ) : (
          <p className="text-xs text-gray-500">Paste a direct image URL or data URL.</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setUrl('')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={!canInsert}
          className={`rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors ${
            canInsert
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          Insert Image
        </button>
      </div>
    </form>
  );
}

export default ImageURLTab;

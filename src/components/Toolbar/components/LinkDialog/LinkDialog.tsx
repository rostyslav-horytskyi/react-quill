import { useState, useEffect, useId, useCallback } from 'react';
import { X, ExternalLink, Trash2 } from 'lucide-react';
import OutsideClickHandler from 'react-outside-click-handler';

interface LinkDialogProps {
  onClose: () => void;
  onInsert: (url: string) => void;
  onRemove: () => void;
  currentUrl?: string;
  selectedText?: string;
}

function isValidUrl(string: string): boolean {
  // Allow relative URLs starting with / or #
  if (string.startsWith('/') || string.startsWith('#')) {
    return true;
  }
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'mailto:';
  } catch {
    // Try adding https:// prefix
    try {
      new URL(`https://${string}`);
      return true;
    } catch {
      return false;
    }
  }
}

function normalizeUrl(url: string): string {
  // Don't modify relative URLs, anchors, or mailto
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('mailto:')) {
    return url;
  }
  // Add https:// if no protocol
  if (!url.match(/^https?:\/\//)) {
    return `https://${url}`;
  }
  return url;
}

function LinkDialog({
  onClose,
  onInsert,
  onRemove,
  currentUrl = '',
  selectedText = '',
}: LinkDialogProps) {
  const titleId = useId();
  const [url, setUrl] = useState(currentUrl);
  const [error, setError] = useState('');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedUrl = url.trim();
      if (!trimmedUrl) {
        setError('Please enter a URL');
        return;
      }

      if (!isValidUrl(trimmedUrl)) {
        setError('Please enter a valid URL');
        return;
      }

      onInsert(normalizeUrl(trimmedUrl));
      onClose();
    },
    [url, onInsert, onClose]
  );

  const handleRemove = useCallback(() => {
    onRemove();
    onClose();
  }, [onRemove, onClose]);

  const isEditing = !!currentUrl;

  return (
    <OutsideClickHandler onOutsideClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-[320px] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 id={titleId} className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? 'Edit link' : 'Insert link'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Close link dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected text preview */}
        {selectedText && (
          <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
            <span className="text-xs text-gray-500 dark:text-gray-400">Selected text:</span>
            <p className="mt-0.5 truncate text-sm text-gray-700 dark:text-gray-300">
              {selectedText}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label
              htmlFor="link-url"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              URL
            </label>
            <div className="relative mt-1">
              <input
                id="link-url"
                type="text"
                value={url}
                onChange={e => {
                  setUrl(e.target.value);
                  setError('');
                }}
                placeholder="https://example.com"
                className={`w-full rounded-lg border px-3 py-2 pr-8 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
                  error
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                autoFocus
              />
              <ExternalLink
                size={16}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between">
            {isEditing ? (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 size={16} />
                Remove link
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!url.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isEditing ? 'Update' : 'Insert'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </OutsideClickHandler>
  );
}

export default LinkDialog;

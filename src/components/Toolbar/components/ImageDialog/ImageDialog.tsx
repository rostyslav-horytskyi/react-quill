import { CloudUpload, Link, X } from 'lucide-react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useEffect, useId } from 'react';
import Tabs from '../../../Tabs/Tabs';
import ImageUploadTab from './components/ImageUploadTab/ImageUploadTab.tsx';
import ImageURLTab from './components/ImageURLTab/ImageURLTab.tsx';

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}

const tabs = [
  { id: 'url', label: <Link size={16} />, ariaLabel: 'Image URL' },
  { id: 'upload', label: <CloudUpload size={16} />, ariaLabel: 'Upload Image' },
];

function ImageDialog({ isOpen, onClose, onInsert }: ImageDialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <OutsideClickHandler onOutsideClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-[300px] max-w-md rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="flex items-center justify-between">
          <h2 id={titleId} className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Insert image
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Close image dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">
          <Tabs tabs={tabs}>
            <ImageURLTab onInsert={onInsert} onClose={onClose} />
            <ImageUploadTab onInsert={onInsert} onClose={onClose} />
          </Tabs>
        </div>
      </div>
    </OutsideClickHandler>
  );
}

export default ImageDialog;

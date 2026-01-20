import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useQuill } from '../../../../context';
import { FONT_OPTIONS, type FontValue } from '../../../../quill/formats/font';

const FONT_STYLES: Record<string, string> = {
  arial: 'Arial, sans-serif',
  'times-new-roman': '"Times New Roman", Times, serif',
  georgia: 'Georgia, serif',
  verdana: 'Verdana, sans-serif',
  'courier-new': '"Courier New", Courier, monospace',
  'trebuchet-ms': '"Trebuchet MS", sans-serif',
  garamond: 'Garamond, serif',
  palatino: '"Palatino Linotype", Palatino, serif',
  tahoma: 'Tahoma, sans-serif',
  impact: 'Impact, sans-serif',
};

export default function FontDropdown() {
  const { quill, formats, refreshFormats } = useQuill();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentValue = (formats.font as FontValue) ?? false;
  const currentOption = FONT_OPTIONS.find(opt => opt.value === currentValue) ?? FONT_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: FontValue) => {
    if (!quill) return;
    quill.format('font', value);
    refreshFormats();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef} data-testid="font-dropdown">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium min-w-[120px]"
        style={{
          fontFamily: currentOption.value ? FONT_STYLES[currentOption.value] : 'inherit',
        }}
      >
        <span className="truncate">{currentOption.label}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          data-testid="font-dropdown-menu"
          className="absolute top-full left-0 mt-1 min-w-[160px] max-h-[300px] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
        >
          {FONT_OPTIONS.map(option => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => handleSelect(option.value)}
              style={{
                fontFamily: option.value ? FONT_STYLES[option.value] : 'inherit',
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentValue === option.value
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

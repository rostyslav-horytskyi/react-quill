import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

// Color palette - common colors for text and highlight
const TEXT_COLORS = [
  // Row 1 - Grays
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#b7b7b7',
  '#cccccc',
  '#d9d9d9',
  '#efefef',
  '#f3f3f3',
  '#ffffff',
  // Row 2 - Colors
  '#980000',
  '#ff0000',
  '#ff9900',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#4a86e8',
  '#0000ff',
  '#9900ff',
  '#ff00ff',
  // Row 3 - Light colors
  '#e6b8af',
  '#f4cccc',
  '#fce5cd',
  '#fff2cc',
  '#d9ead3',
  '#d0e0e3',
  '#c9daf8',
  '#cfe2f3',
  '#d9d2e9',
  '#ead1dc',
  // Row 4 - Medium colors
  '#dd7e6b',
  '#ea9999',
  '#f9cb9c',
  '#ffe599',
  '#b6d7a8',
  '#a2c4c9',
  '#a4c2f4',
  '#9fc5e8',
  '#b4a7d6',
  '#d5a6bd',
  // Row 5 - Dark colors
  '#cc4125',
  '#e06666',
  '#f6b26b',
  '#ffd966',
  '#93c47d',
  '#76a5af',
  '#6d9eeb',
  '#6fa8dc',
  '#8e7cc3',
  '#c27ba0',
  // Row 6 - Darker colors
  '#a61c00',
  '#cc0000',
  '#e69138',
  '#f1c232',
  '#6aa84f',
  '#45818e',
  '#3c78d8',
  '#3d85c6',
  '#674ea7',
  '#a64d79',
  // Row 7 - Darkest colors
  '#85200c',
  '#990000',
  '#b45f06',
  '#bf9000',
  '#38761d',
  '#134f5c',
  '#1155cc',
  '#0b5394',
  '#351c75',
  '#741b47',
];

const HIGHLIGHT_COLORS = [
  // Transparent (no highlight)
  'transparent',
  // Light highlights
  '#fef08a',
  '#fde047',
  '#facc15', // Yellows
  '#bbf7d0',
  '#86efac',
  '#4ade80', // Greens
  '#bfdbfe',
  '#93c5fd',
  '#60a5fa', // Blues
  '#fecaca',
  '#fca5a5',
  '#f87171', // Reds
  '#e9d5ff',
  '#d8b4fe',
  '#c084fc', // Purples
  '#fed7aa',
  '#fdba74',
  '#fb923c', // Oranges
  '#fce7f3',
  '#fbcfe8',
  '#f9a8d4', // Pinks
  '#e5e7eb',
  '#d1d5db',
  '#9ca3af', // Grays
];

interface ColorPickerProps {
  icon: ReactNode;
  title: string;
  currentColor: string | undefined;
  onColorSelect: (color: string | false) => void;
  colors: string[];
  showColorBar?: boolean;
}

export default function ColorPicker({
  icon,
  title,
  currentColor,
  onColorSelect,
  colors,
  showColorBar = true,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorClick = useCallback(
    (color: string) => {
      if (color === 'transparent') {
        onColorSelect(false);
      } else {
        onColorSelect(color);
      }
      setIsOpen(false);
    },
    [onColorSelect]
  );

  const handleClearColor = useCallback(() => {
    onColorSelect(false);
    setIsOpen(false);
  }, [onColorSelect]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={title}
        className={`relative p-2 rounded-lg transition-all duration-150 active:scale-95 ${
          currentColor
            ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
      >
        <span className="flex items-center">
          {icon}
          <ChevronDown size={10} className="ml-0.5" />
        </span>
        {showColorBar && (
          <span
            className="absolute left-1/2 -translate-x-1/2 w-4 h-1 rounded-sm"
            style={{
              backgroundColor: currentColor || '#999999',
              bottom: '-1px',
            }}
          />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
          style={{ width: '220px' }}
        >
          {/* Clear color button */}
          <button
            type="button"
            onClick={handleClearColor}
            className="w-full text-left px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded mb-2"
          >
            Clear color
          </button>

          {/* Color grid */}
          <div className="grid grid-cols-10 gap-1">
            {colors.map((color, index) => (
              <button
                key={`${color}-${index}`}
                type="button"
                onClick={() => handleColorClick(color)}
                title={color}
                className={`w-5 h-5 rounded border transition-transform hover:scale-110 ${
                  currentColor === color
                    ? 'ring-2 ring-blue-500 ring-offset-1'
                    : 'border-gray-300 dark:border-gray-600'
                } ${color === 'transparent' ? 'bg-white dark:bg-gray-700' : ''}`}
                style={{
                  backgroundColor: color === 'transparent' ? undefined : color,
                  backgroundImage:
                    color === 'transparent'
                      ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
                      : undefined,
                  backgroundSize: color === 'transparent' ? '8px 8px' : undefined,
                  backgroundPosition: color === 'transparent' ? '0 0, 4px 4px' : undefined,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { TEXT_COLORS, HIGHLIGHT_COLORS };

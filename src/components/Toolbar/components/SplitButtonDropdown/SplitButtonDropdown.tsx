import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SplitDropdownOption<T> {
  value: T;
  label?: string;
}

interface SplitButtonDropdownProps<T> {
  icon: React.ReactNode;
  options: SplitDropdownOption<T>[];
  value?: T;
  onButtonClick: () => void;
  onOptionSelect: (value: T) => void;
  isActive?: boolean;
  'data-testid'?: string;
}

export default function SplitButtonDropdown<T>({
  icon,
  options,
  value,
  onButtonClick,
  onOptionSelect,
  isActive,
  'data-testid': testId,
}: SplitButtonDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  // TODO: replace later with react-outside-click-handler library - https://github.com/airbnb/react-outside-click-handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SplitDropdownOption<T>) => {
    onOptionSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div className={'relative flex'} ref={dropdownRef} data-testid={testId}>
      {/* Trigger button */}
      <button
        type={'button'}
        onClick={onButtonClick}
        className={`p-2 rounded-l-lg transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isActive
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        {icon}
      </button>

      {/* Dropdown arrow */}
      <button
        type={'button'}
        onClick={() => setIsOpen(!isOpen)}
        className={`px-1 rounded-r-lg border-l border-gray-200 dark:border-gray-600 transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isActive
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={
            'absolute top-full left-0 mt-1 min-w-[120px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden'
          }
        >
          {options.map(option => (
            <button
              key={option.label}
              type={'button'}
              onClick={() => handleSelect(option)}
              className={`w-full px-3 py-2 text-sm text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                value === option.value
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

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import OutsideClickHandler from 'react-outside-click-handler';

export interface DropdownOption<T> {
  value: T;
  icon: React.ReactNode;
  label?: string;
}

interface ToolbarDropdownProps<T> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  defaultValue?: T;
  'data-testid'?: string;
}

export default function ToolbarDropdown<T>({
  options,
  value,
  onChange,
  defaultValue,
  'data-testid': testId,
}: ToolbarDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultOption =
    defaultValue !== undefined
      ? options.find(opt => opt.value === defaultValue)
      : options[options.length - 1];

  const currentOption = options.find(opt => opt.value === value) || defaultOption;

  const handleSelect = (option: DropdownOption<T>) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpen(false)} display="contents">
      <div className="relative" data-testid={testId}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium min-w-[60px]"
        >
          <span className="flex items-center gap-2">{currentOption?.icon}</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div
            data-testid={'toolbar-dropdown-menu'}
            className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            {options.map((option, index) => (
              <button
                key={String(option.value) || index}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  currentOption?.value === option.value
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {option.icon}
              </button>
            ))}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
}

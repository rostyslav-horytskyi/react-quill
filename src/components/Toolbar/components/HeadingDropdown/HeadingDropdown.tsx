import React, { useState, useRef, useEffect } from 'react';
import { Heading1, Heading2, Heading3, Heading4, Type, ChevronDown } from 'lucide-react';

interface HeadingOption {
  value: number | false;
  icon: React.ReactNode;
}

interface HeadingDropdownProps {
  onSelect: (level: number | false) => void;
  activeHeader?: number | false;
}

function HeadingDropdown({ onSelect, activeHeader }: HeadingDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: HeadingOption[] = [
    { value: 1, icon: <Heading1 size={18} /> },
    { value: 2, icon: <Heading2 size={18} /> },
    { value: 3, icon: <Heading3 size={18} /> },
    { value: 4, icon: <Heading4 size={18} /> },
    { value: false, icon: <Type size={18} /> },
  ];

  const defaultOption = options[options.length - 1];
  const currentOption = options.find(opt => opt.value === activeHeader) || defaultOption;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: HeadingOption) => {
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium min-w-[60px]"
      >
        <span className="flex items-center gap-2">{currentOption.icon}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
          {options.map(option => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentOption.value === option.value
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
  );
}

export default HeadingDropdown;

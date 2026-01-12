import { useCallback, useState, useRef, useEffect } from 'react';
import type Quill from 'quill';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Type,
  Palette,
  Highlighter,
  RemoveFormatting,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  ChevronDown,
} from 'lucide-react';

interface ToolbarProps {
  quill: Quill | null;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  isActive?: boolean;
}

function ToolbarButton({ icon, title, onClick, isActive }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`
        p-2 rounded-lg transition-all duration-150
        hover:bg-gray-100 dark:hover:bg-gray-700
        active:scale-95
        ${isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}
      `}
    >
      {icon}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />;
}

interface HeadingOption {
  value: number | false;
  icon: React.ReactNode;
}

interface HeadingDropdownProps {
  onSelect: (level: number | false) => void;
}

function HeadingDropdown({ onSelect }: HeadingDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<HeadingOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: HeadingOption[] = [
    { value: 1, icon: <Heading1 size={18} /> },
    { value: 2, icon: <Heading2 size={18} /> },
    { value: 3, icon: <Heading3 size={18} /> },
    { value: 4, icon: <Heading4 size={18} /> },
    { value: false, icon: <Type size={18} /> },
  ];

  const defaultOption = options[options.length - 1];
  const currentOption = selected || defaultOption;

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
    setSelected(option);
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

export default function Toolbar({ quill }: ToolbarProps) {
  const formatText = useCallback(
    (format: string, value: unknown = true) => {
      if (!quill) return;
      const currentFormat = quill.getFormat();
      quill.format(format, currentFormat[format] ? false : value);
    },
    [quill]
  );

  const formatHeader = useCallback(
    (level: number | false) => {
      if (!quill) return;
      quill.format('header', level);
    },
    [quill]
  );

  const formatAlign = useCallback(
    (alignment: string | false) => {
      if (!quill) return;
      quill.format('align', alignment);
    },
    [quill]
  );

  const insertLink = useCallback(() => {
    if (!quill) return;
    const range = quill.getSelection();
    if (range) {
      const url = prompt('Enter URL:');
      if (url) {
        quill.format('link', url);
      }
    }
  }, [quill]);

  const insertImage = useCallback(() => {
    if (!quill) return;
    const url = prompt('Enter image URL:');
    if (url) {
      const range = quill.getSelection();
      if (range) {
        quill.insertEmbed(range.index, 'image', url);
      }
    }
  }, [quill]);

  const clearFormat = useCallback(() => {
    if (!quill) return;
    const range = quill.getSelection();
    if (range) {
      quill.removeFormat(range.index, range.length);
    }
  }, [quill]);

  const insertDivider = useCallback(() => {
    if (!quill) return;
    const range = quill.getSelection();
    if (range) {
      quill.insertText(range.index, '\n');
      quill.insertEmbed(range.index + 1, 'divider', true);
      quill.insertText(range.index + 2, '\n');
      quill.setSelection(range.index + 3, 0);
    }
  }, [quill]);

  const iconSize = 18;

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
      {/* Text Style Dropdown */}
      <HeadingDropdown onSelect={formatHeader} />

      <ToolbarDivider />

      {/* Basic Formatting */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={<Bold size={iconSize} />}
          title="Bold (Ctrl+B)"
          onClick={() => formatText('bold')}
        />
        <ToolbarButton
          icon={<Italic size={iconSize} />}
          title="Italic (Ctrl+I)"
          onClick={() => formatText('italic')}
        />
        <ToolbarButton
          icon={<Underline size={iconSize} />}
          title="Underline (Ctrl+U)"
          onClick={() => formatText('underline')}
        />
        <ToolbarButton
          icon={<Strikethrough size={iconSize} />}
          title="Strikethrough"
          onClick={() => formatText('strike')}
        />
      </div>

      <ToolbarDivider />

      {/* Color */}
      <div className="flex items-center gap-0.5">
        <div className="relative">
          <ToolbarButton
            icon={<Palette size={iconSize} />}
            title="Text color"
            onClick={() => {
              const color = prompt('Enter color (hex or name):', '#3b82f6');
              if (color && quill) quill.format('color', color);
            }}
          />
        </div>
        <div className="relative">
          <ToolbarButton
            icon={<Highlighter size={iconSize} />}
            title="Highlight"
            onClick={() => {
              const color = prompt('Enter highlight color:', '#fef08a');
              if (color && quill) quill.format('background', color);
            }}
          />
        </div>
      </div>

      <ToolbarDivider />

      {/* Alignment */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={<AlignLeft size={iconSize} />}
          title="Align left"
          onClick={() => formatAlign(false)}
        />
        <ToolbarButton
          icon={<AlignCenter size={iconSize} />}
          title="Align center"
          onClick={() => formatAlign('center')}
        />
        <ToolbarButton
          icon={<AlignRight size={iconSize} />}
          title="Align right"
          onClick={() => formatAlign('right')}
        />
        <ToolbarButton
          icon={<AlignJustify size={iconSize} />}
          title="Justify"
          onClick={() => formatAlign('justify')}
        />
      </div>

      <ToolbarDivider />

      {/* Lists */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={<List size={iconSize} />}
          title="Bullet list"
          onClick={() => formatText('list', 'bullet')}
        />
        <ToolbarButton
          icon={<ListOrdered size={iconSize} />}
          title="Numbered list"
          onClick={() => formatText('list', 'ordered')}
        />
      </div>

      <ToolbarDivider />

      {/* Blocks */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={<Quote size={iconSize} />}
          title="Quote"
          onClick={() => formatText('blockquote')}
        />
        <ToolbarButton
          icon={<Code size={iconSize} />}
          title="Code block"
          onClick={() => formatText('code-block')}
        />
        <ToolbarButton icon={<Minus size={iconSize} />} title="Divider" onClick={insertDivider} />
      </div>

      <ToolbarDivider />

      {/* Insert */}
      <div className="flex items-center gap-0.5">
        <ToolbarButton icon={<Link size={iconSize} />} title="Insert link" onClick={insertLink} />
        <ToolbarButton
          icon={<Image size={iconSize} />}
          title="Insert image"
          onClick={insertImage}
        />
      </div>

      <ToolbarDivider />

      {/* Clear */}
      <ToolbarButton
        icon={<RemoveFormatting size={iconSize} />}
        title="Clear formatting"
        onClick={clearFormat}
      />
    </div>
  );
}

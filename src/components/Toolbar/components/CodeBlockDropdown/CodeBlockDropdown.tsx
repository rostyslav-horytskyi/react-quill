import { useState, useCallback } from 'react';
import { ChevronDown, Code } from 'lucide-react';
import { useQuill } from '../../../../context';
import { LANGUAGE_OPTIONS, type LanguageValue } from '../../../../quill/modules/syntax';
import OutsideClickHandler from 'react-outside-click-handler';

const ICON_SIZE = 18;

export default function CodeBlockDropdown() {
  const { quill, formats, refreshFormats } = useQuill();
  const [isOpen, setIsOpen] = useState(false);

  const currentCodeBlock = formats['code-block'];
  const isInCodeBlock = currentCodeBlock !== undefined && currentCodeBlock !== false;

  const currentLanguage: LanguageValue =
    typeof currentCodeBlock === 'string' ? (currentCodeBlock as LanguageValue) : 'plain';

  const currentOption =
    LANGUAGE_OPTIONS.find(opt => opt.value === currentLanguage) ?? LANGUAGE_OPTIONS[0];

  const handleSelect = useCallback(
    (value: LanguageValue) => {
      if (!quill) return;

      const wasInCodeBlock = isInCodeBlock;

      if (value === 'plain') {
        quill.format('code-block', true);
      } else {
        quill.format('code-block', value);
      }

      if (!wasInCodeBlock) {
        const range = quill.getSelection();

        if (range) {
          const [line] = quill.getLine(range.index);

          if (line) {
            const lineEndIndex = quill.getIndex(line) + line.length();
            quill.insertText(lineEndIndex, '\n');
            quill.formatLine(lineEndIndex + 1, 1, 'code-block', false);
          }
        }
      }

      refreshFormats();
      setIsOpen(false);
    },
    [quill, isInCodeBlock, refreshFormats]
  );

  const handleButtonClick = useCallback(() => {
    if (!quill) return;

    if (isInCodeBlock) {
      quill.format('code-block', false);
    } else {
      quill.format('code-block', true);

      const range = quill.getSelection();

      if (range) {
        const [line] = quill.getLine(range.index);

        if (line) {
          const lineEndIndex = quill.getIndex(line) + line.length();
          quill.insertText(lineEndIndex, '\n');
          quill.formatLine(lineEndIndex + 1, 1, 'code-block', false);
        }
      }
    }

    refreshFormats();
  }, [quill, isInCodeBlock, refreshFormats]);

  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpen(false)} display="contents">
      <div className="relative flex" data-testid="code-block-dropdown">
        <button
          type="button"
          onClick={handleButtonClick}
          title="Code block"
          className={`p-2 rounded-l-lg transition-all duration-150 active:scale-95 ${
            isInCodeBlock
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900/70'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          <Code size={ICON_SIZE} />
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title="Select language"
          className={`px-1 rounded-r-lg border-l border-gray-200 dark:border-gray-600 transition-all duration-150 active:scale-95 ${
            isInCodeBlock
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900/70'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          <ChevronDown
            size={12}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div
            data-testid="code-block-dropdown-menu"
            className="absolute top-full left-0 mt-1 min-w-[160px] max-h-[300px] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
          >
            {LANGUAGE_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isInCodeBlock && currentOption.value === option.value
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
    </OutsideClickHandler>
  );
}

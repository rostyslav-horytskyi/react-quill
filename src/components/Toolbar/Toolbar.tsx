import { useCallback } from 'react';
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
  Palette,
  Highlighter,
  RemoveFormatting,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
} from 'lucide-react';
import HeadingDropdown from './components/HeadingDropdown/HeadingDropdown.tsx';
import ToolbarDivider from './components/ToolbarDivider/ToolbarDivider.tsx';
import ToolbarButton from './components/ToolbarButton/ToolbarButton.tsx';

interface ToolbarProps {
  quill: Quill | null;
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

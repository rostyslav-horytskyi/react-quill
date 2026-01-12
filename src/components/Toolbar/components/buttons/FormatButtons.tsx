import { useCallback } from 'react';
import { Bold, Italic, Underline, Strikethrough } from 'lucide-react';
import { useQuill } from '../../../../context';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const ICON_SIZE = 18;

export default function FormatButtons() {
  const { quill, formats, refreshFormats } = useQuill();

  const formatText = useCallback(
    (format: string) => {
      if (!quill) return;
      const currentFormat = quill.getFormat();
      quill.format(format, !currentFormat[format]);
      refreshFormats();
    },
    [quill, refreshFormats]
  );

  return (
    <div className="flex items-center gap-0.5">
      <ToolbarButton
        icon={<Bold size={ICON_SIZE} />}
        title="Bold (Ctrl+B)"
        onClick={() => formatText('bold')}
        isActive={!!formats.bold}
      />
      <ToolbarButton
        icon={<Italic size={ICON_SIZE} />}
        title="Italic (Ctrl+I)"
        onClick={() => formatText('italic')}
        isActive={!!formats.italic}
      />
      <ToolbarButton
        icon={<Underline size={ICON_SIZE} />}
        title="Underline (Ctrl+U)"
        onClick={() => formatText('underline')}
        isActive={!!formats.underline}
      />
      <ToolbarButton
        icon={<Strikethrough size={ICON_SIZE} />}
        title="Strikethrough"
        onClick={() => formatText('strike')}
        isActive={!!formats.strike}
      />
    </div>
  );
}

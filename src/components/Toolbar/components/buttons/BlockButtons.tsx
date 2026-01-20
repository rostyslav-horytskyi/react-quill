import { useCallback } from 'react';
import { Quote, Minus } from 'lucide-react';
import { useQuill } from '../../../../context';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const ICON_SIZE = 18;

export default function BlockButtons() {
  const { quill, formats, refreshFormats } = useQuill();

  const formatBlock = useCallback(
    (format: string) => {
      if (!quill) return;
      const currentFormat = quill.getFormat();
      quill.format(format, !currentFormat[format]);
      refreshFormats();
    },
    [quill, refreshFormats]
  );

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

  return (
    <div className="flex items-center gap-0.5">
      <ToolbarButton
        icon={<Quote size={ICON_SIZE} />}
        title="Quote"
        onClick={() => formatBlock('blockquote')}
        isActive={!!formats.blockquote}
      />
      <ToolbarButton icon={<Minus size={ICON_SIZE} />} title="Divider" onClick={insertDivider} />
    </div>
  );
}

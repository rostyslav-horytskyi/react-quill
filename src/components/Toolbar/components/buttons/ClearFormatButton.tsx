import { useCallback } from 'react';
import { RemoveFormatting } from 'lucide-react';
import { useQuill } from '../../../../context';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const ICON_SIZE = 18;

export default function ClearFormatButton() {
  const { quill, refreshFormats } = useQuill();

  const clearFormat = useCallback(() => {
    if (!quill) return;
    const range = quill.getSelection();
    if (range) {
      quill.removeFormat(range.index, range.length);
      refreshFormats();
    }
  }, [quill, refreshFormats]);

  return (
    <ToolbarButton
      icon={<RemoveFormatting size={ICON_SIZE} />}
      title="Clear formatting"
      onClick={clearFormat}
    />
  );
}

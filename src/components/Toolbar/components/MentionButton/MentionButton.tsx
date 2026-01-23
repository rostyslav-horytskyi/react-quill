import { AtSign } from 'lucide-react';
import { useCallback } from 'react';
import Quill from 'quill';
import { useQuill } from '../../../../context';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const ICON_SIZE = 18;

export default function MentionButton() {
  const { quill } = useQuill();

  const handleInsert = useCallback(() => {
    if (!quill) return;

    const range = quill.getSelection(true);
    const index = range?.index ?? quill.getLength();

    quill.insertText(index, '@', Quill.sources.USER);
    quill.setSelection(index + 1, 0, Quill.sources.USER);
    quill.focus();
  }, [quill]);

  return (
    <ToolbarButton
      icon={<AtSign size={ICON_SIZE} />}
      title="Insert mention"
      onClick={handleInsert}
    />
  );
}

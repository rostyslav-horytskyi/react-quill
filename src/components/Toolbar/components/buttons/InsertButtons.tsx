import { useCallback } from 'react';
import { Link, Image } from 'lucide-react';
import { useQuill } from '../../../../context';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const ICON_SIZE = 18;

export default function InsertButtons() {
  const { quill, formats, refreshFormats } = useQuill();

  const insertLink = useCallback(() => {
    if (!quill) return;
    const range = quill.getSelection();
    if (range) {
      const url = prompt('Enter URL:');
      if (url) {
        quill.format('link', url);
        refreshFormats();
      }
    }
  }, [quill, refreshFormats]);

  const insertImage = useCallback(() => {
    if (!quill) return;
    const url = prompt('Enter image URL:');
    if (url) {
      const range = quill.getSelection();
      if (range) {
        quill.insertEmbed(range.index, 'image', url);
        refreshFormats();
      }
    }
  }, [quill, refreshFormats]);

  return (
    <div className="flex items-center gap-0.5">
      <ToolbarButton
        icon={<Link size={ICON_SIZE} />}
        title="Insert link"
        onClick={insertLink}
        isActive={!!formats.link}
      />
      <ToolbarButton icon={<Image size={ICON_SIZE} />} title="Insert image" onClick={insertImage} />
    </div>
  );
}

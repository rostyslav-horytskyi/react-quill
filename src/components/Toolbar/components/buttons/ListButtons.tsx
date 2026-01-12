import { useCallback } from 'react';
import { List, ListOrdered } from 'lucide-react';
import { useQuill } from '../../../../context';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const ICON_SIZE = 18;

export default function ListButtons() {
  const { quill, formats, refreshFormats } = useQuill();

  const formatList = useCallback(
    (listType: 'bullet' | 'ordered') => {
      if (!quill) return;
      const currentFormat = quill.getFormat();
      quill.format('list', currentFormat.list === listType ? false : listType);
      refreshFormats();
    },
    [quill, refreshFormats]
  );

  return (
    <div className="flex items-center gap-0.5">
      <ToolbarButton
        icon={<List size={ICON_SIZE} />}
        title="Bullet list"
        onClick={() => formatList('bullet')}
        isActive={formats.list === 'bullet'}
      />
      <ToolbarButton
        icon={<ListOrdered size={ICON_SIZE} />}
        title="Numbered list"
        onClick={() => formatList('ordered')}
        isActive={formats.list === 'ordered'}
      />
    </div>
  );
}

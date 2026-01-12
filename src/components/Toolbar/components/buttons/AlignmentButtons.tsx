import { useCallback } from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { useQuill } from '../../../../context';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const ICON_SIZE = 18;

export default function AlignmentButtons() {
  const { quill, formats, refreshFormats } = useQuill();

  const formatAlign = useCallback(
    (alignment: string | false) => {
      if (!quill) return;
      quill.format('align', alignment);
      refreshFormats();
    },
    [quill, refreshFormats]
  );

  return (
    <div className="flex items-center gap-0.5">
      <ToolbarButton
        icon={<AlignLeft size={ICON_SIZE} />}
        title="Align left"
        onClick={() => formatAlign(false)}
        isActive={!formats.align}
      />
      <ToolbarButton
        icon={<AlignCenter size={ICON_SIZE} />}
        title="Align center"
        onClick={() => formatAlign('center')}
        isActive={formats.align === 'center'}
      />
      <ToolbarButton
        icon={<AlignRight size={ICON_SIZE} />}
        title="Align right"
        onClick={() => formatAlign('right')}
        isActive={formats.align === 'right'}
      />
      <ToolbarButton
        icon={<AlignJustify size={ICON_SIZE} />}
        title="Justify"
        onClick={() => formatAlign('justify')}
        isActive={formats.align === 'justify'}
      />
    </div>
  );
}

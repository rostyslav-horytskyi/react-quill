import { useCallback } from 'react';
import { Palette, Highlighter } from 'lucide-react';
import { useQuill } from '../../../../context';
import ColorPicker, { TEXT_COLORS, HIGHLIGHT_COLORS } from '../ColorPicker';

const ICON_SIZE = 18;

export default function ColorButtons() {
  const { quill, formats, refreshFormats } = useQuill();

  const handleTextColor = useCallback(
    (color: string | false) => {
      if (!quill) return;
      quill.format('color', color);
      refreshFormats();
    },
    [quill, refreshFormats]
  );

  const handleHighlight = useCallback(
    (color: string | false) => {
      if (!quill) return;
      quill.format('background', color);
      refreshFormats();
    },
    [quill, refreshFormats]
  );

  return (
    <div className="flex items-center gap-0.5">
      <ColorPicker
        icon={<Palette size={ICON_SIZE} />}
        title="Text color"
        currentColor={formats.color}
        onColorSelect={handleTextColor}
        colors={TEXT_COLORS}
      />
      <ColorPicker
        icon={<Highlighter size={ICON_SIZE} />}
        title="Highlight"
        currentColor={formats.background}
        onColorSelect={handleHighlight}
        colors={HIGHLIGHT_COLORS}
        showColorBar={false}
      />
    </div>
  );
}

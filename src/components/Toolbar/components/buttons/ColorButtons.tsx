import { Palette, Highlighter } from 'lucide-react';
import { useQuill } from '../../../../context';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const ICON_SIZE = 18;

export default function ColorButtons() {
  const { quill, formats } = useQuill();

  const setTextColor = () => {
    const color = prompt('Enter color (hex or name):', '#3b82f6');
    if (color && quill) {
      quill.format('color', color);
    }
  };

  const setHighlight = () => {
    const color = prompt('Enter highlight color:', '#fef08a');
    if (color && quill) {
      quill.format('background', color);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      <ToolbarButton
        icon={<Palette size={ICON_SIZE} />}
        title="Text color"
        onClick={setTextColor}
        isActive={!!formats.color}
      />
      <ToolbarButton
        icon={<Highlighter size={ICON_SIZE} />}
        title="Highlight"
        onClick={setHighlight}
        isActive={!!formats.background}
      />
    </div>
  );
}

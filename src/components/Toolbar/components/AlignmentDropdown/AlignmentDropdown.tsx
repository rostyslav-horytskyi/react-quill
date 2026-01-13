import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import ToolbarDropdown, { type DropdownOption } from '../ToolbarDropdown';
import { useQuill } from '../../../../context';

const ICON_SIZE = 18;

const options: DropdownOption<string | false>[] = [
  { value: false, icon: <AlignLeft size={ICON_SIZE} /> },
  { value: 'center', icon: <AlignCenter size={ICON_SIZE} /> },
  { value: 'right', icon: <AlignRight size={ICON_SIZE} /> },
  { value: 'justify', icon: <AlignJustify size={ICON_SIZE} /> },
];

export default function AlignmentDropdown() {
  const { quill, formats, refreshFormats } = useQuill();

  const handleChange = (alignment: string | false) => {
    if (!quill) return;
    quill.format('align', alignment);
    refreshFormats();
  };

  return (
    <ToolbarDropdown
      options={options}
      value={formats.align ?? false}
      onChange={handleChange}
      defaultValue={false}
      data-testid="alignment-dropdown"
    />
  );
}

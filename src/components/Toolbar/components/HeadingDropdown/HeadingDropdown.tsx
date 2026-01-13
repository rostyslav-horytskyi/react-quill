import { Heading1, Heading2, Heading3, Heading4, Type } from 'lucide-react';
import ToolbarDropdown, { type DropdownOption } from '../ToolbarDropdown';
import { useQuill } from '../../../../context';

const ICON_SIZE = 18;

const options: DropdownOption<number | false>[] = [
  { value: 1, icon: <Heading1 size={ICON_SIZE} /> },
  { value: 2, icon: <Heading2 size={ICON_SIZE} /> },
  { value: 3, icon: <Heading3 size={ICON_SIZE} /> },
  { value: 4, icon: <Heading4 size={ICON_SIZE} /> },
  { value: false, icon: <Type size={ICON_SIZE} /> },
];

export default function HeadingDropdown() {
  const { quill, formats, refreshFormats } = useQuill();

  const handleChange = (level: number | false) => {
    if (!quill) return;
    quill.format('header', level);
    refreshFormats();
  };

  return (
    <ToolbarDropdown
      options={options}
      value={formats.header ?? false}
      onChange={handleChange}
      defaultValue={false}
    />
  );
}

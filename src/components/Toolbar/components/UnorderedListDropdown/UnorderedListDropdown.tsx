import { List } from 'lucide-react';
import SplitButtonDropdown, { type SplitDropdownOption } from '../SplitButtonDropdown';
import { useQuill } from '../../../../context';

const ICON_SIZE = 18;

const options: SplitDropdownOption<string>[] = [
  { value: 'bullet', label: 'Default' },
  { value: 'circle', label: 'Circle' },
  { value: 'disc', label: 'Disc' },
  { value: 'square', label: 'Square' },
];

const bulletTypes = options.map(o => o.value);

export default function UnorderedListDropdown() {
  const { quill, formats, refreshFormats } = useQuill();

  const isActive = formats.list && bulletTypes.includes(formats.list);
  const currentValue = isActive ? formats.list : undefined;

  const handleButtonClick = () => {
    if (!quill) return;

    quill.format('list', isActive ? false : 'bullet');
    refreshFormats();
  };

  const handleOptionSelect = (value: string) => {
    if (!quill) return;

    quill.format('list', value);
    refreshFormats();
  };

  return (
    <SplitButtonDropdown
      icon={<List size={ICON_SIZE} />}
      options={options}
      value={currentValue}
      onButtonClick={handleButtonClick}
      onOptionSelect={handleOptionSelect}
      isActive={isActive}
    />
  );
}

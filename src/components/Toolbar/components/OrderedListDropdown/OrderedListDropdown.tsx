import { ListOrdered } from 'lucide-react';
import SplitButtonDropdown, { type SplitDropdownOption } from '../SplitButtonDropdown';
import { useQuill } from '../../../../context';

const ICON_SIZE = 18;

const options: SplitDropdownOption<string>[] = [
  { value: 'ordered', label: 'Default' },
  { value: 'lower-alpha', label: 'Lower Alpha' },
  { value: 'upper-alpha', label: 'Upper Alpha' },
  { value: 'lower-roman', label: 'Lower Roman' },
  { value: 'upper-roman', label: 'Upper Roman' },
  { value: 'lower-greek', label: 'Lower Greek' },
];

const orderedTypes = options.map(o => o.value);

export default function OrderedListDropdown() {
  const { quill, formats, refreshFormats } = useQuill();

  const isActive = formats.list && orderedTypes.includes(formats.list);
  const currentValue = isActive ? formats.list : undefined;

  const handleButtonClick = () => {
    if (!quill) return;

    quill.format('list', isActive ? false : 'ordered');
    refreshFormats();
  };

  const handleOptionSelect = (value: string) => {
    if (!quill) return;
    quill.format('list', value);
    refreshFormats();
  };

  return (
    <SplitButtonDropdown
      icon={<ListOrdered size={ICON_SIZE} />}
      options={options}
      value={currentValue}
      onButtonClick={handleButtonClick}
      onOptionSelect={handleOptionSelect}
      isActive={isActive}
    />
  );
}

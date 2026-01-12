import HeadingDropdown from './components/HeadingDropdown/HeadingDropdown';
import ToolbarDivider from './components/ToolbarDivider/ToolbarDivider';
import {
  FormatButtons,
  AlignmentButtons,
  ListButtons,
  BlockButtons,
  InsertButtons,
  ColorButtons,
  ClearFormatButton,
} from './components/buttons';
import { useQuill } from '../../context';

export default function Toolbar() {
  const { quill, formats, refreshFormats } = useQuill();

  const formatHeader = (level: number | false) => {
    if (!quill) return;
    quill.format('header', level);
    refreshFormats();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
      <HeadingDropdown onSelect={formatHeader} activeHeader={formats.header} />
      <ToolbarDivider />
      <FormatButtons />
      <ToolbarDivider />
      <ColorButtons />
      <ToolbarDivider />
      <AlignmentButtons />
      <ToolbarDivider />
      <ListButtons />
      <ToolbarDivider />
      <BlockButtons />
      <ToolbarDivider />
      <InsertButtons />
      <ToolbarDivider />
      <ClearFormatButton />
    </div>
  );
}

import HeadingDropdown from './components/HeadingDropdown/HeadingDropdown';
import AlignmentDropdown from './components/AlignmentDropdown/AlignmentDropdown';
import ToolbarDivider from './components/ToolbarDivider/ToolbarDivider';
import {
  FormatButtons,
  BlockButtons,
  InsertButtons,
  ColorButtons,
  ClearFormatButton,
} from './components/buttons';
import UnorderedListDropdown from './components/UnorderedListDropdown';
import OrderedListDropdown from './components/OrderedListDropdown';

export default function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
      <HeadingDropdown />
      <ToolbarDivider />
      <FormatButtons />
      <ToolbarDivider />
      <ColorButtons />
      <ToolbarDivider />
      <AlignmentDropdown />
      <ToolbarDivider />
      <UnorderedListDropdown />
      <OrderedListDropdown />
      <ToolbarDivider />
      <BlockButtons />
      <ToolbarDivider />
      <InsertButtons />
      <ToolbarDivider />
      <ClearFormatButton />
    </div>
  );
}

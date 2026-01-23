import HeadingDropdown from './components/HeadingDropdown/HeadingDropdown';
import FontDropdown from './components/FontDropdown/FontDropdown';
import AlignmentDropdown from './components/AlignmentDropdown/AlignmentDropdown';
import ToolbarDivider from './components/ToolbarDivider/ToolbarDivider';
import { FormatButtons, BlockButtons, ColorButtons, ClearFormatButton } from './components/buttons';
import UnorderedListDropdown from './components/UnorderedListDropdown';
import OrderedListDropdown from './components/OrderedListDropdown';
import ImageButton from './components/ImageButton/ImageButton.tsx';
import LinkButton from './components/LinkButton';
import CodeBlockDropdown from './components/CodeBlockDropdown';
import MentionButton from './components/MentionButton';

export default function Toolbar() {
  return (
    <div
      role={'toolbar'}
      className="flex flex-wrap items-center gap-0.5 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-xl"
    >
      <FontDropdown />
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
      <CodeBlockDropdown />
      <ToolbarDivider />
      <LinkButton />
      <MentionButton />
      <ImageButton />
      <ToolbarDivider />
      <ClearFormatButton />
    </div>
  );
}

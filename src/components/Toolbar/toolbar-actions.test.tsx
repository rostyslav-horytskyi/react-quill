import { describe, expect, it } from 'vitest';
import { renderWithQuill, screen, within } from '../../test';
import { createQuillMock } from '../../test/quill-mock';
import FormatButtons from './components/buttons/FormatButtons';
import BlockButtons from './components/buttons/BlockButtons';
import ColorButtons from './components/buttons/ColorButtons';
import ClearFormatButton from './components/buttons/ClearFormatButton';
import HeadingDropdown from './components/HeadingDropdown/HeadingDropdown';
import AlignmentDropdown from './components/AlignmentDropdown/AlignmentDropdown';
import FontDropdown from './components/FontDropdown/FontDropdown';
import OrderedListDropdown from './components/OrderedListDropdown/OrderedListDropdown';
import UnorderedListDropdown from './components/UnorderedListDropdown/UnorderedListDropdown';
import CodeBlockDropdown from './components/CodeBlockDropdown/CodeBlockDropdown';
import LinkButton from './components/LinkButton/LinkButton';
import ImageButton from './components/ImageButton/ImageButton';

describe('Toolbar actions', () => {
  it('toggles bold formatting', async () => {
    const { quill } = createQuillMock();
    const { user } = renderWithQuill(<FormatButtons />, quill);

    await user.click(screen.getByTitle('Bold (Ctrl+B)'));

    expect(quill.format).toHaveBeenCalledWith('bold', true);
  });

  it('toggles blockquote formatting', async () => {
    const { quill } = createQuillMock();
    const { user } = renderWithQuill(<BlockButtons />, quill);

    await user.click(screen.getByTitle('Quote'));

    expect(quill.format).toHaveBeenCalledWith('blockquote', true);
  });

  it('inserts a divider embed at the cursor position', async () => {
    const { quill } = createQuillMock({ selection: { index: 0, length: 0 } });
    const { user } = renderWithQuill(<BlockButtons />, quill);

    await user.click(screen.getByTitle('Divider'));

    expect(quill.insertText).toHaveBeenNthCalledWith(1, 0, '\n');
    expect(quill.insertEmbed).toHaveBeenCalledWith(1, 'divider', true);
    expect(quill.insertText).toHaveBeenNthCalledWith(2, 2, '\n');
    expect(quill.setSelection).toHaveBeenCalledWith(3, 0);
  });

  it('applies text and highlight colors', async () => {
    const { quill } = createQuillMock();
    const { user } = renderWithQuill(<ColorButtons />, quill);

    await user.click(screen.getByTitle('Text color'));
    await user.click(screen.getByTitle('#000000'));

    await user.click(screen.getByTitle('Highlight'));
    await user.click(screen.getByTitle('#fef08a'));

    expect(quill.format).toHaveBeenCalledWith('color', '#000000');
    expect(quill.format).toHaveBeenCalledWith('background', '#fef08a');
  });

  it('clears formatting for the current selection', async () => {
    const { quill } = createQuillMock({ selection: { index: 1, length: 4 } });
    const { user } = renderWithQuill(<ClearFormatButton />, quill);

    await user.click(screen.getByTitle('Clear formatting'));

    expect(quill.removeFormat).toHaveBeenCalledWith(1, 4);
  });

  it('applies heading format from the dropdown', async () => {
    const { quill } = createQuillMock();
    const { user } = renderWithQuill(<HeadingDropdown />, quill);

    const trigger = screen.getByTestId('heading-dropdown').querySelector('button');
    await user.click(trigger!);

    const menu = screen.getByTestId('toolbar-dropdown-menu');
    const options = menu.querySelectorAll('button');
    await user.click(options[1]);

    expect(quill.format).toHaveBeenCalledWith('header', 2);
  });

  it('applies alignment format from the dropdown', async () => {
    const { quill } = createQuillMock();
    const { user } = renderWithQuill(<AlignmentDropdown />, quill);

    const trigger = screen.getByTestId('alignment-dropdown').querySelector('button');
    await user.click(trigger!);

    const menu = screen.getByTestId('toolbar-dropdown-menu');
    const options = menu.querySelectorAll('button');
    await user.click(options[1]);

    expect(quill.format).toHaveBeenCalledWith('align', 'center');
  });

  it('applies a font selection', async () => {
    const { quill } = createQuillMock();
    const { user } = renderWithQuill(<FontDropdown />, quill);

    const trigger = screen.getByTestId('font-dropdown').querySelector('button');
    await user.click(trigger!);
    await user.click(screen.getByText('Arial'));

    expect(quill.format).toHaveBeenCalledWith('font', 'arial');
  });

  it('applies ordered list options', async () => {
    const { quill } = createQuillMock();
    const { user } = renderWithQuill(<OrderedListDropdown />, quill);

    const buttons = screen.getByTestId('ordered-list-dropdown').querySelectorAll('button');
    await user.click(buttons[0]);
    await user.click(buttons[1]);
    await user.click(screen.getByText('Upper Alpha'));

    expect(quill.format).toHaveBeenCalledWith('list', 'ordered');
    expect(quill.format).toHaveBeenCalledWith('list', 'upper-alpha');
  });

  it('applies unordered list options', async () => {
    const { quill } = createQuillMock();
    const { user } = renderWithQuill(<UnorderedListDropdown />, quill);

    const buttons = screen.getByTestId('unordered-list-dropdown').querySelectorAll('button');
    await user.click(buttons[0]);
    await user.click(buttons[1]);
    await user.click(screen.getByText('Square'));

    expect(quill.format).toHaveBeenCalledWith('list', 'bullet');
    expect(quill.format).toHaveBeenCalledWith('list', 'square');
  });

  it('toggles a code block from the main button', async () => {
    const { quill } = createQuillMock({ selection: { index: 0, length: 0 } });
    const { user } = renderWithQuill(<CodeBlockDropdown />, quill);

    await user.click(screen.getByTitle('Code block'));

    expect(quill.format).toHaveBeenCalledWith('code-block', true);
    expect(quill.insertText).toHaveBeenCalledWith(1, '\n');
    expect(quill.formatLine).toHaveBeenCalledWith(2, 1, 'code-block', false);
  });

  it('inserts a link when no text is selected', async () => {
    const { quill } = createQuillMock({ selection: { index: 0, length: 0 } });
    const { user } = renderWithQuill(<LinkButton />, quill);

    await user.click(screen.getByTitle('Insert link'));

    const input = screen.getByLabelText('URL');
    await user.type(input, 'example.com');
    await user.click(screen.getByRole('button', { name: 'Insert' }));

    expect(quill.insertText).toHaveBeenCalledWith(
      0,
      'https://example.com',
      'link',
      'https://example.com'
    );
  });

  it('inserts an image at the current selection', async () => {
    const { quill } = createQuillMock({ selection: { index: 2, length: 0 } });
    const { user } = renderWithQuill(<ImageButton />, quill);

    await user.click(screen.getByTitle('Insert image'));

    const dialog = screen.getByRole('dialog');
    const input = within(dialog).getByRole('textbox', { name: 'Image URL' });
    await user.type(input, 'https://example.com/image.png');
    await user.click(screen.getByRole('button', { name: 'Insert Image' }));

    expect(quill.insertEmbed).toHaveBeenCalledWith(
      2,
      'image',
      'https://example.com/image.png',
      'user'
    );
    expect(quill.setSelection).toHaveBeenCalledWith(3, 0);
  });
});

import { describe, expect, it, vi } from 'vitest';
import { renderWithQuill, screen } from '../../../../test';
import { createQuillMock } from '../../../../test/quill-mock';
import MentionButton from './MentionButton';

describe('<MentionButton />', () => {
  it('should insert @ at the current selection', async () => {
    const { quill } = createQuillMock({ selection: { index: 3, length: 0 } });
    const { user } = renderWithQuill(<MentionButton />, quill);

    await user.click(screen.getByTitle('Insert mention'));

    expect(quill.insertText).toHaveBeenCalledWith(3, '@', 'user');
    expect(quill.setSelection).toHaveBeenCalledWith(4, 0, 'user');
    expect(quill.focus).toHaveBeenCalled();
  });

  it('should fall back to document length when there is no selection', async () => {
    const { quill } = createQuillMock({ selection: null });
    quill.getLength = vi.fn(() => 10);
    const { user } = renderWithQuill(<MentionButton />, quill);

    await user.click(screen.getByTitle('Insert mention'));

    expect(quill.insertText).toHaveBeenCalledWith(10, '@', 'user');
    expect(quill.setSelection).toHaveBeenCalledWith(11, 0, 'user');
  });
});

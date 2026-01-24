import { describe, expect, it } from 'vitest';
import { renderWithQuill, screen, waitFor } from '../../../../test';
import { createQuillMock } from '../../../../test/quill-mock';
import LinkButton from './LinkButton';

describe('<LinkButton />', () => {
  it('should format selected text as a link', async () => {
    const { quill } = createQuillMock({ selection: { index: 0, length: 4 } });
    const { user } = renderWithQuill(<LinkButton />, quill);

    await user.click(screen.getByTitle('Insert link'));

    expect(screen.getByText('Selected text:')).toBeInTheDocument();
    expect(screen.getByText('Selected text')).toBeInTheDocument();

    const input = screen.getByLabelText('URL');
    await user.clear(input);
    await user.type(input, 'example.com');
    await user.click(screen.getByRole('button', { name: 'Insert' }));

    expect(quill.format).toHaveBeenCalledWith('link', 'https://example.com');
  });

  it('should remove a link when editing', async () => {
    const { quill } = createQuillMock({
      selection: { index: 0, length: 0 },
      formats: { link: 'https://example.com' },
    });
    const { user } = renderWithQuill(<LinkButton />, quill);

    await waitFor(() => {
      expect(quill.getFormat).toHaveBeenCalled();
    });

    await user.click(screen.getByTitle('Insert link'));
    await user.click(screen.getByRole('button', { name: 'Remove link' }));

    expect(quill.format).toHaveBeenCalledWith('link', false);
  });
});

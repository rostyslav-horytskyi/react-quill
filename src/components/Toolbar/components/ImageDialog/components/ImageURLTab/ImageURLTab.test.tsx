import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '../../../../../../test';
import ImageURLTab from './ImageURLTab';

describe('<ImageURLTab />', () => {
  it('keeps insert disabled for invalid URLs and clears input', async () => {
    const { user } = render(<ImageURLTab onInsert={vi.fn()} />);

    const input = screen.getByLabelText('Image URL');
    const insertButton = screen.getByRole('button', { name: /insert image/i });

    expect(insertButton).toBeDisabled();

    await user.type(input, 'not-a-url');
    expect(insertButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /clear/i }));
    expect(input).toHaveValue('');
  });

  it('trims URL before inserting and closes the dialog', async () => {
    const onInsert = vi.fn();
    const onClose = vi.fn();
    const { user } = render(<ImageURLTab onInsert={onInsert} onClose={onClose} />);

    const input = screen.getByLabelText('Image URL');
    const insertButton = screen.getByRole('button', { name: /insert image/i });

    fireEvent.change(input, { target: { value: ' https://example.com/image.png ' } });

    expect(insertButton).toBeEnabled();

    await user.click(insertButton);

    expect(onInsert).toHaveBeenCalledWith('https://example.com/image.png');
    expect(onClose).toHaveBeenCalled();

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });
});

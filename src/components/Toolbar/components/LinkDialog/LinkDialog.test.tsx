import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../../test';
import LinkDialog from './LinkDialog';

describe('<LinkDialog />', () => {
  it('should show selected text and inserts a normalized url', async () => {
    const onInsert = vi.fn();
    const onClose = vi.fn();
    const { user } = render(
      <LinkDialog
        onInsert={onInsert}
        onClose={onClose}
        onRemove={vi.fn()}
        selectedText="Hello world"
      />
    );

    expect(screen.getByText('Selected text:')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();

    const input = screen.getByLabelText('URL');
    await user.clear(input);
    await user.type(input, 'example.com');
    await user.click(screen.getByRole('button', { name: 'Insert' }));

    expect(onInsert).toHaveBeenCalledWith('https://example.com');
    expect(onClose).toHaveBeenCalled();
  });

  it('should show validation errors for empty and invalid urls', async () => {
    const { user } = render(<LinkDialog onInsert={vi.fn()} onClose={vi.fn()} onRemove={vi.fn()} />);

    const form = screen.getByRole('dialog').querySelector('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    expect(screen.getByText('Please enter a URL')).toBeInTheDocument();

    const input = screen.getByLabelText('URL');
    await user.type(input, 'bad url');
    await user.click(screen.getByRole('button', { name: 'Insert' }));

    expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument();
  });

  it('should remove link in edit mode', async () => {
    const onRemove = vi.fn();
    const onClose = vi.fn();
    const { user } = render(
      <LinkDialog
        onInsert={vi.fn()}
        onClose={onClose}
        onRemove={onRemove}
        currentUrl="https://example.com"
      />
    );

    expect(screen.getByText('Edit link')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove link' }));

    expect(onRemove).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('should close on Escape', () => {
    const onClose = vi.fn();
    render(<LinkDialog onInsert={vi.fn()} onClose={onClose} onRemove={vi.fn()} />);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(onClose).toHaveBeenCalled();
  });
});

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../../test';
import ImageDialog from './ImageDialog';

describe('<ImageDialog />', () => {
  it('does not render when closed', () => {
    render(<ImageDialog isOpen={false} onClose={vi.fn()} onInsert={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<ImageDialog isOpen onClose={onClose} onInsert={vi.fn()} />);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(onClose).toHaveBeenCalled();
  });

  it('closes on outside click but not on inside click', () => {
    const onClose = vi.fn();
    render(<ImageDialog isOpen onClose={onClose} onInsert={vi.fn()} />);

    const dialog = screen.getByRole('dialog');
    fireEvent.mouseDown(dialog);
    fireEvent.mouseUp(dialog);

    expect(onClose).not.toHaveBeenCalled();

    fireEvent.mouseDown(document.body);
    fireEvent.mouseUp(document.body);

    expect(onClose).toHaveBeenCalled();
  });
});

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../../../../../../test';
import TableGridPicker from './TableGridPicker';

describe('<TableGridPicker />', () => {
  it('calls onSelect with the chosen size', async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    const { user } = render(<TableGridPicker onSelect={onSelect} onClose={onClose} />);

    await user.click(screen.getByLabelText('Insert 2 by 3 table'));

    expect(onSelect).toHaveBeenCalledWith(2, 3);
  });
});

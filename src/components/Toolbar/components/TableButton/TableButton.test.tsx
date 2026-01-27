import { describe, expect, it, vi } from 'vitest';
import { renderWithQuill, screen } from '../../../../test';
import { createQuillMock } from '../../../../test/quill-mock';
import TableButton from './TableButton';

describe('<TableButton />', () => {
  it('inserts a table using the module', async () => {
    const { quill } = createQuillMock();
    const insertTable = vi.fn();
    // @ts-expect-error test override for module lookup
    quill.getModule = vi.fn(() => ({ insertTable }));

    const { user } = renderWithQuill(<TableButton />, quill);

    await user.click(screen.getByTitle('Insert table'));
    await user.click(screen.getByLabelText('Insert 2 by 2 table'));

    expect(insertTable).toHaveBeenCalledWith(2, 2);
  });
});

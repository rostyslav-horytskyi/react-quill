import { describe, expect, it, vi } from 'vitest';
import { renderWithQuill, screen } from '../../../../test';
import { createQuillMock } from '../../../../test/quill-mock';
import TableActions from './TableActions';
import { tableUpInternal } from 'quill-table-up';

describe('<TableActions />', () => {
  it('renders actions when in a table and triggers handlers', async () => {
    const { quill } = createQuillMock();

    const container = document.createElement('div');
    document.body.appendChild(container);
    // @ts-expect-error test override for portal target
    quill.container = container;

    const cellEl = document.createElement('td');
    const inner = document.createElement('div');
    cellEl.appendChild(inner);
    container.appendChild(cellEl);

    const selectionModule = { selectedTds: [{ domNode: inner }] };
    const api = {
      appendRow: vi.fn(),
      appendCol: vi.fn(),
      removeRow: vi.fn(),
      removeCol: vi.fn(),
      deleteTable: vi.fn(),
      getModule: vi.fn((name: string) =>
        name === tableUpInternal.tableSelectionName ? selectionModule : undefined
      ),
    };

    // @ts-expect-error test override for module lookup
    quill.getModule = vi.fn(() => api);

    const { user } = renderWithQuill(<TableActions />, quill);

    await user.click(screen.getByTitle('Insert row above'));
    await user.click(screen.getByTitle('Insert column right'));
    await user.click(screen.getByTitle('Delete table'));

    expect(api.appendRow).toHaveBeenCalled();
    expect(api.appendCol).toHaveBeenCalled();
    expect(api.deleteTable).toHaveBeenCalled();
  });
});

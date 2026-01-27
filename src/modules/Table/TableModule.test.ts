import { describe, expect, it } from 'vitest';
import Quill from 'quill';
import './index';

const createQuill = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const quill = new Quill(container, {
    theme: 'snow',
    modules: {
      toolbar: false,
      'table-up': { full: true },
    },
  });

  return { quill, container };
};

describe('TableModule', () => {
  it('inserts a table', () => {
    const { quill, container } = createQuill();
    const table = quill.getModule('table-up') as { insertTable: (r: number, c: number) => void };

    table.insertTable(2, 2);

    const tableEl = container.querySelector('table');
    expect(tableEl).toBeTruthy();
    expect(tableEl?.querySelectorAll('td,th').length).toBe(4);
  });
});

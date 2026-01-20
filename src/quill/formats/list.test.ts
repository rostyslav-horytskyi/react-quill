import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Quill from 'quill';
import CustomListItem from './list';

const BaseListItem = Quill.import('formats/list') as {
  formats: (node: HTMLElement) => unknown;
};

const createQuill = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const quill = new Quill(container, { theme: 'snow' });
  return { quill, container };
};

describe('CustomListItem', () => {
  beforeEach(() => {
    Quill.register('formats/list', CustomListItem, true);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('exposes custom allowed values', () => {
    const allowedValues = (CustomListItem as unknown as { allowedValues: string[] }).allowedValues;

    expect(allowedValues).toEqual(
      expect.arrayContaining(['upper-alpha', 'lower-roman', 'upper-roman', 'circle'])
    );
  });

  it('sets data-list attribute on create', () => {
    const node = CustomListItem.create('upper-alpha') as HTMLElement;

    expect(node.getAttribute('data-list')).toBe('upper-alpha');
  });

  it('formats prefers data-list attribute', () => {
    const node = CustomListItem.create('lower-roman') as HTMLElement;

    expect(CustomListItem.formats(node)).toBe('lower-roman');
  });

  it('formats falls back to base list format when data-list is missing', () => {
    const node = CustomListItem.create('ordered') as HTMLElement;
    node.removeAttribute('data-list');

    expect(CustomListItem.formats(node)).toBe(BaseListItem.formats(node));
  });

  it('applies custom list values through Quill', () => {
    const { quill } = createQuill();

    quill.setText('Item\n');
    quill.formatLine(0, 1, 'list', 'upper-alpha');

    const formats = quill.getFormat(0, 1);
    const listItem = quill.root.querySelector('li');

    expect(formats.list).toBe('upper-alpha');
    expect(listItem?.getAttribute('data-list')).toBe('upper-alpha');
  });
});

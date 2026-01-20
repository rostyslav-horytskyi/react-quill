import { afterEach, describe, expect, it } from 'vitest';
import Quill from 'quill';
import './ImageResize';

const IMAGE_DATA =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/xcAAwMCAO6u6E8AAAAASUVORK5CYII=';

const createQuill = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const quill = new Quill(container, {
    theme: 'snow',
    modules: {
      toolbar: false,
      imageResize: true,
    },
  });

  return { quill, container };
};

const insertImage = (quill: Quill) => {
  quill.insertEmbed(0, 'image', IMAGE_DATA, 'user');
  return quill.root.querySelector('img') as HTMLImageElement | null;
};

describe('ImageResize module', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('shows UI on image click and hides on outside click', async () => {
    const { quill, container } = createQuill();
    const image = insertImage(quill);

    expect(image).not.toBeNull();

    image?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    const overlay = container.querySelector('.ql-image-resize-overlay') as HTMLElement;
    const toolbar = container.querySelector('.ql-image-toolbar') as HTMLElement;

    expect(overlay.classList.contains('is-hidden')).toBe(false);
    expect(toolbar.classList.contains('is-hidden')).toBe(false);

    // Wait for suppressOutsideClick timer to clear
    await new Promise(resolve => setTimeout(resolve, 10));

    // Click on document body (outside image/overlay/toolbar)
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(overlay.classList.contains('is-hidden')).toBe(true);
    expect(toolbar.classList.contains('is-hidden')).toBe(true);
  });

  it('does not auto-activate UI after image insert (requires explicit click)', async () => {
    const { quill, container } = createQuill();

    quill.insertEmbed(0, 'image', IMAGE_DATA, 'user');

    await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));

    const overlay = container.querySelector('.ql-image-resize-overlay') as HTMLElement;
    const toolbar = container.querySelector('.ql-image-toolbar') as HTMLElement;

    // UI should remain hidden - only shows on explicit image click
    expect(overlay.classList.contains('is-hidden')).toBe(true);
    expect(toolbar.classList.contains('is-hidden')).toBe(true);
  });

  it('hides UI when selection length is greater than 1', async () => {
    const { quill, container } = createQuill();
    const image = insertImage(quill);

    image?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    const overlay = container.querySelector('.ql-image-resize-overlay') as HTMLElement;
    expect(overlay.classList.contains('is-hidden')).toBe(false);

    // Wait for suppressSelectionChange timer (setTimeout(0)) to clear
    await new Promise(resolve => setTimeout(resolve, 10));

    // Manually trigger selection-change with a multi-character selection
    quill.emitter.emit('selection-change', { index: 0, length: 5 }, null, 'user');

    expect(overlay.classList.contains('is-hidden')).toBe(true);
  });

  it('updates caption alt text', () => {
    const { quill, container } = createQuill();
    const image = insertImage(quill);

    image?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    const input = container.querySelector<HTMLInputElement>('.ql-image-caption-input');
    expect(input).not.toBeNull();

    if (input) {
      input.value = 'Example caption';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    expect(image?.getAttribute('alt')).toBe('Example caption');
  });

  it('centers the image via toolbar action', () => {
    const { quill, container } = createQuill();
    const image = insertImage(quill);

    image?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    const centerButton = container.querySelector<HTMLButtonElement>(
      '.ql-image-toolbar-button[data-action="center"]'
    );

    expect(centerButton).not.toBeNull();
    centerButton?.click();

    expect(image?.style.marginLeft).toBe('auto');
    expect(image?.style.marginRight).toBe('auto');
  });

  it('resizes the image using a handle', () => {
    const { quill, container } = createQuill();
    const image = insertImage(quill);

    expect(image).not.toBeNull();

    if (!image) return;

    Object.defineProperty(image, 'getBoundingClientRect', {
      value: () => ({
        top: 0,
        left: 0,
        bottom: 80,
        right: 120,
        width: 120,
        height: 80,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });

    image.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    const handle = container.querySelector('.ql-image-resize-handle--se') as HTMLElement;
    handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0, clientY: 0 }));
    document.dispatchEvent(
      new MouseEvent('mousemove', { bubbles: true, clientX: 40, clientY: 20 })
    );
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    expect(image.getAttribute('width')).toBe('160');
    expect(image.getAttribute('height')).toBe('100');
  });

  it('removes the image via toolbar action', () => {
    const { quill, container } = createQuill();
    const image = insertImage(quill);

    image?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    const removeButton = container.querySelector<HTMLButtonElement>(
      '.ql-image-toolbar-button[data-action="remove"]'
    );

    removeButton?.click();

    expect(container.querySelector('img')).toBeNull();
  });
});

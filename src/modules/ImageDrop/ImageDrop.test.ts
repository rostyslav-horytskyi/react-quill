import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Quill from 'quill';
import './index';

const IMAGE_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/xcAAwMCAO6u6E8AAAAASUVORK5CYII=';

class FileReaderMock {
  public result: string | ArrayBuffer | null = null;
  public onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
  public onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;

  readAsDataURL() {
    this.result = IMAGE_DATA_URL;
    this.onload?.(new Event('load') as ProgressEvent<FileReader>);
  }
}

const createQuill = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const quill = new Quill(container, {
    theme: 'snow',
    modules: {
      toolbar: false,
      imageDrop: true,
    },
  });

  return { quill, container };
};

const docWithCaret = document as Document & {
  caretRangeFromPoint?: (x: number, y: number) => Range | null;
};

const originalFileReader = globalThis.FileReader;
const originalCaretRangeFromPoint = docWithCaret.caretRangeFromPoint;

describe('ImageDrop module', () => {
  beforeEach(() => {
    globalThis.FileReader = FileReaderMock as typeof FileReader;
  });

  afterEach(() => {
    globalThis.FileReader = originalFileReader;
    if (originalCaretRangeFromPoint) {
      docWithCaret.caretRangeFromPoint = originalCaretRangeFromPoint;
    } else {
      delete docWithCaret.caretRangeFromPoint;
    }
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('inserts an image on drop at the caret position', () => {
    const { quill } = createQuill();
    quill.setText('Hello');

    const textNode = quill.root.querySelector('p')?.firstChild as Text;
    const range = document.createRange();
    range.setStart(textNode, 2);
    range.collapse(true);

    docWithCaret.caretRangeFromPoint = vi.fn(() => range);

    const insertSpy = vi.spyOn(quill, 'insertEmbed');
    const selectionSpy = vi.spyOn(quill, 'setSelection');

    const file = new File(['img'], 'photo.png', { type: 'image/png' });
    const dropEvent = new Event('drop', { bubbles: true, cancelable: true }) as DragEvent;
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: { files: [file], clearData: vi.fn() },
    });
    Object.defineProperty(dropEvent, 'clientX', { value: 10 });
    Object.defineProperty(dropEvent, 'clientY', { value: 10 });

    quill.root.dispatchEvent(dropEvent);

    expect(insertSpy).toHaveBeenCalledWith(2, 'image', IMAGE_DATA_URL, 'user');
    expect(selectionSpy).toHaveBeenCalledWith(3, 0);
  });

  it('ignores non-image drops', () => {
    const { quill } = createQuill();
    const insertSpy = vi.spyOn(quill, 'insertEmbed');

    const file = new File(['text'], 'note.txt', { type: 'text/plain' });
    const dropEvent = new Event('drop', { bubbles: true, cancelable: true }) as DragEvent;
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: { files: [file], clearData: vi.fn() },
    });

    quill.root.dispatchEvent(dropEvent);

    expect(insertSpy).not.toHaveBeenCalled();
  });

  it('inserts an image on paste', () => {
    const { quill } = createQuill();
    quill.setSelection(0, 0);

    const insertSpy = vi.spyOn(quill, 'insertEmbed');

    const file = new File(['img'], 'paste.png', { type: 'image/png' });
    const item = {
      type: 'image/png',
      getAsFile: () => file,
    };

    const pasteEvent = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent;
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: { items: [item], getData: vi.fn(() => '') },
    });

    quill.root.dispatchEvent(pasteEvent);

    expect(insertSpy).toHaveBeenCalledWith(0, 'image', IMAGE_DATA_URL, 'user');
  });
});

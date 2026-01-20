import { describe, it, expect, afterEach, vi } from 'vitest';
import type Quill from 'quill';
import CharCounter from './CharCounter.ts';

type QuillMock = {
  container: HTMLElement;
  getText: () => string;
  on: (event: string, callback: () => void) => void;
  off: (event: string, callback: () => void) => void;
};

const createQuillMock = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  let textValue = '';
  let textChangeHandler: (() => void) | undefined;

  const quillMock: QuillMock = {
    container,
    getText: vi.fn(() => textValue),
    on: vi.fn((event, callback) => {
      if (event === 'text-change') {
        textChangeHandler = callback;
      }
    }),
    off: vi.fn(),
  };

  return {
    container,
    quillMock,
    setText: (value: string) => {
      textValue = value;
    },
    triggerTextChange: () => textChangeHandler?.(),
    getTextChangeHandler: () => textChangeHandler,
  };
};

describe('CharCounter', () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.clearAllMocks();
  });

  it('renders count in a provided container and applies limit styles', () => {
    const { quillMock, setText } = createQuillMock();
    const externalContainer = document.createElement('span');
    document.body.appendChild(externalContainer);
    setText('Hello world\n');

    new CharCounter(quillMock as Quill, {
      limit: 9,
      container: externalContainer,
    });

    expect(externalContainer.textContent).toBe('10 / 9 chars');
    expect(externalContainer.classList.contains('ql-char-counter')).toBe(true);
    expect(externalContainer.classList.contains('ql-char-counter-exceed')).toBe(true);
  });

  it('creates a counter element when no container is provided', () => {
    const { quillMock, container, setText } = createQuillMock();
    setText('Hi\n');

    new CharCounter(quillMock as Quill);

    const counter = container.querySelector('.ql-char-counter');

    expect(counter).toBeTruthy();
    expect(counter?.textContent).toBe('2 chars');
  });

  it('updates on text-change and ignores whitespace', () => {
    const { quillMock, setText, triggerTextChange } = createQuillMock();
    const externalContainer = document.createElement('div');

    setText('A B\n');
    new CharCounter(quillMock as Quill, { container: externalContainer });

    expect(externalContainer.textContent).toBe('2 chars');

    setText('A  B C\n');

    triggerTextChange();

    expect(externalContainer.textContent).toBe('3 chars');
  });

  it('removes listener and container on destroy', () => {
    const { quillMock, setText, getTextChangeHandler } = createQuillMock();
    const externalContainer = document.createElement('div');
    document.body.appendChild(externalContainer);
    setText('Hello\n');

    const module = new CharCounter(quillMock as Quill, { container: externalContainer });

    module.destroy();

    expect(quillMock.off).toHaveBeenCalledWith('text-change', getTextChangeHandler());
    expect(externalContainer.isConnected).toBe(false);
  });

  it('toggles exceed class when crossing the limit', () => {
    const { quillMock, setText, triggerTextChange } = createQuillMock();
    const externalContainer = document.createElement('div');
    document.body.appendChild(externalContainer);
    setText('Short\n');

    new CharCounter(quillMock as Quill, { container: externalContainer, limit: 10 });

    expect(externalContainer.classList.contains('ql-char-counter-exceed')).toBe(false);

    setText('This is longer\n');
    triggerTextChange();

    expect(externalContainer.classList.contains('ql-char-counter-exceed')).toBe(true);
  });
});

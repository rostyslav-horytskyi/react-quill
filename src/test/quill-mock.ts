import { vi } from 'vitest';
import type Quill from 'quill';

type Selection = { index: number; length: number } | null;
type FormatState = Record<string, unknown>;

interface QuillMockOptions {
  selection?: Selection;
  formats?: FormatState;
}

export function createQuillMock(options: QuillMockOptions = {}) {
  let currentSelection: Selection = options.selection ?? { index: 0, length: 0 };
  let currentFormats: FormatState = { ...(options.formats ?? {}) };

  const quill = {
    getSelection: vi.fn((_focus?: boolean) => currentSelection),
    setSelection: vi.fn(),
    getFormat: vi.fn(() => ({ ...currentFormats })),
    format: vi.fn((format: string, value: unknown) => {
      if (value === false) {
        delete currentFormats[format];
        return;
      }
      currentFormats[format] = value;
    }),
    insertText: vi.fn(),
    insertEmbed: vi.fn(),
    removeFormat: vi.fn(),
    getLine: vi.fn(() => [{ length: () => 1 }, 0]),
    getIndex: vi.fn(() => 0),
    formatLine: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getText: vi.fn(() => 'Selected text'),
  };

  return {
    quill: quill as unknown as Quill,
    setSelection: (selection: Selection) => {
      currentSelection = selection;
    },
    setFormats: (formats: FormatState) => {
      currentFormats = { ...formats };
    },
  };
}

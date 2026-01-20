import type { RefObject } from 'react';
import type Quill from 'quill';
import type { Delta } from 'quill/core';

export interface EditorProps {
  // Initial content of the editor as a Quill Delta
  defaultValue?: Delta;
  // Whether the editor is read-only
  readOnly?: boolean;
  // Placeholder text when the editor is empty
  placeholder?: string;
  // Theme of the editor, either 'snow' or 'bubble'
  theme?: 'snow' | 'bubble';
  // Additional CSS class for the editor container
  className?: string;
  // Optional container for the character counter module
  charCounterRef?: RefObject<HTMLElement | null>;
  // Optional character limit for the counter display
  charCounterLimit?: number;
  // Callback fired when the text content changes
  onTextChange?: (delta: Delta, oldDelta: Delta, source: string) => void;
  // Callback fired when the selection changes
  onSelectionChange?: (range: Range | null, oldRange: Range | null, source: string) => void;
  // Callback fired when the Quill editor is ready
  onReady?: (quill: Quill) => void;
}

export interface Range {
  index: number;
  length: number;
}

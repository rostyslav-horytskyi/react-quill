import { describe, it, expect } from 'vitest';
import { QuillProvider, useQuill } from './QuillContext.tsx';

describe('Context Index', () => {
  it('should export QuillProvider', () => {
    expect(QuillProvider).toBeDefined();
    expect(typeof QuillProvider).toBe('function');
  });

  it('should export useQuill', () => {
    expect(useQuill).toBeDefined();
    expect(typeof useQuill).toBe('function');
  });
});

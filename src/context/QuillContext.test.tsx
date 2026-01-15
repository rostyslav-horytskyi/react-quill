import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { expect, describe, it } from 'vitest';
import { QuillProvider, useQuill } from './QuillContext';
import Quill from 'quill';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QuillProvider>{children}</QuillProvider>
);

describe('QuillContext', () => {
  it('should throw an error when useQuill is used outside of QuillProvider', () => {
    expect(() => renderHook(() => useQuill())).toThrowError(
      'useQuill must be used within a QuillProvider'
    );
  });

  it('should expose default values when used within QuillProvider', () => {
    const { result } = renderHook(() => useQuill(), { wrapper });

    expect(result.current.quill).toBeNull();
    expect(result.current.formats).toEqual({});
    expect(typeof result.current.refreshFormats).toBe('function');
    expect(typeof result.current.setQuill).toBe('function');
  });

  it('should provide quill instance and formats when used within QuillProvider', () => {
    const quillInstance = new Quill(document.createElement('div'));

    const { result } = renderHook(() => useQuill(), { wrapper });

    // Initially, quill should be null and formats should be empty
    expect(result.current.quill).toBeNull();
    expect(result.current.formats).toEqual({});

    // Simulate setting the quill instance
    act(() => {
      result.current.setQuill(quillInstance);
    });

    // Now, quill should be the instance we set
    expect(result.current.quill).toBe(quillInstance);
  });

  it('should refresh formats correctly', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const quillInstance = new Quill(container);

    const { result } = renderHook(() => useQuill(), { wrapper });

    act(() => {
      result.current.setQuill(quillInstance);
    });

    expect(result.current.formats).toEqual({});

    // Insert text and create a selection before formatting
    quillInstance.setText('Hello');
    quillInstance.setSelection(0, 5);
    quillInstance.format('bold', true);

    act(() => {
      result.current.refreshFormats();
    });

    expect(result.current.formats).toHaveProperty('bold', true);

    document.body.removeChild(container);
  });

  it('should update formats', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const quillInstance = new Quill(container);

    const { result } = renderHook(() => useQuill(), { wrapper });

    act(() => {
      result.current.setQuill(quillInstance);
    });

    quillInstance.setText('Hello World');
    quillInstance.setSelection(0, 5);
    quillInstance.format('italic', true);

    await waitFor(() => {
      expect(result.current.formats).toHaveProperty('italic', true);
    }).finally(() => {
      document.body.removeChild(container);
    });
  });

  it('should remove event listeners on unmount', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const quillInstance = new Quill(container);

    const { result, unmount } = renderHook(() => useQuill(), { wrapper });

    act(() => {
      result.current.setQuill(quillInstance);
    });

    const offSpy = vi.spyOn(quillInstance, 'off');

    unmount();

    expect(offSpy).toHaveBeenCalledWith('selection-change', expect.any(Function));
    expect(offSpy).toHaveBeenCalledWith('text-change', expect.any(Function));

    document.body.removeChild(container);
  });

  it('should handle null selection in refreshFormats', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const quillInstance = new Quill(container);

    const { result } = renderHook(() => useQuill(), { wrapper });

    act(() => {
      result.current.setQuill(quillInstance);
    });

    quillInstance.setSelection(null);

    act(() => {
      result.current.refreshFormats();
    });

    expect(result.current.formats).toEqual({});

    document.body.removeChild(container);
  });
});

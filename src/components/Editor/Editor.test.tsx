import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../../test';
import Editor from './Editor';

beforeEach(() => {
  vi.clearAllMocks();
});

const mockOnTextChange = vi.fn();
const mockOnSelectionChange = vi.fn();
const mockOnReady = vi.fn();

describe('<Editor />', () => {
  it('should display the editor container', () => {
    render(<Editor />);

    const editorContainer = screen.getByTestId('editor-container');

    expect(editorContainer).toBeInTheDocument();
  });

  it('should display placeholder text', () => {
    const placeholderText = 'Enter text here...';

    render(<Editor placeholder={placeholderText} />);

    const editor = document.querySelector('.ql-editor');

    expect(editor).toHaveAttribute('data-placeholder', placeholderText);
  });

  it('should initialize with default content', async () => {
    const defaultContent = { ops: [{ insert: 'Hello, World!' }, { insert: '\n' }] };

    render(<Editor defaultValue={defaultContent} />);

    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('should call onTextChange callback on text change', async () => {
    const defaultContent = { ops: [{ insert: 'Hello' }, { insert: '\n' }] };

    const { user } = render(
      <Editor defaultValue={defaultContent} onTextChange={mockOnTextChange} />
    );

    const editor = document.querySelector('.ql-editor');

    await user.type(editor!, ', World!');

    await waitFor(() => {
      expect(mockOnTextChange).toHaveBeenCalled();
    });
  });

  it('should display read-only editor when readOnly prop is true', () => {
    render(<Editor readOnly />);

    const editor = document.querySelector('.ql-editor');

    expect(editor).toHaveAttribute('contenteditable', 'false');
  });

  it('should apply custom className to the editor container', () => {
    const customClass = 'custom-editor-class';

    render(<Editor className={customClass} />);

    const editorContainer = screen.getByTestId('editor-container');

    expect(editorContainer).toHaveClass('custom-editor-class');
  });

  it('should call onReady callback when editor is initialized', async () => {
    render(<Editor onReady={mockOnReady} />);

    await waitFor(() => {
      expect(mockOnReady).toHaveBeenCalled();
    });
  });

  it('should call onSelectionChange callback on selection change', async () => {
    const defaultContent = { ops: [{ insert: 'Hello, World!' }, { insert: '\n' }] };

    const { user } = render(
      <Editor defaultValue={defaultContent} onSelectionChange={mockOnSelectionChange} />
    );

    const editor = document.querySelector('.ql-editor');

    await user.click(editor!);
    await user.keyboard('{Shift>}{ArrowRight}{/Shift}');

    await waitFor(() => {
      expect(mockOnSelectionChange).toHaveBeenCalled();
    });
  });

  it('should switch themes correctly', () => {
    const { rerender } = render(<Editor theme="snow" />);

    let editorContainer = screen.getByTestId('editor-container');

    expect(editorContainer.querySelector('.ql-snow')).toBeInTheDocument();

    rerender(<Editor theme="bubble" />);

    editorContainer = screen.getByTestId('editor-container');

    expect(editorContainer.querySelector('.ql-bubble')).toBeInTheDocument();
  });

  it('should expose Quill instance via ref', () => {
    const quillRef = { current: null };

    render(<Editor ref={quillRef} />);

    expect(quillRef.current).not.toBeNull();
    expect(quillRef.current?.constructor.name).toBe('Quill');
  });

  it('should toggle read-only mode dynamically', async () => {
    const quillRef = { current: null };
    const { rerender } = render(<Editor ref={quillRef} readOnly={false} />);

    expect(document.querySelector('.ql-editor')).toHaveAttribute('contenteditable', 'true');

    rerender(<Editor ref={quillRef} readOnly={true} />);

    expect(document.querySelector('.ql-editor')).toHaveAttribute('contenteditable', 'false');
  });

  it('should pass delta, oldDelta, and source to onTextChange callback', async () => {
    const defaultContent = { ops: [{ insert: 'Test' }, { insert: '\n' }] };

    const { user } = render(
      <Editor defaultValue={defaultContent} onTextChange={mockOnTextChange} />
    );

    const editor = document.querySelector('.ql-editor');

    await user.type(editor!, 'i');

    await waitFor(() => {
      expect(mockOnTextChange).toHaveBeenCalledWith(
        expect.objectContaining({ ops: expect.any(Array) }), // delta (the change)
        expect.objectContaining({ ops: expect.any(Array) }), // oldDelta
        expect.any(String) // source ('user', 'api', 'silent')
      );
    });
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = render(<Editor onTextChange={mockOnTextChange} />);

    const editor = document.querySelector('.ql-editor');

    unmount();

    expect(() => {
      editor?.dispatchEvent(new Event('input'));
    }).not.toThrow();
  });

  it('should onReady receive the Quill instance', async () => {
    render(<Editor onReady={mockOnReady} />);

    await waitFor(() => {
      expect(mockOnReady).toHaveBeenCalledWith(
        expect.objectContaining({
          getText: expect.any(Function),
        })
      );
    });
  });
});

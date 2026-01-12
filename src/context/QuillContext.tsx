import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type Quill from 'quill';
import type { EditorFormats } from '../hooks';

interface QuillContextValue {
  quill: Quill | null;
  setQuill: (quill: Quill | null) => void;
  formats: EditorFormats;
  refreshFormats: () => void;
}

const QuillContext = createContext<QuillContextValue | null>(null);

interface QuillProviderProps {
  children: React.ReactNode;
}

export function QuillProvider({ children }: QuillProviderProps) {
  const [quill, setQuill] = useState<Quill | null>(null);
  const [formats, setFormats] = useState<EditorFormats>({});

  const refreshFormats = useCallback(() => {
    if (!quill) return;
    const range = quill.getSelection();
    if (range) {
      setFormats(quill.getFormat(range.index, range.length) as EditorFormats);
    } else {
      setFormats(quill.getFormat() as EditorFormats);
    }
  }, [quill]);

  // Listen to quill events for automatic format updates
  useEffect(() => {
    if (!quill) return;

    const handleSelectionChange = (range: { index: number; length: number } | null) => {
      if (range) {
        setFormats(quill.getFormat(range.index, range.length) as EditorFormats);
      } else {
        setFormats({});
      }
    };

    const handleTextChange = () => {
      const range = quill.getSelection();
      if (range) {
        setFormats(quill.getFormat(range.index, range.length) as EditorFormats);
      }
    };

    quill.on('selection-change', handleSelectionChange);
    quill.on('text-change', handleTextChange);

    // Initial format check - reuse handler to avoid direct setState in effect
    handleSelectionChange(quill.getSelection());

    return () => {
      quill.off('selection-change', handleSelectionChange);
      quill.off('text-change', handleTextChange);
    };
  }, [quill]);

  const value = useMemo(
    () => ({
      quill,
      setQuill,
      formats,
      refreshFormats,
    }),
    [quill, formats, refreshFormats]
  );

  return <QuillContext.Provider value={value}>{children}</QuillContext.Provider>;
}

export function useQuill() {
  const context = useContext(QuillContext);
  if (!context) {
    throw new Error('useQuill must be used within a QuillProvider');
  }
  return context;
}

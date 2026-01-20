import { useEffect, type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuillProvider, useQuill } from '../context';
import type Quill from 'quill';

// Custom render that wraps components with QuillProvider
function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: ({ children }) => <QuillProvider>{children}</QuillProvider>,
      ...options,
    }),
  };
}

function QuillSetter({ quill, children }: { quill: Quill; children: ReactNode }) {
  const { setQuill } = useQuill();

  useEffect(() => {
    setQuill(quill);
    return () => setQuill(null);
  }, [quill, setQuill]);

  return <>{children}</>;
}

function renderWithQuill(ui: ReactElement, quill: Quill, options?: Omit<RenderOptions, 'wrapper'>) {
  return customRender(<QuillSetter quill={quill}>{ui}</QuillSetter>, options);
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render with custom render
export { customRender as render, renderWithQuill };

import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent, renderWithQuill } from '../../../../test';
import CodeBlockDropdown from './CodeBlockDropdown.tsx';
import { LANGUAGE_OPTIONS } from '../../../../quill/modules/syntax.ts';
import { createQuillMock } from '../../../../test/quill-mock.ts';

describe('<CodeBlockDropdown />', () => {
  it('should display the dropdown', () => {
    render(<CodeBlockDropdown />);

    fireEvent.click(screen.getByTitle('Select language'));

    expect(screen.getByTestId('code-block-dropdown-menu')).toBeInTheDocument();
  });

  it.each(LANGUAGE_OPTIONS)('should select language option: %s', option => {
    const { quill } = createQuillMock({ selection: { index: 0, length: 0 } });

    renderWithQuill(<CodeBlockDropdown />, quill);

    fireEvent.click(screen.getByTitle('Select language'));
    fireEvent.click(screen.getByText(option.label));

    expect(quill.format).toHaveBeenCalledWith(
      'code-block',
      option.value === 'plain' ? true : option.value
    );
    expect(screen.queryByTestId('code-block-dropdown-menu')).not.toBeInTheDocument();
  });
});

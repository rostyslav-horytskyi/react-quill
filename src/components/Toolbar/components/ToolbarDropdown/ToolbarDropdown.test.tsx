import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../../test';
import ToolbarDropdown, { type DropdownOption } from './ToolbarDropdown';

const options: DropdownOption<string>[] = [
  { value: 'one', icon: <span>One</span> },
  { value: 'two', icon: <span>Two</span> },
];

describe('<ToolbarDropdown />', () => {
  it('opens and closes on outside click', () => {
    render(
      <ToolbarDropdown
        options={options}
        value="one"
        onChange={vi.fn()}
        data-testid="toolbar-dropdown"
      />
    );

    const trigger = screen.getByTestId('toolbar-dropdown').querySelector('button');
    fireEvent.click(trigger!);

    expect(screen.getByTestId('toolbar-dropdown-menu')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    fireEvent.mouseUp(document.body);

    expect(screen.queryByTestId('toolbar-dropdown-menu')).not.toBeInTheDocument();
  });

  it('calls onChange and closes after selecting an option', () => {
    const onChange = vi.fn();

    render(
      <ToolbarDropdown
        options={options}
        value="one"
        onChange={onChange}
        data-testid="toolbar-dropdown"
      />
    );

    const trigger = screen.getByTestId('toolbar-dropdown').querySelector('button');
    fireEvent.click(trigger!);

    const menu = screen.getByTestId('toolbar-dropdown-menu');
    const optionButton = menu.querySelectorAll('button')[1];

    fireEvent.click(optionButton);

    expect(onChange).toHaveBeenCalledWith('two');
    expect(screen.queryByTestId('toolbar-dropdown-menu')).not.toBeInTheDocument();
  });
});

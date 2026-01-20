import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../../test';
import SplitButtonDropdown from './SplitButtonDropdown';

const options = [
  { value: 'ordered', label: 'Ordered' },
  { value: 'bullet', label: 'Bullet' },
];

describe('<SplitButtonDropdown />', () => {
  it('opens and closes on outside click', () => {
    render(
      <SplitButtonDropdown
        icon={<span>Icon</span>}
        options={options}
        onButtonClick={vi.fn()}
        onOptionSelect={vi.fn()}
        data-testid="split-dropdown"
      />
    );

    const buttons = screen.getByTestId('split-dropdown').querySelectorAll('button');
    fireEvent.click(buttons[1]);

    expect(screen.getByText('Ordered')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    fireEvent.mouseUp(document.body);

    expect(screen.queryByText('Ordered')).not.toBeInTheDocument();
  });

  it('calls onOptionSelect and closes on selection', () => {
    const onOptionSelect = vi.fn();

    render(
      <SplitButtonDropdown
        icon={<span>Icon</span>}
        options={options}
        onButtonClick={vi.fn()}
        onOptionSelect={onOptionSelect}
        data-testid="split-dropdown"
      />
    );

    const buttons = screen.getByTestId('split-dropdown').querySelectorAll('button');
    fireEvent.click(buttons[1]);

    const option = screen.getByText('Bullet');
    fireEvent.click(option);

    expect(onOptionSelect).toHaveBeenCalledWith('bullet');
    expect(screen.queryByText('Bullet')).not.toBeInTheDocument();
  });
});

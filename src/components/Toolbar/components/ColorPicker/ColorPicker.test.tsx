import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../../../../test';
import ColorPicker from './ColorPicker';

describe('<ColorPicker />', () => {
  it('should clear color and closes the menu', async () => {
    const onColorSelect = vi.fn();
    const { user } = render(
      <ColorPicker
        icon={<span>icon</span>}
        title="Text color"
        currentColor="#000000"
        onColorSelect={onColorSelect}
        colors={['#000000']}
      />
    );

    await user.click(screen.getByTitle('Text color'));
    await user.click(screen.getByRole('button', { name: 'Clear color' }));

    expect(onColorSelect).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('button', { name: 'Clear color' })).not.toBeInTheDocument();
  });

  it('should treat transparent as a clear action', async () => {
    const onColorSelect = vi.fn();
    const { user } = render(
      <ColorPicker
        icon={<span>icon</span>}
        title="Highlight"
        currentColor={undefined}
        onColorSelect={onColorSelect}
        colors={['transparent', '#ffffff']}
        showColorBar={false}
      />
    );

    await user.click(screen.getByTitle('Highlight'));
    await user.click(screen.getByTitle('transparent'));

    expect(onColorSelect).toHaveBeenCalledWith(false);
  });
});

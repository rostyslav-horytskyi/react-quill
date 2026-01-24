import { describe, expect, it } from 'vitest';
import { render, screen } from '../../test';
import Tabs from './Tabs';

describe('<Tabs />', () => {
  const tabs = [
    { id: 'first', label: 'First' },
    { id: 'second', label: 'Second' },
  ];

  it('should default to the first tab when no default is provided', () => {
    render(
      <Tabs tabs={tabs}>
        <div>First content</div>
        <div>Second content</div>
      </Tabs>
    );

    expect(screen.getByText('First content')).toBeInTheDocument();
    expect(screen.queryByText('Second content')).not.toBeInTheDocument();
  });

  it('should respect a default tab and switches on click', async () => {
    const { user } = render(
      <Tabs tabs={tabs} defaultTab="second">
        <div>First content</div>
        <div>Second content</div>
      </Tabs>
    );

    expect(screen.getByText('Second content')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'First' }));

    expect(screen.getByText('First content')).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '../../test';
import Toolbar from './Toolbar';

describe('<Toolbar />', () => {
  describe('Basic Rendering', () => {
    it('should display the toolbar', () => {
      render(<Toolbar />);

      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('should contain heading dropdown', () => {
      render(<Toolbar />);

      expect(screen.getByTestId('heading-dropdown')).toBeInTheDocument();
    });

    it('should contain alignment dropdown', () => {
      render(<Toolbar />);

      expect(screen.getByTestId('alignment-dropdown')).toBeInTheDocument();
    });

    it('should contain ordered list dropdown', () => {
      render(<Toolbar />);

      expect(screen.getByTestId('ordered-list-dropdown')).toBeInTheDocument();
    });

    it('should contain unordered list dropdown', () => {
      render(<Toolbar />);

      expect(screen.getByTestId('unordered-list-dropdown')).toBeInTheDocument();
    });
  });

  describe('Format Buttons', () => {
    it('should contain bold button', () => {
      render(<Toolbar />);

      expect(screen.getByTitle('Bold (Ctrl+B)')).toBeInTheDocument();
    });

    it('should contain italic button', () => {
      render(<Toolbar />);

      expect(screen.getByTitle('Italic (Ctrl+I)')).toBeInTheDocument();
    });

    it('should contain underline button', () => {
      render(<Toolbar />);

      expect(screen.getByTitle('Underline (Ctrl+U)')).toBeInTheDocument();
    });

    it('should contain strikethrough button', () => {
      render(<Toolbar />);

      expect(screen.getByTitle('Strikethrough')).toBeInTheDocument();
    });
  });

  describe('Block Buttons', () => {
    it('should contain quote button', () => {
      render(<Toolbar />);

      expect(screen.getByTitle('Quote')).toBeInTheDocument();
    });

    it('should contain code block button', () => {
      render(<Toolbar />);

      expect(screen.getByTitle('Code block')).toBeInTheDocument();
    });

    it('should contain divider button', () => {
      render(<Toolbar />);

      expect(screen.getByTitle('Divider')).toBeInTheDocument();
    });
  });

  describe('Insert Buttons', () => {
    it('should contain link button', () => {
      render(<Toolbar />);

      expect(screen.getByTitle('Insert link')).toBeInTheDocument();
    });

    it('should contain image button', () => {
      render(<Toolbar />);

      expect(screen.getByTitle('Insert image')).toBeInTheDocument();
    });
  });

  describe('Color Buttons', () => {
    it('should contain text color button', () => {
      render(<Toolbar />);

      expect(screen.getByTitle('Text color')).toBeInTheDocument();
    });

    it('should contain highlight button', () => {
      render(<Toolbar />);

      expect(screen.getByTitle('Highlight')).toBeInTheDocument();
    });
  });

  describe('Clear Format Button', () => {
    it('should contain clear formatting button', () => {
      render(<Toolbar />);

      expect(screen.getByTitle('Clear formatting')).toBeInTheDocument();
    });
  });

  describe('Heading Dropdown', () => {
    it('should open dropdown when clicked', async () => {
      const { user } = render(<Toolbar />);

      const dropdown = screen.getByTestId('heading-dropdown');
      const trigger = dropdown.querySelector('button');

      expect(trigger).toBeInTheDocument();

      await user.click(trigger!);

      const dropdownMenu = screen.getByTestId('toolbar-dropdown-menu');

      expect(dropdownMenu).toBeInTheDocument();
    });

    it('should display 5 heading options (H1-H4 and normal text)', async () => {
      const { user } = render(<Toolbar />);

      const dropdown = screen.getByTestId('heading-dropdown');
      const trigger = dropdown.querySelector('button');
      await user.click(trigger!);

      const options = dropdown.querySelectorAll('.absolute button');
      expect(options).toHaveLength(5);
    });

    it('should close dropdown after selecting an option', async () => {
      const { user } = render(<Toolbar />);

      const dropdown = screen.getByTestId('heading-dropdown');
      const trigger = dropdown.querySelector('button');
      await user.click(trigger!);

      const options = dropdown.querySelectorAll('.absolute button');
      await user.click(options[0]);

      const dropdownMenu = dropdown.querySelector('.absolute');
      expect(dropdownMenu).not.toBeInTheDocument();
    });
  });

  describe('Alignment Dropdown', () => {
    it('should open dropdown when clicked', async () => {
      const { user } = render(<Toolbar />);

      const dropdown = screen.getByTestId('alignment-dropdown');
      const trigger = dropdown.querySelector('button');
      await user.click(trigger!);

      const dropdownMenu = dropdown.querySelector('.absolute');
      expect(dropdownMenu).toBeInTheDocument();
    });

    it('should display 4 alignment options (left, center, right, justify)', async () => {
      const { user } = render(<Toolbar />);

      const dropdown = screen.getByTestId('alignment-dropdown');
      const trigger = dropdown.querySelector('button');
      await user.click(trigger!);

      const options = dropdown.querySelectorAll('.absolute button');
      expect(options).toHaveLength(4);
    });
  });

  describe('Ordered List Dropdown', () => {
    it('should render the ordered list dropdown', () => {
      render(<Toolbar />);

      const dropdown = screen.getByTestId('ordered-list-dropdown');
      expect(dropdown).toBeInTheDocument();
    });

    it('should have two buttons (main button and dropdown toggle)', () => {
      render(<Toolbar />);

      const dropdown = screen.getByTestId('ordered-list-dropdown');
      const buttons = dropdown.querySelectorAll('button');
      expect(buttons).toHaveLength(2);
    });

    it('should open dropdown when clicking the chevron button', async () => {
      const { user } = render(<Toolbar />);

      const dropdown = screen.getByTestId('ordered-list-dropdown');
      const buttons = dropdown.querySelectorAll('button');
      const chevronButton = buttons[1];

      await user.click(chevronButton);

      const dropdownMenu = dropdown.querySelector('.absolute');
      expect(dropdownMenu).toBeInTheDocument();
    });

    it('should display 6 ordered list style options', async () => {
      const { user } = render(<Toolbar />);

      const dropdown = screen.getByTestId('ordered-list-dropdown');
      const buttons = dropdown.querySelectorAll('button');
      const chevronButton = buttons[1];

      await user.click(chevronButton);

      const options = dropdown.querySelectorAll('.absolute button');
      expect(options).toHaveLength(6);
    });

    it('should display correct list style labels', async () => {
      const { user } = render(<Toolbar />);

      const dropdown = screen.getByTestId('ordered-list-dropdown');
      const buttons = dropdown.querySelectorAll('button');
      await user.click(buttons[1]);

      const dropdownMenu = within(dropdown);
      expect(dropdownMenu.getByText('Default')).toBeInTheDocument();
      expect(dropdownMenu.getByText('Lower Alpha')).toBeInTheDocument();
      expect(dropdownMenu.getByText('Upper Alpha')).toBeInTheDocument();
      expect(dropdownMenu.getByText('Lower Roman')).toBeInTheDocument();
      expect(dropdownMenu.getByText('Upper Roman')).toBeInTheDocument();
      expect(dropdownMenu.getByText('Lower Greek')).toBeInTheDocument();
    });
  });

  describe('Unordered List Dropdown', () => {
    it('should render the unordered list dropdown', () => {
      render(<Toolbar />);

      const dropdown = screen.getByTestId('unordered-list-dropdown');
      expect(dropdown).toBeInTheDocument();
    });

    it('should have two buttons (main button and dropdown toggle)', () => {
      render(<Toolbar />);

      const dropdown = screen.getByTestId('unordered-list-dropdown');
      const buttons = dropdown.querySelectorAll('button');
      expect(buttons).toHaveLength(2);
    });

    it('should open dropdown when clicking the chevron button', async () => {
      const { user } = render(<Toolbar />);

      const dropdown = screen.getByTestId('unordered-list-dropdown');
      const buttons = dropdown.querySelectorAll('button');
      const chevronButton = buttons[1];

      await user.click(chevronButton);

      const dropdownMenu = dropdown.querySelector('.absolute');
      expect(dropdownMenu).toBeInTheDocument();
    });

    it('should display 4 unordered list style options', async () => {
      const { user } = render(<Toolbar />);

      const dropdown = screen.getByTestId('unordered-list-dropdown');
      const buttons = dropdown.querySelectorAll('button');
      await user.click(buttons[1]);

      const options = dropdown.querySelectorAll('.absolute button');
      expect(options).toHaveLength(4);
    });

    it('should display correct list style labels', async () => {
      const { user } = render(<Toolbar />);

      const dropdown = screen.getByTestId('unordered-list-dropdown');
      const buttons = dropdown.querySelectorAll('button');
      await user.click(buttons[1]);

      const dropdownMenu = within(dropdown);
      expect(dropdownMenu.getByText('Default')).toBeInTheDocument();
      expect(dropdownMenu.getByText('Circle')).toBeInTheDocument();
      expect(dropdownMenu.getByText('Disc')).toBeInTheDocument();
      expect(dropdownMenu.getByText('Square')).toBeInTheDocument();
    });
  });

  describe('Dropdown Close on Outside Click', () => {
    it('should close heading dropdown when clicking outside', async () => {
      const { user } = render(<Toolbar />);

      const dropdown = screen.getByTestId('heading-dropdown');
      const trigger = dropdown.querySelector('button');
      await user.click(trigger!);

      expect(dropdown.querySelector('.absolute')).toBeInTheDocument();

      // Click outside (on the toolbar itself)
      await user.click(screen.getByRole('toolbar'));

      expect(dropdown.querySelector('.absolute')).not.toBeInTheDocument();
    });

    it('should close alignment dropdown when clicking outside', async () => {
      const { user } = render(<Toolbar />);

      const dropdown = screen.getByTestId('alignment-dropdown');
      const trigger = dropdown.querySelector('button');
      await user.click(trigger!);

      expect(dropdown.querySelector('.absolute')).toBeInTheDocument();

      await user.click(screen.getByRole('toolbar'));

      expect(dropdown.querySelector('.absolute')).not.toBeInTheDocument();
    });
  });
});

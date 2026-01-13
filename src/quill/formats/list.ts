import Quill from 'quill';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ListItem = Quill.import('formats/list') as any;

// Extend allowed list types
const ALLOWED_VALUES = [
  'ordered',
  'bullet',
  'lower-alpha',
  'upper-alpha',
  'lower-roman',
  'upper-roman',
  'lower-greek',
  'circle',
  'disc',
  'square',
];

class CustomListItem extends ListItem {
  static create(value: string) {
    const node = super.create(value) as HTMLElement;
    node.setAttribute('data-list', value);
    return node;
  }

  static formats(node: HTMLElement) {
    return node.getAttribute('data-list') || super.formats(node);
  }

  // Override to allow custom values
  static register() {
    // This enables custom values to be accepted
  }
}

// Set allowed values
(CustomListItem as unknown as { allowedValues: string[] }).allowedValues = ALLOWED_VALUES;

export default CustomListItem;

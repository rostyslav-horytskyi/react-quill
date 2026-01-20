import Quill from 'quill';

const Font = Quill.import('formats/font') as {
  whitelist: string[];
};

// 10 most popular fonts
Font.whitelist = [
  'arial',
  'times-new-roman',
  'georgia',
  'verdana',
  'courier-new',
  'trebuchet-ms',
  'garamond',
  'palatino',
  'tahoma',
  'impact',
];

Quill.register('formats/font', Font, true);

export const FONT_OPTIONS = [
  { value: false, label: 'Default' },
  { value: 'arial', label: 'Arial' },
  { value: 'times-new-roman', label: 'Times New Roman' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'verdana', label: 'Verdana' },
  { value: 'courier-new', label: 'Courier New' },
  { value: 'trebuchet-ms', label: 'Trebuchet MS' },
  { value: 'garamond', label: 'Garamond' },
  { value: 'palatino', label: 'Palatino' },
  { value: 'tahoma', label: 'Tahoma' },
  { value: 'impact', label: 'Impact' },
] as const;

export type FontValue = (typeof FONT_OPTIONS)[number]['value'];

export default Font;

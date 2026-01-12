export interface EditorFormats {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  list?: 'bullet' | 'ordered';
  align?: string | false;
  blockquote?: boolean;
  'code-block'?: boolean;
  link?: string;
  header?: number | false;
  color?: string;
  background?: string;
}

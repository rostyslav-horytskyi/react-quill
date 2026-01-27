export interface EditorFormats {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  font?:
    | 'arial'
    | 'times-new-roman'
    | 'georgia'
    | 'verdana'
    | 'courier-new'
    | 'trebuchet-ms'
    | 'garamond'
    | 'palatino'
    | 'tahoma'
    | 'impact'
    | false;
  list?:
    | 'bullet'
    | 'ordered'
    | 'lower-alpha'
    | 'upper-alpha'
    | 'lower-roman'
    | 'upper-roman'
    | 'lower-greek'
    | 'circle'
    | 'disc'
    | 'square';
  align?: string | false;
  blockquote?: boolean;
  'code-block'?: string | boolean;
  link?: string;
  header?: number | false;
  color?: string;
  background?: string;
  table?: string;
  row?: string;
  col?: string;
  tableHeader?: 'row' | 'col';
}

import Quill from 'quill';
import MentionModule from './MentionModule';
import MentionBlot from '../../quill/formats/mention';

Quill.register('formats/mention', MentionBlot, true);
Quill.register('modules/mention', MentionModule);

export { MentionModule };

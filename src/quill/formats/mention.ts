import Quill from 'quill';
import type { MentionEntity } from '../../modules/Mention/types';

const Embed = Quill.import('blots/embed');

// @ts-expect-error Extending Embed without constructor
class MentionBlot extends Embed {
  static blotName = 'mention';
  static tagName = 'span';
  static className = 'ql-mention';

  static create(data: MentionEntity) {
    const node = super.create() as HTMLElement;
    const display = data.value || `@${data.label}`;

    node.setAttribute('contenteditable', 'false');
    node.setAttribute('data-id', data.id);
    node.setAttribute('data-label', data.label);

    if (data.value) {
      node.setAttribute('data-value', data.value);
    }
    if (data.avatarUrl) {
      node.setAttribute('data-avatar', data.avatarUrl);
    }

    if (data.avatarUrl) {
      const avatar = document.createElement('img');
      avatar.src = data.avatarUrl;
      avatar.alt = data.label;
      avatar.className = 'ql-mention-avatar';
      node.appendChild(avatar);
    }

    const label = document.createElement('span');
    label.className = 'ql-mention-label';
    label.textContent = display;
    node.appendChild(label);

    return node;
  }

  static value(node: HTMLElement): MentionEntity {
    return {
      id: node.getAttribute('data-id') || '',
      label: node.getAttribute('data-label') || node.textContent || '',
      value: node.getAttribute('data-value') || undefined,
      avatarUrl: node.getAttribute('data-avatar') || undefined,
    };
  }
}

export default MentionBlot;
export type { MentionEntity };

import { describe, expect, it } from 'vitest';
import MentionBlot from './mention';

describe('MentionBlot', () => {
  it('creates a mention chip with data attributes', () => {
    const data = {
      id: 'u1',
      label: 'Alice Johnson',
      value: '@alice',
      avatarUrl: 'https://example.com/alice.png',
    };

    const node = MentionBlot.create(data) as HTMLElement;

    expect(node.getAttribute('data-id')).toBe('u1');
    expect(node.getAttribute('data-label')).toBe('Alice Johnson');
    expect(node.getAttribute('data-value')).toBe('@alice');
    expect(node.getAttribute('data-avatar')).toBe('https://example.com/alice.png');
    expect(node.querySelector('.ql-mention-label')?.textContent).toBe('@alice');
  });

  it('returns mention data from node attributes', () => {
    const data = {
      id: 'u2',
      label: 'Ben Carter',
    };

    const node = MentionBlot.create(data) as HTMLElement;

    expect(MentionBlot.value(node)).toEqual({
      id: 'u2',
      label: 'Ben Carter',
      value: undefined,
      avatarUrl: undefined,
    });
  });
});

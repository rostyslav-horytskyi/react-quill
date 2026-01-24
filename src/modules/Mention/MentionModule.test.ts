import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Quill from 'quill';
import './index';

const items = [
  { id: '1', label: 'Alice', value: '@alice' },
  { id: '2', label: 'Bob', value: '@bob' },
  { id: '3', label: 'Charlie', value: '@charlie' },
];

const createQuill = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const quill = new Quill(container, {
    theme: 'snow',
    modules: {
      toolbar: false,
      mention: {
        minChars: 0,
        source: (query: string) => {
          const q = query.toLowerCase();
          return items.filter(item => {
            const label = item.label.toLowerCase();
            const value = (item.value ?? '').toLowerCase();
            return label.includes(q) || value.includes(q);
          });
        },
      },
    },
  });

  return { quill, container };
};

describe('MentionModule', () => {
  let quill: Quill;
  let container: HTMLElement;
  let rafSpy: ReturnType<typeof vi.spyOn> | null = null;
  let cafSpy: ReturnType<typeof vi.spyOn> | null = null;

  beforeEach(() => {
    vi.useFakeTimers();
    rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(callback => window.setTimeout(() => callback(0), 0));
    cafSpy = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(handle => window.clearTimeout(handle));

    ({ quill, container } = createQuill());
  });

  afterEach(() => {
    const mentionModule = quill.getModule('mention') as { destroy: () => void } | undefined;
    mentionModule?.destroy();
    container.remove();
    rafSpy?.mockRestore();
    cafSpy?.mockRestore();
    vi.useRealTimers();
  });

  it('should open suggestions on @ in the empty editor', async () => {
    quill.insertText(0, '@', Quill.sources.USER);
    quill.setSelection(1, 0, Quill.sources.USER);
    await vi.runAllTimersAsync();
    await Promise.resolve();

    const list = container.querySelector('.ql-mention-list');
    const items = container.querySelectorAll('.ql-mention-item');

    expect(list).toBeTruthy();
    expect(items.length).toBe(3);
  });

  it('should insert first mention suggestion on Enter', async () => {
    quill.insertText(0, '@', Quill.sources.USER);
    quill.setSelection(1, 0, Quill.sources.USER);
    await vi.runAllTimersAsync();
    await Promise.resolve();

    const list = container.querySelector('.ql-mention-list');
    expect(list).toBeTruthy();

    quill.root.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      })
    );

    await vi.runAllTimersAsync();
    await Promise.resolve();

    const contents = quill.getContents();

    expect(contents.ops?.[0]).toEqual({
      insert: { mention: { id: '1', label: 'Alice', value: '@alice' } },
    });
  });

  it('should navigate suggestions with ArrowDown and ArrowUp', async () => {
    quill.insertText(0, '@', Quill.sources.USER);
    quill.setSelection(1, 0, Quill.sources.USER);
    await vi.runAllTimersAsync();
    await Promise.resolve();

    const items = container.querySelectorAll('.ql-mention-item');

    expect(items.length).toBe(3);
    expect(items[0].classList).toContain('is-active');

    quill.root.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      })
    );

    await vi.runAllTimersAsync();
    await Promise.resolve();

    expect(items[0].classList).not.toContain('is-active');
    expect(items[1].classList).toContain('is-active');

    quill.root.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
      })
    );

    await vi.runAllTimersAsync();
    await Promise.resolve();

    expect(items[1].classList).not.toContain('is-active');
    expect(items[0].classList).toContain('is-active');
  });

  it('should close suggestions on Escape', async () => {
    quill.insertText(0, '@', Quill.sources.USER);
    quill.setSelection(1, 0, Quill.sources.USER);
    await vi.runAllTimersAsync();
    await Promise.resolve();

    const list = container.querySelector('.ql-mention-list');

    expect(list).toBeTruthy();

    quill.root.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      })
    );

    await vi.runAllTimersAsync();
    await Promise.resolve();

    expect(list?.classList).toContain('is-hidden');
  });

  it('should close on outside click', async () => {
    quill.insertText(0, '@', Quill.sources.USER);
    quill.setSelection(1, 0, Quill.sources.USER);
    await vi.runAllTimersAsync();
    await Promise.resolve();

    const list = container.querySelector('.ql-mention-list');
    expect(list).toBeTruthy();

    document.body.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
      })
    );

    await vi.runAllTimersAsync();
    await Promise.resolve();

    expect(list?.classList).toContain('is-hidden');
  });

  it('should filter suggestions based on input', async () => {
    quill.insertText(0, '@b', Quill.sources.USER);
    quill.setSelection(2, 0, Quill.sources.USER);
    await vi.runAllTimersAsync();
    await Promise.resolve();

    quill.insertText(1, 'b', Quill.sources.USER);
    quill.setSelection(2, 0, Quill.sources.USER);
    await vi.runAllTimersAsync();
    await Promise.resolve();

    const list = container.querySelectorAll('.ql-mention-item');

    expect(list.length).toBe(1);
    expect(list[0].textContent).toBe('@bob');
  });

  it('should not open suggestions when typing non-mention text', async () => {
    quill.insertText(0, 'Hello world', Quill.sources.USER);
    quill.setSelection(1, 0, Quill.sources.USER);
    await vi.runAllTimersAsync();
    await Promise.resolve();

    const list = container.querySelector('.ql-mention-list.is-hidden');
    expect(list).toBeTruthy();
  });

  it('should destroy the mention module properly', async () => {
    quill.insertText(0, '@', Quill.sources.USER);
    quill.setSelection(1, 0, Quill.sources.USER);
    await vi.runAllTimersAsync();
    await Promise.resolve();

    const mentionModule = quill.getModule('mention') as { destroy: () => void } | undefined;
    const destroySpy = vi.spyOn(mentionModule!, 'destroy');

    mentionModule?.destroy();
    await vi.runAllTimersAsync();
    await Promise.resolve();

    expect(destroySpy).toHaveBeenCalled();
  });

  it('should handle no matching suggestions gracefully', async () => {
    quill.insertText(0, '@z', Quill.sources.USER);
    quill.setSelection(2, 0, Quill.sources.USER);
    await vi.runAllTimersAsync();
    await Promise.resolve();

    const list = container.querySelectorAll('.ql-mention-item');

    expect(list.length).toBe(0);
  });

  it('should ignore scroll positioning when selection is unavailable', async () => {
    quill.insertText(0, '@', Quill.sources.USER);
    quill.setSelection(1, 0, Quill.sources.USER);
    await vi.runAllTimersAsync();
    await Promise.resolve();

    const list = container.querySelector('.ql-mention-list');
    expect(list).toBeTruthy();

    const selectionSpy = vi.spyOn(quill, 'getSelection').mockReturnValue(null);
    quill.root.dispatchEvent(new Event('scroll'));

    expect(list?.classList).not.toContain('is-hidden');
    selectionSpy.mockRestore();
  });

  it('should cancel a scheduled update on destroy', () => {
    quill.insertText(0, '@', Quill.sources.USER);

    const mentionModule = quill.getModule('mention') as { destroy: () => void } | undefined;
    mentionModule?.destroy();

    expect(cafSpy).toHaveBeenCalled();
  });
});

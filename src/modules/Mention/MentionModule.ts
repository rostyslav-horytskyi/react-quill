import Quill from 'quill';
import type { MentionEntity, MentionModuleOptions, MentionSource } from './types';

const DEFAULT_MENTIONS: MentionEntity[] = [
  {
    id: 'u1',
    label: 'Alice Johnson',
    value: '@alice_johnson',
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='12' cy='12' r='12' fill='%2338bdf8'/></svg>",
  },
  {
    id: 'u2',
    label: 'Ben Carter',
    value: '@ben_carter',
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='12' cy='12' r='12' fill='%23f472b6'/></svg>",
  },
  {
    id: 'u3',
    label: 'Chen Li',
    value: '@chen_li',
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='12' cy='12' r='12' fill='%234ade80'/></svg>",
  },
  {
    id: 'u4',
    label: 'Daria Novak',
    value: '@daria_novak',
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='12' cy='12' r='12' fill='%23f59e0b'/></svg>",
  },
  {
    id: 'u5',
    label: 'Elliot Park',
    value: '@elliot_park',
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='12' cy='12' r='12' fill='%236366f1'/></svg>",
  },
  {
    id: 'u6',
    label: 'Fatima Ali',
    value: '@fatima_ali',
    avatarUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='12' cy='12' r='12' fill='%23f97316'/></svg>",
  },
];

const DEFAULT_SOURCE: MentionSource = async query => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return DEFAULT_MENTIONS;
  }

  return DEFAULT_MENTIONS.filter(item => {
    const label = item.label.toLowerCase();
    const value = item.value?.toLowerCase() ?? '';
    return label.includes(normalized) || value.includes(normalized);
  });
};

class MentionModule {
  private quill: Quill;
  private options: MentionModuleOptions;
  private source: MentionSource;
  private container: HTMLDivElement;
  private list: HTMLDivElement;
  private empty: HTMLDivElement;
  private isOpen = false;
  private startIndex = 0;
  private query = '';
  private items: MentionEntity[] = [];
  private highlightedIndex = 0;
  private requestId = 0;
  private updateFrame: number | null = null;
  private minChars: number;
  private maxChars: number;
  private maxItems: number;

  constructor(quill: Quill, options?: MentionModuleOptions | boolean) {
    this.quill = quill;
    this.options = typeof options === 'object' ? options : {};
    this.source = this.options.source ?? DEFAULT_SOURCE;
    this.minChars = this.options.minChars ?? 0;
    this.maxChars = this.options.maxChars ?? 32;
    this.maxItems = this.options.maxItems ?? 8;

    this.container = document.createElement('div');
    this.container.className = 'ql-mention-list is-hidden';
    this.container.setAttribute('role', 'listbox');
    this.container.setAttribute('aria-label', 'Mention suggestions');

    this.list = document.createElement('div');
    this.list.className = 'ql-mention-items';

    this.empty = document.createElement('div');
    this.empty.className = 'ql-mention-empty';
    this.empty.textContent = this.options.emptyMessage ?? 'No matches';

    this.container.append(this.list, this.empty);

    const containerStyle = this.quill.container.style;
    if (!containerStyle.position || containerStyle.position === 'static') {
      containerStyle.position = 'relative';
    }
    this.quill.container.appendChild(this.container);

    this.quill.on(Quill.events.TEXT_CHANGE, this.handleTextChange);
    this.quill.on(Quill.events.SELECTION_CHANGE, this.handleSelectionChange);
    this.quill.root.addEventListener('keydown', this.handleKeyDown);
    this.quill.root.addEventListener('scroll', this.handleScroll, { passive: true });
    document.addEventListener('click', this.handleDocumentClick);
  }

  private handleTextChange = (_delta: unknown, _oldDelta: unknown, source: string) => {
    if (source !== Quill.sources.USER) {
      return;
    }
    if (this.updateFrame !== null) {
      cancelAnimationFrame(this.updateFrame);
    }
    this.updateFrame = requestAnimationFrame(() => {
      this.updateFrame = null;
      this.updateQuery();
    });
  };

  private handleSelectionChange = (range: { index: number; length: number } | null) => {
    if (!range || range.length > 0) {
      this.close();
      return;
    }

    if (!this.isOpen) {
      this.updateQuery();
      return;
    }

    const endIndex = this.startIndex + 1 + this.query.length;
    if (range.index < this.startIndex || range.index > endIndex) {
      this.close();
      return;
    }

    this.positionList();
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.isOpen) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveHighlight(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveHighlight(-1);
      return;
    }

    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      this.selectHighlighted();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  };

  private handleScroll = () => {
    if (this.isOpen) {
      this.positionList();
    }
  };

  private handleDocumentClick = (event: MouseEvent) => {
    if (!this.isOpen) {
      return;
    }

    const target = event.target as Node | null;
    if (!target) {
      return;
    }

    if (this.container.contains(target) || this.quill.root.contains(target)) {
      return;
    }

    this.close();
  };

  private updateQuery() {
    const range = this.quill.getSelection(true);
    if (!range || range.length > 0) {
      this.close();
      return;
    }

    const maxSearch = this.maxChars + 1;
    const start = Math.max(0, range.index - maxSearch);
    const textBefore = this.quill.getText(start, range.index - start);
    const triggerIndex = textBefore.lastIndexOf('@');
    let startIndex = triggerIndex !== -1 ? start + triggerIndex : -1;

    if (triggerIndex === -1) {
      const beforeChar = range.index > 0 ? this.quill.getText(range.index - 1, 1) : '';
      if (beforeChar === '@') {
        startIndex = range.index - 1;
      } else if (this.quill.getText(range.index, 1) === '@') {
        startIndex = range.index;
      } else {
        this.close();
        return;
      }
    }

    if (startIndex < 0 || range.index <= startIndex) {
      this.close();
      return;
    }

    if (startIndex > 0) {
      const prevChar = this.quill.getText(startIndex - 1, 1);
      if (!prevChar || !/\s/.test(prevChar)) {
        this.close();
        return;
      }
    }

    const query = this.quill.getText(startIndex + 1, range.index - startIndex - 1);
    if (/\s/.test(query)) {
      this.close();
      return;
    }

    if (query.length < this.minChars || query.length > this.maxChars) {
      this.close();
      return;
    }

    this.startIndex = startIndex;
    this.query = query;

    if (!this.isOpen) {
      this.open();
    }

    this.fetchItems(query);
    this.positionList();
  }

  private async fetchItems(query: string) {
    const requestId = ++this.requestId;
    const results = await this.source(query);

    if (requestId !== this.requestId) {
      return;
    }

    this.items = results.slice(0, this.maxItems);
    this.highlightedIndex = 0;
    this.renderList();
  }

  private renderList() {
    this.list.innerHTML = '';

    if (this.items.length === 0) {
      this.empty.style.display = 'block';
      return;
    }

    this.empty.style.display = 'none';

    this.items.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ql-mention-item';
      button.setAttribute('role', 'option');
      button.setAttribute('data-index', String(index));
      button.setAttribute('aria-selected', index === this.highlightedIndex ? 'true' : 'false');
      if (index === this.highlightedIndex) {
        button.classList.add('is-active');
      }

      if (item.avatarUrl) {
        const avatar = document.createElement('img');
        avatar.src = item.avatarUrl;
        avatar.alt = item.label;
        avatar.className = 'ql-mention-item-avatar';
        button.appendChild(avatar);
      }

      const label = document.createElement('span');
      label.className = 'ql-mention-item-label';
      label.textContent = item.value || item.label;
      button.appendChild(label);

      button.addEventListener('mousedown', event => {
        event.preventDefault();
        this.selectItem(index);
      });

      this.list.appendChild(button);
    });
  }

  private moveHighlight(direction: number) {
    if (this.items.length === 0) {
      return;
    }

    const next = (this.highlightedIndex + direction + this.items.length) % this.items.length;
    this.highlightedIndex = next;
    this.updateHighlight();
  }

  private updateHighlight() {
    const nodes = Array.from(this.list.children) as HTMLElement[];
    nodes.forEach((node, index) => {
      const isActive = index === this.highlightedIndex;
      node.classList.toggle('is-active', isActive);
      node.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  private selectHighlighted() {
    const item = this.items[this.highlightedIndex];
    if (!item) {
      return;
    }
    this.insertMention(item);
  }

  private selectItem(index: number) {
    const item = this.items[index];
    if (!item) {
      return;
    }
    this.insertMention(item);
  }

  private insertMention(item: MentionEntity) {
    const range = this.quill.getSelection(true);
    if (!range) {
      return;
    }

    const length = range.index - this.startIndex;
    if (length < 0) {
      this.close();
      return;
    }

    this.quill.deleteText(this.startIndex, length, Quill.sources.USER);
    this.quill.insertEmbed(this.startIndex, 'mention', item, Quill.sources.USER);
    this.quill.insertText(this.startIndex + 1, ' ', Quill.sources.USER);
    this.quill.setSelection(this.startIndex + 2, 0, Quill.sources.USER);
    this.close();
  }

  private positionList() {
    if (!this.isOpen) {
      return;
    }

    const range = this.quill.getSelection();
    if (!range) {
      return;
    }

    const bounds = this.quill.getBounds(range.index);
    const scrollTop = this.quill.root.scrollTop;
    const scrollLeft = this.quill.root.scrollLeft;
    const top = (bounds?.bottom ?? 0) + scrollTop + 6;
    const left = (bounds?.left ?? 0) + scrollLeft;
    const containerWidth = this.quill.container.clientWidth;
    const listWidth = this.container.offsetWidth || 240;
    const padding = 8;
    const clampedLeft = Math.min(Math.max(left, padding), containerWidth - listWidth - padding);

    this.container.style.top = `${top}px`;
    this.container.style.left = `${clampedLeft}px`;
  }

  private open() {
    this.isOpen = true;
    this.container.classList.remove('is-hidden');
  }

  private close() {
    this.isOpen = false;
    this.container.classList.add('is-hidden');
    this.list.innerHTML = '';
    this.items = [];
    this.query = '';
    this.requestId += 1;
  }

  destroy() {
    this.close();
    this.quill.off(Quill.events.TEXT_CHANGE, this.handleTextChange);
    this.quill.off(Quill.events.SELECTION_CHANGE, this.handleSelectionChange);
    this.quill.root.removeEventListener('keydown', this.handleKeyDown);
    this.quill.root.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('click', this.handleDocumentClick);
    if (this.updateFrame !== null) {
      cancelAnimationFrame(this.updateFrame);
      this.updateFrame = null;
    }
    this.container.remove();
  }
}

export default MentionModule;
export { DEFAULT_MENTIONS };

import type Quill from 'quill';

export type CharCounterOptions = {
  limit?: number;
  container?: HTMLElement;
};

class CharCounter {
  private quill: Quill;
  private container: HTMLElement;
  private limit?: number;

  constructor(quill: Quill, options: CharCounterOptions = {}) {
    this.quill = quill;
    this.limit = options.limit;
    this.container = options.container || this.createContainer();
    this.container.classList.add('ql-char-counter');

    this.update();

    this.quill.on('text-change', this.update);
  }

  private createContainer(): HTMLElement {
    const el = document.createElement('div');

    el.className = 'ql-char-counter';
    this.quill.container.appendChild(el);

    return el;
  }

  private update = () => {
    const text = this.quill.getText();
    const length = text.replace(/\s+/g, '').length;

    if (this.limit !== undefined) {
      this.container.textContent = `${length} / ${this.limit} chars`;
      this.container.classList.toggle('ql-char-counter-exceed', length > this.limit);
      return;
    }

    this.container.textContent = `${length} chars`;
    this.container.classList.remove('ql-char-counter-exceed');
  };

  destroy() {
    this.quill.off('text-change', this.update);
    this.container.remove();
  }
}

export default CharCounter;

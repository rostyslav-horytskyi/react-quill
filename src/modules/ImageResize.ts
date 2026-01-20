import Quill from 'quill';

const MIN_SIZE = 48;
const HANDLE_OFFSET = 6;
const TOOLBAR_OFFSET = 8;

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const HANDLE_DIRECTIONS: ResizeDirection[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

class ImageResize {
  private quill: Quill;
  private container: HTMLElement;
  private activeImage: HTMLImageElement | null = null;
  private activeIndex: number | null = null;
  private overlay: HTMLDivElement;
  private toolbar: HTMLDivElement;
  private captionInput: HTMLInputElement;
  private isResizing = false;
  private direction: ResizeDirection | null = null;
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private hasImageLoadListener = false;
  private isHandlingClick = false;
  private activationFrame: number | null = null;
  private suppressSelectionChange = false;
  private suppressSelectionChangeTimer: number | null = null;
  private suppressOutsideClick = false;
  private suppressOutsideClickTimer: number | null = null;

  constructor(quill: Quill) {
    this.quill = quill;
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleHandleMouseDown = this.handleHandleMouseDown.bind(this);
    this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this);
    this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleCaptionInput = this.handleCaptionInput.bind(this);
    this.handleRootMouseDown = this.handleRootMouseDown.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleImageLoad = this.handleImageLoad.bind(this);

    this.overlay = this.createOverlay();
    this.toolbar = this.createToolbar();
    this.captionInput = this.toolbar.querySelector<HTMLInputElement>('[data-caption-input]')!;

    this.container = this.quill.container;
    this.container.style.position = this.container.style.position || 'relative';
    this.container.appendChild(this.overlay);
    this.container.appendChild(this.toolbar);

    this.quill.on('selection-change', this.handleSelectionChange);
    this.quill.on('text-change', this.handleTextChange);
    this.quill.root.addEventListener('scroll', this.handleScroll, { passive: true });
    this.quill.root.addEventListener('mousedown', this.handleRootMouseDown, true);
    document.addEventListener('click', this.handleDocumentClick);
    window.addEventListener('resize', this.handleScroll);
  }

  private createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'ql-image-resize-overlay is-hidden';

    HANDLE_DIRECTIONS.forEach(direction => {
      const handle = document.createElement('div');
      handle.className = `ql-image-resize-handle ql-image-resize-handle--${direction}`;
      handle.dataset.direction = direction;
      handle.addEventListener('mousedown', this.handleHandleMouseDown);
      overlay.appendChild(handle);
    });

    return overlay;
  }

  private createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'ql-image-toolbar is-hidden';

    const actions = document.createElement('div');
    actions.className = 'ql-image-toolbar-actions';

    const leftButton = this.createButton('Left', 'left');
    const centerButton = this.createButton('Center', 'center');
    const rightButton = this.createButton('Right', 'right');
    const removeButton = this.createButton('Remove', 'remove');

    actions.append(leftButton, centerButton, rightButton, removeButton);

    const captionWrapper = document.createElement('div');
    captionWrapper.className = 'ql-image-caption';
    const captionInput = document.createElement('input');
    captionInput.type = 'text';
    captionInput.placeholder = 'Add caption';
    captionInput.className = 'ql-image-caption-input';
    captionInput.dataset.captionInput = 'true';
    captionInput.addEventListener('input', this.handleCaptionInput);

    captionWrapper.appendChild(captionInput);

    toolbar.append(actions, captionWrapper);
    toolbar.addEventListener('mousedown', event => event.stopPropagation());

    return toolbar;
  }

  private createButton(label: string, action: string) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.className = 'ql-image-toolbar-button';
    button.dataset.action = action;
    button.addEventListener('click', () => this.handleToolbarAction(action));
    return button;
  }

  private handleToolbarAction(action: string) {
    if (!this.activeImage || this.activeIndex === null) return;

    if (action === 'remove') {
      this.quill.deleteText(this.activeIndex, 1, 'user');
      this.hideUI();
      return;
    }

    const image = this.activeImage;
    image.style.float = 'none';
    image.style.marginTop = '0';
    image.style.marginBottom = '0';
    image.style.verticalAlign = '';

    image.style.display = 'block';
    image.style.float = 'none';
    image.style.marginLeft = action === 'right' ? 'auto' : '0';
    image.style.marginRight = action === 'left' ? 'auto' : '0';

    if (action === 'center') {
      image.style.marginLeft = 'auto';
      image.style.marginRight = 'auto';
    }

    image.setAttribute('data-align', action);
    this.quill.update('user');
    this.positionUI();
  }

  private handleCaptionInput() {
    if (!this.activeImage || this.activeIndex === null) return;

    const value = this.captionInput.value.trim();
    if (value) {
      this.activeImage.setAttribute('alt', value);
      this.quill.formatText(this.activeIndex, 1, { alt: value }, 'user');
    } else {
      this.activeImage.removeAttribute('alt');
      this.quill.formatText(this.activeIndex, 1, { alt: false }, 'user');
    }
  }

  private handleSelectionChange(range: { index: number; length: number } | null) {
    if (this.suppressSelectionChange) {
      return;
    }

    if (this.isHandlingClick) {
      return;
    }

    // Don't hide UI if focus is on the caption input
    if (document.activeElement === this.captionInput) {
      return;
    }

    // Hide UI if no range or if any text is selected (length > 0)
    // UI should only be shown when image is clicked, not when selected via keyboard
    if (!range || range.length > 0) {
      this.hideUI();
      return;
    }

    // If we have an active image but cursor moved away, hide UI
    if (this.activeImage) {
      const [leaf] = this.quill.getLeaf(range.index);
      const image = leaf?.domNode instanceof HTMLImageElement ? leaf.domNode : null;

      if (image !== this.activeImage) {
        this.hideUI();
      }
    }
  }

  private handleTextChange(
    _delta: { ops?: Array<{ retain?: number; insert?: unknown; delete?: number }> } | undefined,
    _oldDelta: unknown,
    _source: string
  ) {
    if (!this.activeImage) return;

    // Check if the active image was removed from the DOM
    if (!this.quill.root.contains(this.activeImage)) {
      this.hideUI();
      return;
    }

    this.positionUI();
  }

  private handleScroll() {
    if (!this.activeImage) return;
    this.positionUI();
  }

  private handleRootMouseDown(event: MouseEvent) {
    if (this.isResizing) return;

    const target = event.target as HTMLElement | null;
    if (!target || target.tagName !== 'IMG') {
      this.hideUI();
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const blot = Quill.find(target, true);
    if (!blot || blot instanceof Quill) {
      this.hideUI();
      return;
    }

    const index = this.quill.getIndex(blot);
    this.isHandlingClick = true;
    this.activeImage = target as HTMLImageElement;
    this.activeIndex = index;
    this.captionInput.value = this.activeImage.getAttribute('alt') || '';
    this.suppressSelectionChangeOnce();
    this.showUI();
    window.setTimeout(() => {
      this.isHandlingClick = false;
    }, 0);
  }

  private handleHandleMouseDown(event: MouseEvent) {
    if (!this.activeImage) return;

    const target = event.currentTarget as HTMLElement | null;
    const direction = target?.dataset.direction as ResizeDirection | undefined;
    if (!direction) return;

    event.preventDefault();
    event.stopPropagation();

    const rect = this.activeImage.getBoundingClientRect();
    this.isResizing = true;
    this.direction = direction;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = rect.width;
    this.startHeight = rect.height;

    document.addEventListener('mousemove', this.handleDocumentMouseMove);
    document.addEventListener('mouseup', this.handleDocumentMouseUp);
  }

  private handleDocumentMouseMove(event: MouseEvent) {
    if (!this.isResizing || !this.activeImage || !this.direction) return;

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;
    const editorWidth = this.quill.root.clientWidth;

    let nextWidth = this.startWidth;
    let nextHeight = this.startHeight;

    if (this.direction.includes('e')) {
      nextWidth = this.startWidth + deltaX;
    }

    if (this.direction.includes('w')) {
      nextWidth = this.startWidth - deltaX;
    }

    if (this.direction.includes('s')) {
      nextHeight = this.startHeight + deltaY;
    }

    if (this.direction.includes('n')) {
      nextHeight = this.startHeight - deltaY;
    }

    nextWidth = Math.max(MIN_SIZE, nextWidth);
    nextHeight = Math.max(MIN_SIZE, nextHeight);

    if (editorWidth > 0) {
      nextWidth = Math.min(nextWidth, editorWidth);
    }

    this.applySize(nextWidth, nextHeight);
    this.positionUI();
  }

  private handleDocumentMouseUp() {
    if (!this.isResizing) return;

    this.isResizing = false;
    this.direction = null;

    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
  }

  private applySize(width: number, height: number) {
    if (!this.activeImage || this.activeIndex === null) return;

    const formattedWidth = Math.round(width);
    const formattedHeight = Math.round(height);

    this.activeImage.setAttribute('width', String(formattedWidth));
    this.activeImage.setAttribute('height', String(formattedHeight));

    this.quill.formatText(
      this.activeIndex,
      1,
      { width: String(formattedWidth), height: String(formattedHeight) },
      'user'
    );
  }

  private showUI() {
    this.overlay.classList.remove('is-hidden');
    this.toolbar.classList.remove('is-hidden');
    this.quill.root.classList.add('ql-image-selected');
    this.attachImageLoadListener();
    requestAnimationFrame(() => this.positionUI());
  }

  private hideUI() {
    this.overlay.classList.add('is-hidden');
    this.toolbar.classList.add('is-hidden');
    this.quill.root.classList.remove('ql-image-selected');
    this.detachImageLoadListener();
    this.activeImage = null;
    this.activeIndex = null;
  }

  private positionUI() {
    if (!this.activeImage) return;

    const containerRect = this.container.getBoundingClientRect();
    const imageRect = this.activeImage.getBoundingClientRect();
    const top = imageRect.top - containerRect.top + this.quill.root.scrollTop;
    const left = imageRect.left - containerRect.left + this.quill.root.scrollLeft;
    const width = imageRect.width;
    const height = imageRect.height;

    if (!width || !height) {
      return;
    }

    this.overlay.style.top = `${top - HANDLE_OFFSET}px`;
    this.overlay.style.left = `${left - HANDLE_OFFSET}px`;
    this.overlay.style.width = `${width + HANDLE_OFFSET * 2}px`;
    this.overlay.style.height = `${height + HANDLE_OFFSET * 2}px`;

    const toolbarTop = top + height + TOOLBAR_OFFSET;
    const containerWidth = this.container.clientWidth;
    const toolbarWidth = this.toolbar.offsetWidth || 0;
    const centeredLeft = left + width / 2 - toolbarWidth / 2;
    const maxLeft = Math.max(HANDLE_OFFSET, containerWidth - toolbarWidth - HANDLE_OFFSET);
    const clampedLeft = Math.min(Math.max(centeredLeft, HANDLE_OFFSET), maxLeft);

    this.toolbar.style.top = `${toolbarTop}px`;
    this.toolbar.style.left = `${clampedLeft}px`;
  }

  private handleDocumentClick(event: MouseEvent) {
    if (this.suppressOutsideClick) {
      return;
    }

    if (!this.activeImage) return;

    const target = event.target as Node | null;
    if (!target) return;

    if (
      target === this.activeImage ||
      this.overlay.contains(target) ||
      this.toolbar.contains(target)
    ) {
      return;
    }

    this.hideUI();
  }

  private attachImageLoadListener() {
    if (!this.activeImage || this.hasImageLoadListener) return;
    this.activeImage.addEventListener('load', this.handleImageLoad);
    this.hasImageLoadListener = true;
  }

  private detachImageLoadListener() {
    if (!this.activeImage || !this.hasImageLoadListener) return;
    this.activeImage.removeEventListener('load', this.handleImageLoad);
    this.hasImageLoadListener = false;
  }

  private handleImageLoad() {
    this.positionUI();
  }

  private suppressSelectionChangeOnce() {
    if (this.suppressSelectionChangeTimer !== null) {
      window.clearTimeout(this.suppressSelectionChangeTimer);
    }

    this.suppressSelectionChange = true;
    this.suppressSelectionChangeTimer = window.setTimeout(() => {
      this.suppressSelectionChange = false;
      this.suppressSelectionChangeTimer = null;
    }, 0);
  }

  public destroy() {
    this.hideUI();
    this.quill.off('selection-change', this.handleSelectionChange);
    this.quill.off('text-change', this.handleTextChange);
    this.quill.root.removeEventListener('scroll', this.handleScroll);
    this.quill.root.removeEventListener('mousedown', this.handleRootMouseDown, true);
    document.removeEventListener('click', this.handleDocumentClick);
    window.removeEventListener('resize', this.handleScroll);
    if (this.activationFrame !== null) {
      cancelAnimationFrame(this.activationFrame);
      this.activationFrame = null;
    }
    if (this.suppressSelectionChangeTimer !== null) {
      window.clearTimeout(this.suppressSelectionChangeTimer);
      this.suppressSelectionChangeTimer = null;
    }
    if (this.suppressOutsideClickTimer !== null) {
      window.clearTimeout(this.suppressOutsideClickTimer);
      this.suppressOutsideClickTimer = null;
    }
    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
    this.overlay.remove();
    this.toolbar.remove();
  }
}

Quill.register('modules/imageResize', ImageResize);

export default ImageResize;

import Quill from 'quill';

class ImageDrop {
  private quill: Quill;

  constructor(quill: Quill) {
    this.quill = quill;
    this.handleDrop = this.handleDrop.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);

    this.quill.root.addEventListener('dragover', this.handleDragOver, false);
    this.quill.root.addEventListener('drop', this.handleDrop, false);
    this.quill.root.addEventListener('paste', this.handlePaste, false);
  }

  private handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  private handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer?.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    const dropIndex = this.getDropIndex(event);
    this.insertImage(file, dropIndex ?? undefined);
  }

  private handlePaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;

    if (!items) return;

    for (const item of items) {
      if (item?.type.startsWith('image/')) {
        const file = item.getAsFile();

        if (file) {
          event.preventDefault();
          this.insertImage(file);
        }

        break;
      }
    }
  }

  private getDropIndex(event: DragEvent): number | null {
    const range = this.getRangeFromPoint(event);
    if (!range) return null;

    const blot = Quill.find(range.startContainer, true);
    if (!blot || blot instanceof Quill) return null;

    const index = this.quill.getIndex(blot);
    return index + range.startOffset;
  }

  private getRangeFromPoint(event: DragEvent): Range | null {
    const doc = document as Document & {
      caretRangeFromPoint?: (x: number, y: number) => Range | null;
      caretPositionFromPoint?: (
        x: number,
        y: number
      ) => { offsetNode: Node; offset: number } | null;
    };

    if (doc.caretRangeFromPoint) {
      return doc.caretRangeFromPoint(event.clientX, event.clientY);
    }

    if (doc.caretPositionFromPoint) {
      const position = doc.caretPositionFromPoint(event.clientX, event.clientY);
      if (!position) return null;
      const range = document.createRange();
      range.setStart(position.offsetNode, position.offset);
      range.collapse(true);
      return range;
    }

    return null;
  }

  private insertImage(file: File, index?: number) {
    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result as string;
      const range = this.quill.getSelection(true);
      const insertAt = index ?? range?.index ?? this.quill.getLength();

      this.quill.insertEmbed(insertAt, 'image', base64Image, 'user');
      this.quill.setSelection(insertAt + 1, 0);
      const resizeModule = this.quill.getModule('imageResize') as
        | { activateAtIndex?: (index: number) => void }
        | undefined;
      resizeModule?.activateAtIndex?.(insertAt);
    };

    reader.readAsDataURL(file);
  }

  public destroy() {
    this.quill.root.removeEventListener('dragover', this.handleDragOver);
    this.quill.root.removeEventListener('drop', this.handleDrop);
    this.quill.root.removeEventListener('paste', this.handlePaste);
  }
}

export default ImageDrop;

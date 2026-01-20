import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '../../../../../../test';
import ImageUploadTab from './ImageUploadTab';

const IMAGE_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/xcAAwMCAO6u6E8AAAAASUVORK5CYII=';

class FileReaderMock {
  public result: string | ArrayBuffer | null = null;
  public onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
  public onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;

  readAsDataURL() {
    this.result = IMAGE_DATA_URL;
    this.onload?.(new Event('load') as ProgressEvent<FileReader>);
  }
}

const originalFileReader = globalThis.FileReader;

describe('<ImageUploadTab />', () => {
  beforeEach(() => {
    globalThis.FileReader = FileReaderMock as typeof FileReader;
  });

  afterEach(() => {
    globalThis.FileReader = originalFileReader;
  });

  it('shows an error for non-image files', async () => {
    render(<ImageUploadTab onInsert={vi.fn()} />);

    const input = screen.getByLabelText('Upload image');
    const file = new File(['text'], 'notes.txt', { type: 'text/plain' });

    // Use fireEvent instead of user.upload because user.upload respects accept attribute
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Please select a valid image file.');
    });
    expect(screen.getByRole('button', { name: /insert image/i })).toBeDisabled();
  });

  it('reads a selected image file and inserts it', async () => {
    const onInsert = vi.fn();
    const onClose = vi.fn();
    const { user } = render(<ImageUploadTab onInsert={onInsert} onClose={onClose} />);

    const input = screen.getByLabelText('Upload image');
    const file = new File(['img'], 'photo.png', { type: 'image/png' });

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('Selected: photo.png')).toBeInTheDocument();
    });

    const insertButton = screen.getByRole('button', { name: /insert image/i });
    expect(insertButton).toBeEnabled();

    await user.click(insertButton);

    expect(onInsert).toHaveBeenCalledWith(IMAGE_DATA_URL);
    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByText(/Selected:/)).not.toBeInTheDocument();
  });

  it('handles drag and drop', async () => {
    render(<ImageUploadTab onInsert={vi.fn()} />);

    const dropZone = screen.getByRole('button', { name: /drop image/i });
    const file = new File(['img'], 'drop.png', { type: 'image/png' });

    fireEvent.dragEnter(dropZone);

    expect(dropZone.className).toContain('border-blue-500');

    fireEvent.drop(dropZone, { dataTransfer: { files: [file], clearData: vi.fn() } });

    await waitFor(() => {
      expect(screen.getByText('Selected: drop.png')).toBeInTheDocument();
    });

    fireEvent.dragLeave(dropZone);

    expect(dropZone.className).not.toContain('border-blue-500');
  });
});

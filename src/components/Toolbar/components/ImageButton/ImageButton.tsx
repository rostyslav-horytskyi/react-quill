import { Image } from 'lucide-react';
import { useState } from 'react';
import { useQuill } from '../../../../context';
import ImageDialog from '../ImageDialog/ImageDialog.tsx';
import ToolbarButton from '../ToolbarButton/ToolbarButton.tsx';

const ICON_SIZE = 18;

function ImageButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { quill, refreshFormats } = useQuill();

  const handleInsertImage = (url: string) => {
    if (!quill) return;

    const range = quill.getSelection(true);

    quill.insertEmbed(range.index, 'image', url, 'user');
    quill.setSelection(range.index + 1, 0);
    refreshFormats();
  };

  return (
    <div className="relative">
      <ToolbarButton
        icon={<Image size={ICON_SIZE} />}
        title="Insert image"
        onClick={() => setIsDialogOpen(!isDialogOpen)}
      />
      <div className="absolute right-0 top-full z-50 mt-2">
        <ImageDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onInsert={handleInsertImage}
        />
      </div>
    </div>
  );
}

export default ImageButton;

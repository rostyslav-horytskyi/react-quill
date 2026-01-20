import { Link } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useQuill } from '../../../../context';
import LinkDialog from '../LinkDialog';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const ICON_SIZE = 18;

function LinkButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { quill, formats, refreshFormats } = useQuill();

  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleInsertLink = useCallback(
    (url: string) => {
      if (!quill) return;

      const selection = quill.getSelection();
      if (selection) {
        if (selection.length > 0) {
          // Text is selected - format it as a link
          quill.format('link', url);
        } else {
          // No selection - insert the URL as link text
          quill.insertText(selection.index, url, 'link', url);
          quill.setSelection(selection.index + url.length, 0);
        }
      }
      refreshFormats();
    },
    [quill, refreshFormats]
  );

  const handleRemoveLink = useCallback(() => {
    if (!quill) return;
    quill.format('link', false);
    refreshFormats();
  }, [quill, refreshFormats]);

  // Get selected text for preview
  const getSelectedText = (): string => {
    if (!quill) return '';
    const selection = quill.getSelection();
    if (selection && selection.length > 0) {
      return quill.getText(selection.index, selection.length);
    }
    return '';
  };

  // Get current link URL if cursor is in a link
  const currentUrl = typeof formats.link === 'string' ? formats.link : '';

  return (
    <div className="relative">
      <ToolbarButton
        icon={<Link size={ICON_SIZE} />}
        title="Insert link"
        onClick={handleOpenDialog}
        isActive={!!formats.link}
      />
      {isDialogOpen && (
        <div className="absolute right-0 top-full z-50 mt-2">
          <LinkDialog
            onClose={handleCloseDialog}
            onInsert={handleInsertLink}
            onRemove={handleRemoveLink}
            currentUrl={currentUrl}
            selectedText={getSelectedText()}
          />
        </div>
      )}
    </div>
  );
}

export default LinkButton;

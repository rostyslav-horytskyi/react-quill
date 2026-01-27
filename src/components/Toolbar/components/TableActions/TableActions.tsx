import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Trash2 } from 'lucide-react';
import { tableUpEvent, tableUpInternal } from 'quill-table-up';
import { useQuill } from '../../../../context';
import ToolbarButton from '../ToolbarButton/ToolbarButton';

const ICON_SIZE = 16;

type TableSelectionModule = {
  selectedTds: Array<{ domNode: HTMLElement }>;
};

type TableUpModule = {
  appendRow: (selectedTds: Array<{ domNode: HTMLElement }>, isDown: boolean) => void;
  appendCol: (selectedTds: Array<{ domNode: HTMLElement }>, isRight: boolean) => void;
  removeRow: (selectedTds: Array<{ domNode: HTMLElement }>) => void;
  removeCol: (selectedTds: Array<{ domNode: HTMLElement }>) => void;
  deleteTable: (selectedTds: Array<{ domNode: HTMLElement }>) => void;
  getModule?: (name: string) => TableSelectionModule | undefined;
};

export default function TableActions() {
  const { quill } = useQuill();
  const table = quill?.getModule('table-up') as TableUpModule | undefined;

  const [position, setPosition] = useState<{ top: number; left: number; visible: boolean }>({
    top: 0,
    left: 0,
    visible: false,
  });
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const selectedRef = useRef<Array<{ domNode: HTMLElement }>>([]);

  useEffect(() => {
    if (!quill || !table) return;

    const updatePosition = () => {
      const selectionModule = table.getModule?.(tableUpInternal.tableSelectionName);
      const selectedTds = selectionModule?.selectedTds ?? [];
      selectedRef.current = selectedTds;

      const cellInner = selectedTds[0]?.domNode ?? null;
      const cellEl = cellInner?.closest('td,th') as HTMLTableCellElement | null;

      if (!cellEl) {
        if (hideTimeoutRef.current) return;
        hideTimeoutRef.current = window.setTimeout(() => {
          hideTimeoutRef.current = null;
          setPosition(prev => (prev.visible ? { ...prev, visible: false } : prev));
        }, 80);
        return;
      }

      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      const container = quill.container;
      if (!container) return;

      const cellRect = cellEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      let left = cellRect.left - containerRect.left;
      const top = cellRect.top - containerRect.top - 8;

      const toolbarWidth = toolbarRef.current?.offsetWidth ?? 0;
      if (toolbarWidth > 0) {
        const maxLeft = containerRect.width - toolbarWidth;
        left = Math.max(0, Math.min(left, maxLeft));
      }

      setPosition({ top, left, visible: true });
    };

    const handleUpdate = () => updatePosition();

    quill.on('selection-change', handleUpdate);
    quill.on('text-change', handleUpdate);
    quill.on(tableUpEvent.TABLE_SELECTION_CHANGE, handleUpdate);
    window.addEventListener('resize', handleUpdate);

    handleUpdate();

    return () => {
      quill.off('selection-change', handleUpdate);
      quill.off('text-change', handleUpdate);
      quill.off(tableUpEvent.TABLE_SELECTION_CHANGE, handleUpdate);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [quill, table]);

  if (!quill || !table || !position.visible) {
    return null;
  }

  const toolbar = (
    <div
      ref={toolbarRef}
      className="ql-table-toolbar"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <ToolbarButton
        icon={<ArrowUp size={ICON_SIZE} />}
        title="Insert row above"
        onClick={() => table.appendRow(selectedRef.current, false)}
      />
      <ToolbarButton
        icon={<ArrowDown size={ICON_SIZE} />}
        title="Insert row below"
        onClick={() => table.appendRow(selectedRef.current, true)}
      />
      <ToolbarButton
        icon={<ArrowLeft size={ICON_SIZE} />}
        title="Insert column left"
        onClick={() => table.appendCol(selectedRef.current, false)}
      />
      <ToolbarButton
        icon={<ArrowRight size={ICON_SIZE} />}
        title="Insert column right"
        onClick={() => table.appendCol(selectedRef.current, true)}
      />
      <ToolbarButton
        icon={<Trash2 size={ICON_SIZE} />}
        title="Delete row"
        onClick={() => table.removeRow(selectedRef.current)}
      />
      <ToolbarButton
        icon={<Trash2 size={ICON_SIZE} />}
        title="Delete column"
        onClick={() => table.removeCol(selectedRef.current)}
      />
      <ToolbarButton
        icon={<Trash2 size={ICON_SIZE} />}
        title="Delete table"
        onClick={() => table.deleteTable(selectedRef.current)}
      />
    </div>
  );

  return createPortal(toolbar, quill.container);
}

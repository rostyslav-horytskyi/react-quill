import { useState } from 'react';
import { Table } from 'lucide-react';
import ToolbarButton from '../ToolbarButton/ToolbarButton.tsx';
import TableGridPicker from './components/TableGridPicker/TableGridPicker.tsx';
import { useQuill } from '../../../../context';

const ICON_SIZE = 18;

export default function TableButton() {
  const [isTableGridOpen, setIsTableGridOpen] = useState(false);
  const { quill } = useQuill();

  const handleOpenGrid = () => {
    setIsTableGridOpen(prev => !prev);
  };

  const handleSelect = (rows: number, columns: number) => {
    const table = quill?.getModule('table-up') as
      | { insertTable: (r: number, c: number) => void }
      | undefined;

    table?.insertTable(rows, columns);
    setIsTableGridOpen(false);
  };

  const handleClose = () => {
    setIsTableGridOpen(false);
  };

  return (
    <div className={'relative'}>
      <ToolbarButton
        icon={<Table size={ICON_SIZE} />}
        title={'Insert table'}
        onClick={handleOpenGrid}
      />
      {isTableGridOpen && (
        <div className="absolute right-0 top-full z-50 mt-2">
          <TableGridPicker onSelect={handleSelect} onClose={handleClose} />
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

const MAX = 10;

export default function TableGridPicker({
  onSelect,
  onClose,
}: {
  onSelect: (rows: number, cols: number) => void;
  onClose: () => void;
}) {
  const [hover, setHover] = useState<{ rows: number; cols: number }>({ rows: 0, cols: 0 });

  return (
    <OutsideClickHandler onOutsideClick={onClose}>
      <div className="p-2 rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${MAX}, 1fr)` }}
          onMouseLeave={() => setHover({ rows: 0, cols: 0 })}
        >
          {Array.from({ length: MAX }).map((_, rowIndex) =>
            Array.from({ length: MAX }).map((_, colIndex) => {
              const isActive = rowIndex < hover.rows && colIndex < hover.cols;
              const rows = rowIndex + 1;
              const cols = colIndex + 1;

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={[
                    'h-4 w-4 rounded-sm border',
                    isActive ? 'bg-blue-500 border-blue-500' : 'border-gray-300',
                  ].join(' ')}
                  onMouseEnter={() => setHover({ rows, cols })}
                  onFocus={() => setHover({ rows, cols })}
                  onClick={() => onSelect(rows, cols)}
                  type="button"
                  aria-label={`Insert ${rows} by ${cols} table`}
                />
              );
            })
          )}
        </div>

        <div className="flex justify-center mt-2 text-sm text-gray-600" aria-live="polite">
          {hover.rows > 0 && hover.cols > 0
            ? `${hover.rows} x ${hover.cols} Table`
            : 'Select table size'}
        </div>
      </div>
    </OutsideClickHandler>
  );
}

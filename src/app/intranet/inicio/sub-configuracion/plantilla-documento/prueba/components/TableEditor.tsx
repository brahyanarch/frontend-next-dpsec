// components/TableEditor.tsx
import React, { useState } from 'react';
import { DocumentElement, TableData } from '@/types/latex';

interface TableEditorProps {
  element: DocumentElement;
  onUpdate: (id: string, newContent: TableData) => void;
  isSelected: boolean;
}

const TableEditor: React.FC<TableEditorProps> = ({ element, onUpdate, isSelected }) => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);
  
  const tableData: TableData = element.content;

  const updateCell = (row: number, col: number, value: string): void => {
    const newData = [...tableData.data];
    newData[row][col] = value;
    onUpdate(element.id, { ...tableData, data: newData });
  };

  const addRow = (position: 'above' | 'below'): void => {
    if (selectedRow === null) return;
    
    const newData = [...tableData.data];
    const newRow = Array(tableData.cols).fill('');
    
    if (position === 'above') {
      newData.splice(selectedRow, 0, newRow);
    } else {
      newData.splice(selectedRow + 1, 0, newRow);
    }
    
    onUpdate(element.id, { 
      ...tableData, 
      rows: tableData.rows + 1,
      data: newData 
    });
  };

  const addColumn = (position: 'left' | 'right'): void => {
    if (selectedCol === null) return;
    
    const newAlignments = [...tableData.alignments, 'left'];
    const newData = tableData.data.map(row => {
      const newRow = [...row];
      if (position === 'left') {
        newRow.splice(selectedCol, 0, '');
      } else {
        newRow.splice(selectedCol + 1, 0, '');
      }
      return newRow;
    });

    onUpdate(element.id, {
      ...tableData,
      cols: tableData.cols + 1,
      alignments: newAlignments,
      data: newData
    });
  };

  const deleteRow = (): void => {
    if (selectedRow === null || tableData.rows <= 1) return;
    
    const newData = tableData.data.filter((_, index) => index !== selectedRow);
    onUpdate(element.id, {
      ...tableData,
      rows: tableData.rows - 1,
      data: newData
    });
    setSelectedRow(null);
  };

  const deleteColumn = (): void => {
    if (selectedCol === null || tableData.cols <= 1) return;
    
    const newAlignments = tableData.alignments.filter((_, index) => index !== selectedCol);
    const newData = tableData.data.map(row => 
      row.filter((_, index) => index !== selectedCol)
    );

    onUpdate(element.id, {
      ...tableData,
      cols: tableData.cols - 1,
      alignments: newAlignments,
      data: newData
    });
    setSelectedCol(null);
  };

  const changeAlignment = (col: number, alignment: 'left' | 'center' | 'right'): void => {
    const newAlignments = [...tableData.alignments];
    newAlignments[col] = alignment;
    onUpdate(element.id, { ...tableData, alignments: newAlignments });
  };

  return (
    <div className={`border rounded-lg p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Controles de tabla */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <select 
            value={tableData.borders}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              onUpdate(element.id, { ...tableData, borders: e.target.value as 'all' | 'none' | 'booktabs' })
            }
            className="border rounded px-2 py-1"
          >
            <option value="all">Con bordes</option>
            <option value="none">Sin bordes</option>
            <option value="booktabs">Estilo Booktabs</option>
          </select>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => selectedRow !== null && addRow('above')} 
            disabled={selectedRow === null}
            className="px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            + Fila arriba
          </button>
          <button 
            onClick={deleteRow} 
            disabled={selectedRow === null}
            className="px-2 py-1 bg-red-500 text-white rounded disabled:bg-gray-300"
          >
            - Fila
          </button>
        </div>
      </div>

      {/* Tabla editable */}
      <div className="overflow-x-auto">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              {tableData.alignments.map((align, colIndex) => (
                <th 
                  key={colIndex} 
                  className="border p-2 bg-gray-50"
                  onClick={() => setSelectedCol(colIndex)}
                >
                  <div className="flex items-center justify-between">
                    <span>Col {colIndex + 1}</span>
                    <select 
                      value={align}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        changeAlignment(colIndex, e.target.value as 'left' | 'center' | 'right')
                      }
                      className="text-xs border rounded"
                    >
                      <option value="left">Izq</option>
                      <option value="center">Centro</option>
                      <option value="right">Der</option>
                    </select>
                  </div>
                </th>
              ))}
              <th className="p-2">
                <button 
                  onClick={() => selectedCol !== null && addColumn('right')} 
                  disabled={selectedCol === null}
                  className="px-2 py-1 bg-green-500 text-white rounded text-xs disabled:bg-gray-300"
                >
                  + Col
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td 
                    key={colIndex} 
                    className="border p-1"
                    onClick={() => {
                      setSelectedRow(rowIndex);
                      setSelectedCol(colIndex);
                    }}
                  >
                    <input
                      type="text"
                      value={cell}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateCell(rowIndex, colIndex, e.target.value)
                      }
                      className="w-full border-none outline-none p-1"
                    />
                  </td>
                ))}
                <td className="p-1">
                  <button 
                    onClick={deleteColumn}
                    disabled={selectedCol === null}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs disabled:bg-gray-300"
                  >
                    - Col
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Caption y Label */}
      <div className="mt-4 space-y-2">
        <input
          type="text"
          placeholder="Caption de la tabla"
          value={tableData.caption}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            onUpdate(element.id, { ...tableData, caption: e.target.value })
          }
          className="w-full border rounded px-2 py-1"
        />
        <input
          type="text"
          placeholder="Label (ej: tab:resultados)"
          value={tableData.label}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            onUpdate(element.id, { ...tableData, label: e.target.value })
          }
          className="w-full border rounded px-2 py-1"
        />
      </div>
    </div>
  );
};

export default TableEditor;
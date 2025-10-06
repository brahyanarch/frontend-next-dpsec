// components/ListEditor.tsx
import React, { useState, useEffect } from 'react';
import { DocumentElement } from '../types/latex';
import { List, Plus, Trash2, MoveUp, MoveDown, GripVertical } from 'lucide-react';

interface ListEditorProps {
  element: DocumentElement;
  onUpdate: (id: string, newContent: any) => void;
  isSelected: boolean;
}

const ListEditor: React.FC<ListEditorProps> = ({ 
  element, 
  onUpdate, 
  isSelected 
}) => {
  const [items, setItems] = useState<string[]>(['']);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Initialize with existing data
  useEffect(() => {
    if (element.content) {
      if (Array.isArray(element.content)) {
        setItems(element.content.length > 0 ? element.content : ['']);
      } else if (typeof element.content === 'string') {
        // Parse existing LaTeX list format
        const parsedItems = parseLatexList(element.content, element.type);
        setItems(parsedItems.length > 0 ? parsedItems : ['']);
      }
    }
  }, [element.content, element.type]);

  const parseLatexList = (content: string, type: string): string[] => {
    if (type === 'bulletList') {
      const itemMatches = content.match(/\\item\s+(.*?)(?=\\item|$)/);
      return itemMatches ? itemMatches.map(match => 
        match.replace(/\\item\s+/, '').trim()
      ) : [content];
    } else if (type === 'numberList') {
      const itemMatches = content.match(/\\item\s+(.*?)(?=\\item|$)/);
      return itemMatches ? itemMatches.map(match => 
        match.replace(/\\item\s+/, '').trim()
      ) : [content];
    }
    return [content];
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    saveItems(newItems);
  };

  const addItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index + 1, 0, '');
    setItems(newItems);
    saveItems(newItems);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    saveItems(newItems);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
    saveItems(newItems);
  };

  const saveItems = (newItems: string[]) => {
    const latexCode = generateLatexList(newItems, element.type);
    onUpdate(element.id, {
      items: newItems,
      latex: latexCode,
      displayText: `${newItems.length} elementos`
    });
  };

  const generateLatexList = (items: string[], type: string): string => {
    const environment = type === 'bulletList' ? 'itemize' : 'enumerate';
    let latex = `\\begin{${environment}}\n`;
    
    items.forEach(item => {
      if (item.trim()) {
        latex += `\\item ${item}\n`;
      }
    });
    
    latex += `\\end{${environment}}`;
    return latex;
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      moveItem(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  const getListIcon = (index: number) => {
    if (element.type === 'numberList') {
      return `${index + 1}.`;
    } else {
      return '•';
    }
  };

  return (
    <div className={`border rounded-lg ${isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-300'} bg-white`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <List size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {element.type === 'bulletList' ? 'Lista con Viñetas' : 'Lista Numerada'}
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{items.length} elementos</span>
        </div>
      </div>

      {/* List Items */}
      <div className="p-4 space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`flex items-start space-x-3 p-3 border rounded-lg transition-all ${
              draggedIndex === index 
                ? 'bg-blue-50 border-blue-300 shadow-sm' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Drag Handle */}
            <div className="flex-shrink-0 pt-2 cursor-move text-gray-400 hover:text-gray-600">
              <GripVertical size={16} />
            </div>

            {/* Item Number/Bullet */}
            <div className="flex-shrink-0 w-6 h-8 flex items-center justify-center text-sm font-medium text-gray-500">
              {getListIcon(index)}
            </div>

            {/* Text Input */}
            <div className="flex-1">
              <textarea
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={`Elemento ${index + 1}...`}
                rows={Math.max(2, Math.ceil(item.length / 50))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-1 flex-shrink-0">
              <button
                onClick={() => addItem(index)}
                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                title="Insertar elemento después"
              >
                <Plus size={16} />
              </button>
              
              {items.length > 1 && (
                <>
                  {index > 0 && (
                    <button
                      onClick={() => moveItem(index, index - 1)}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title="Mover arriba"
                    >
                      <MoveUp size={16} />
                    </button>
                  )}
                  
                  {index < items.length - 1 && (
                    <button
                      onClick={() => moveItem(index, index + 1)}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title="Mover abajo"
                    >
                      <MoveDown size={16} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => removeItem(index)}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar elemento"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Add First Item Button */}
        {items.length === 0 && (
          <button
            onClick={() => addItem(0)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>Agregar primer elemento</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {element.type === 'bulletList' ? 'Lista con viñetas' : 'Lista numerada'}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => addItem(items.length - 1)}
            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
          >
            <Plus size={14} />
            <span>Agregar Elemento</span>
          </button>
        </div>
      </div>

      {/* Vista previa del código LaTeX */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-2">Vista previa LaTeX:</div>
        <div className="p-3 bg-gray-900 text-green-400 rounded-md font-mono text-sm overflow-x-auto">
          <code>{generateLatexList(items, element.type)}</code>
        </div>
      </div>
    </div>
  );
};

export default ListEditor;
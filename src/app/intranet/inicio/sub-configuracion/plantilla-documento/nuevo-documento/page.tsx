// components/ElementForm.tsx
'use client';

import {  } from '../data/schema';

interface ElementFormProps {
  currentElement: Partial<DocumentElement>;
  updateCurrentElement: (updates: Partial<DocumentElement>) => void;
  addElement: () => void;
  addItem: () => void;
  updateItem: (index: number, value: string) => void;
  removeItem: (index: number) => void;
}

const ElementForm: React.FC<ElementFormProps> = ({
  currentElement,
  updateCurrentElement,
  addElement,
  addItem,
  updateItem,
  removeItem
}) => {
  const showContentField = currentElement.type && 
    ['section', 'subsection', 'subsubsection', 'text'].includes(currentElement.type);

  const showItemsField = currentElement.type && 
    ['itemize', 'enumerate'].includes(currentElement.type);

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de elemento
          </label>
          <select
            value={currentElement.type || ''}
            onChange={(e) => updateCurrentElement({ 
              type: e.target.value as DocumentElement['type'],
              contenido: '',
              items: ['']
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona un tipo</option>
            <option value="section">Sección</option>
            <option value="subsection">Subsección</option>
            <option value="subsubsection">Subsubsección</option>
            <option value="text">Texto</option>
            <option value="itemize">Lista con viñetas</option>
            <option value="enumerate">Lista numerada</option>
          </select>
        </div>

        {showContentField && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido
            </label>
            <input
              type="text"
              value={currentElement.contenido || ''}
              onChange={(e) => updateCurrentElement({ contenido: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                currentElement.type === 'text' 
                  ? 'Ingresa el texto' 
                  : 'Ingresa el título'
              }
            />
          </div>
        )}
      </div>

      {showItemsField && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Elementos de la lista
          </label>
          <div className="space-y-2">
            {(currentElement.items || []).map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Elemento de la lista"
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={(currentElement.items || []).length <= 1}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Agregar elemento
          </button>
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          id="element-editable"
          checked={currentElement.iseditable || false}
          onChange={(e) => updateCurrentElement({ iseditable: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="element-editable" className="ml-2 block text-sm text-gray-700">
          ¿Es editable?
        </label>
      </div>

      <button
        type="button"
        onClick={addElement}
        disabled={!currentElement.type}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Agregar Elemento
      </button>
    </div>
  );
};

export default ElementForm;
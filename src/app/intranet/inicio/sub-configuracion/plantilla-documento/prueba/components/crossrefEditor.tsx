// components/CrossrefEditor.tsx
import React, { useState, useEffect } from 'react';
import { DocumentElement, Reference } from '../types/latex';
import { Link, Search, BookOpen } from 'lucide-react';

interface CrossrefEditorProps {
  element: DocumentElement;
  onUpdate: (id: string, newContent: any) => void;
  references: Reference[];
  isSelected: boolean;
}

const CrossrefEditor: React.FC<CrossrefEditorProps> = ({ 
  element, 
  onUpdate, 
  references, 
  isSelected 
}) => {
  const [selectedReference, setSelectedReference] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReferenceList, setShowReferenceList] = useState(false);

  // Initialize with existing data
  useEffect(() => {
    if (element.content) {
      if (typeof element.content === 'string') {
        // Parse existing LaTeX ref format: \ref{label}
        const refMatch = element.content.match(/\\ref\{([^}]*)\}/);
        if (refMatch) {
          setSelectedReference(refMatch[1]);
        }
      } else {
        setSelectedReference(element.content.ref || '');
      }
    }
  }, [element.content]);

  const handleSave = () => {
    const latexCode = `\\ref{${selectedReference}}`;
    onUpdate(element.id, {
      ref: selectedReference,
      latex: latexCode,
      displayText: getReferenceDisplay(selectedReference)
    });
    setShowReferenceList(false);
  };

  const getReferenceDisplay = (refLabel: string): string => {
    const ref = references.find(r => r.label === refLabel);
    return ref ? `${ref.type}: ${ref.caption}` : 'Referencia no encontrada';
  };

  const filteredReferences = references.filter(ref =>
    ref.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedRef = references.find(ref => ref.label === selectedReference);

  return (
    <div className={`p-4 border rounded-lg ${isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-300'} bg-white`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Link size={20} />
          <span>Referencia Cruzada</span>
        </h3>
        <button
          onClick={() => setShowReferenceList(!showReferenceList)}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Search size={16} />
        </button>
      </div>

      {/* Referencia seleccionada */}
      {selectedReference && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-sm text-green-800">
                <BookOpen size={14} />
                <span className="font-medium">Referencia seleccionada:</span>
              </div>
              <div className="mt-1 text-green-900">
                {getReferenceDisplay(selectedReference)}
              </div>
              <div className="mt-1 text-xs text-green-700 font-mono">
                Label: {selectedReference}
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedReference('');
                onUpdate(element.id, '');
              }}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

      {/* Selector de referencias */}
      {showReferenceList && (
        <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Seleccionar Referencia</h4>
          
          {/* Barra de búsqueda */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Buscar referencias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Lista de referencias */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredReferences.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No se encontraron referencias
              </div>
            ) : (
              filteredReferences.map((ref) => (
                <div
                  key={ref.id}
                  onClick={() => setSelectedReference(ref.label)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedReference === ref.label
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          ref.type === 'table' ? 'bg-purple-100 text-purple-800' :
                          ref.type === 'figure' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {ref.type === 'table' ? 'Tabla' : 
                           ref.type === 'figure' ? 'Figura' : 'Sección'}
                        </span>
                        <span className="text-xs font-mono text-gray-600">
                          {ref.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">
                        {ref.caption}
                      </div>
                    </div>
                    {selectedReference === ref.label && (
                      <div className="text-green-600">
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Estadísticas */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex space-x-4 text-xs text-gray-600">
              <span>Tablas: {references.filter(r => r.type === 'table').length}</span>
              <span>Figuras: {references.filter(r => r.type === 'figure').length}</span>
              <span>Secciones: {references.filter(r => r.type === 'section').length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Vista previa del código LaTeX */}
      <div className="p-3 bg-gray-900 text-green-400 rounded-md font-mono text-sm">
        {selectedReference ? (
          <code>\\ref{'{'}{selectedReference}{'}'}</code>
        ) : (
          <code className="text-gray-400">\\ref{'{label}'}</code>
        )}
      </div>

      {/* Información */}
      <div className="mt-3 text-xs text-gray-600">
        <p>Las referencias cruzadas se actualizarán automáticamente al compilar el documento.</p>
      </div>
    </div>
  );
};

export default CrossrefEditor;
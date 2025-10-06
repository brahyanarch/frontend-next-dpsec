// components/CitationEditor.tsx
import React, { useState, useEffect } from 'react';
import { DocumentElement, Citation } from '../types/latex';
import { Book, Quote, Plus, Search, Library } from 'lucide-react';

interface CitationEditorProps {
  element: DocumentElement;
  onUpdate: (id: string, newContent: any) => void;
  citations: Citation[];
  isSelected: boolean;
}

const CitationEditor: React.FC<CitationEditorProps> = ({ 
  element, 
  onUpdate, 
  citations, 
  isSelected 
}) => {
  const [selectedCitations, setSelectedCitations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCitationList, setShowCitationList] = useState(false);

  // Initialize with existing data
  useEffect(() => {
    if (element.content) {
      if (typeof element.content === 'string') {
        // Parse existing LaTeX cite format: \cite{key1,key2}
        const citeMatch = element.content.match(/\\cite\{([^}]*)\}/);
        if (citeMatch) {
          const keys = citeMatch[1].split(',').map(k => k.trim());
          setSelectedCitations(keys);
        }
      } else {
        setSelectedCitations(element.content.keys || []);
      }
    }
  }, [element.content]);

  const handleSave = () => {
    const latexCode = `\\cite{${selectedCitations.join(',')}}`;
    onUpdate(element.id, {
      keys: selectedCitations,
      latex: latexCode,
      displayText: getCitationDisplay(selectedCitations)
    });
    setShowCitationList(false);
  };

  const getCitationDisplay = (keys: string[]): string => {
    if (keys.length === 0) return 'Sin citas seleccionadas';
    if (keys.length === 1) {
      const citation = citations.find(c => c.key === keys[0]);
      return citation ? citation.author : keys[0];
    }
    return `${keys.length} citas seleccionadas`;
  };

  const toggleCitation = (key: string) => {
    setSelectedCitations(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const filteredCitations = citations.filter(citation =>
    citation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    citation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    citation.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCitationObjects = citations.filter(c => selectedCitations.includes(c.key));

  return (
    <div className={`p-4 border rounded-lg ${isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-300'} bg-white`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Quote size={20} />
          <span>Cita Bibliográfica</span>
        </h3>
        <button
          onClick={() => setShowCitationList(!showCitationList)}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Library size={16} />
        </button>
      </div>

      {/* Citas seleccionadas */}
      {selectedCitations.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Citas seleccionadas ({selectedCitations.length})
            </span>
            <button
              onClick={() => setSelectedCitations([])}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Limpiar todas
            </button>
          </div>
          
          <div className="space-y-2">
            {selectedCitationObjects.map((citation) => (
              <div
                key={citation.key}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {citation.key}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {citation.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {citation.author}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleCitation(citation.key)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selector de citas */}
      {showCitationList && (
        <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Seleccionar Citas</h4>
          
          {/* Barra de búsqueda */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Buscar por título, autor o clave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Lista de citas */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredCitations.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No se encontraron citas
              </div>
            ) : (
              filteredCitations.map((citation) => (
                <div
                  key={citation.key}
                  onClick={() => toggleCitation(citation.key)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCitations.includes(citation.key)
                      ? 'bg-green-100 border-green-500'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {citation.key}
                        </span>
                        {selectedCitations.includes(citation.key) && (
                          <span className="text-green-600 text-sm">✓ Seleccionada</span>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {citation.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {citation.author}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Acciones */}
          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {citations.length} citas disponibles
            </span>
            <button
              onClick={handleSave}
              disabled={selectedCitations.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Aplicar Citas
            </button>
          </div>
        </div>
      )}

      {/* Vista previa del código LaTeX */}
      <div className="p-3 bg-gray-900 text-green-400 rounded-md font-mono text-sm mb-3">
        {selectedCitations.length > 0 ? (
          <code>\\cite{'{'}{selectedCitations.join(',')}{'}'}</code>
        ) : (
          <code className="text-gray-400">\\cite{'{key1,key2}'}</code>
        )}
      </div>

      {/* Información */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>• Selecciona múltiples citas para agruparlas</p>
        <p>• Asegúrate de incluir el archivo .bib en tu documento</p>
        <p>• Las citas se numerarán automáticamente al compilar</p>
      </div>
    </div>
  );
};

export default CitationEditor;
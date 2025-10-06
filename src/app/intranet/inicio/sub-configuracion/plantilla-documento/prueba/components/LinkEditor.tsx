// components/LinkEditor.tsx
import React, { useState, useEffect } from 'react';
import { DocumentElement } from '../types/latex';
import { ExternalLink, Edit, Save, X } from 'lucide-react';

interface LinkEditorProps {
  element: DocumentElement;
  onUpdate: (id: string, newContent: any) => void;
  isSelected: boolean;
}

interface LinkData {
  text: string;
  url: string;
  displayText: string;
}

const LinkEditor: React.FC<LinkEditorProps> = ({ 
  element, 
  onUpdate, 
  isSelected 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [linkData, setLinkData] = useState<LinkData>({
    text: '',
    url: '',
    displayText: ''
  });

  // Initialize with existing data or defaults
  useEffect(() => {
    if (element.content) {
      if (typeof element.content === 'string') {
        // Parse existing LaTeX href format: \href{url}{text}
        const hrefMatch = element.content.match(/\\href\{([^}]*)\}\{([^}]*)\}/);
        if (hrefMatch) {
          setLinkData({
            url: hrefMatch[1],
            text: hrefMatch[2],
            displayText: hrefMatch[2]
          });
        }
      } else {
        setLinkData(element.content);
      }
    } else {
      setLinkData({
        text: 'Enlace',
        url: 'https://',
        displayText: 'Enlace'
      });
    }
  }, [element.content]);

  const handleSave = () => {
    const latexCode = `\\href{${linkData.url}}{${linkData.text}}`;
    onUpdate(element.id, {
      ...linkData,
      latex: latexCode
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Restore original data
    if (element.content) {
      if (typeof element.content === 'string') {
        const hrefMatch = element.content.match(/\\href\{([^}]*)\}\{([^}]*)\}/);
        if (hrefMatch) {
          setLinkData({
            url: hrefMatch[1],
            text: hrefMatch[2],
            displayText: hrefMatch[2]
          });
        }
      } else {
        setLinkData(element.content);
      }
    }
    setIsEditing(false);
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getDisplayUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname !== '/' ? urlObj.pathname : ''}`;
    } catch {
      return url;
    }
  };

  const isUrlValid = validateUrl(linkData.url);

  if (!isEditing) {
    return (
      <div 
        className={`p-3 border border-gray-300 rounded-lg hover:border-blue-400 transition-colors ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
        }`}
        onClick={() => setIsEditing(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <ExternalLink size={16} className="text-gray-500 flex-shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-blue-600 font-medium truncate">
                {linkData.displayText || linkData.text || 'Enlace'}
              </span>
              <span className="text-gray-500 text-sm truncate">
                {getDisplayUrl(linkData.url)}
              </span>
            </div>
          </div>
          <Edit size={16} className="text-gray-400 flex-shrink-0" />
        </div>
        
        {/* Preview of LaTeX code */}
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono text-gray-600">
          {`\\href{${linkData.url}}{${linkData.text}}`}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border-2 border-blue-500 rounded-lg bg-white ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <ExternalLink size={20} />
          <span>Editar Enlace</span>
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={!linkData.text.trim() || !linkData.url.trim() || !isUrlValid}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            title="Guardar enlace"
          >
            <Save size={16} />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            title="Cancelar"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Texto del enlace */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Texto del enlace *
          </label>
          <input
            type="text"
            value={linkData.text}
            onChange={(e) => setLinkData(prev => ({ 
              ...prev, 
              text: e.target.value,
              displayText: e.target.value 
            }))}
            placeholder="Ej: Visitar nuestro sitio web"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>

        {/* URL del enlace */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL del enlace *
          </label>
          <input
            type="url"
            value={linkData.url}
            onChange={(e) => setLinkData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://ejemplo.com"
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              linkData.url && !isUrlValid ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {linkData.url && !isUrlValid && (
            <p className="mt-1 text-sm text-red-600">
              Por favor, ingresa una URL válida (debe comenzar con http:// o https://)
            </p>
          )}
          <div className="mt-1 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLinkData(prev => ({ ...prev, url: 'https://' }))}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              https://
            </button>
            <button
              type="button"
              onClick={() => setLinkData(prev => ({ ...prev, url: 'http://' }))}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              http://
            </button>
            <button
              type="button"
              onClick={() => setLinkData(prev => ({ ...prev, url: 'mailto:ejemplo@email.com' }))}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              mailto:
            </button>
          </div>
        </div>

        {/* Vista previa del enlace */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vista previa
          </label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            {linkData.text && linkData.url && isUrlValid ? (
              <a 
                href={linkData.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center space-x-1"
              >
                <span>{linkData.text}</span>
                <ExternalLink size={12} />
              </a>
            ) : (
              <span className="text-gray-500 italic">
                {!linkData.text ? 'Texto del enlace' : 'URL inválida'}
              </span>
            )}
          </div>
        </div>

        {/* Código LaTeX generado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código LaTeX generado
          </label>
          <div className="p-3 bg-gray-900 text-green-400 rounded-md font-mono text-sm overflow-x-auto">
            {linkData.text && linkData.url ? (
              <code>
                \\href{'{'}{linkData.url}{'}'}{'{'}{linkData.text}{'}'}
              </code>
            ) : (
              <code className="text-gray-400">
                \\href{'{URL}'}{'{Texto}'}
              </code>
            )}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!linkData.text.trim() || !linkData.url.trim() || !isUrlValid}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Guardar Enlace
        </button>
      </div>
    </div>
  );
};

export default LinkEditor;
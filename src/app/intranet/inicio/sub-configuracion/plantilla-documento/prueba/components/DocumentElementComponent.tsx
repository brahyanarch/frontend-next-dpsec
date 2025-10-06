// components/DocumentElementComponent.tsx
import React from 'react';
import { DocumentElement, Reference, Citation } from '../types/latex';
import TableEditor from './TableEditor';
import ImageEditor from './ImageEditor';
import LinkEditor from './LinkEditor';
import CrossrefEditor from './crossrefEditor';
import CitationEditor from './CitationEditor';
import ListEditor from './ListEditor';

interface DocumentElementProps {
  element: DocumentElement;
  onUpdate: (id: string, newContent: any) => void;
  onSelect: (id: string) => void;
  onTextSelect: (elementId: string, selection: Selection) => void;
  references: Reference[];
  citations: Citation[];
  isSelected: boolean;
}

const DocumentElementComponent: React.FC<DocumentElementProps> = ({ 
  element, 
  onUpdate, 
  onSelect, 
  onTextSelect,
  references,
  citations,
  isSelected 
}) => {
  const handleTextSelect = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      onTextSelect(element.id, selection);
    }
  };

  const handleInputFocus = () => {
    onSelect(element.id);
  };

  switch (element.type) {
    case 'section':
    case 'subsection':
    case 'subsubsection':
      return (
        <input
          type="text"
          value={element.content as string}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(element.id, e.target.value)}
          className={`w-full text-2xl font-bold border-none outline-none bg-transparent p-2 ${
            isSelected ? 'ring-2 ring-blue-500' : ''
          }`}
          placeholder={`Escribe el ${element.type}...`}
          onFocus={handleInputFocus}
        />
      );

    case 'paragraph':
      return (
        <div 
          className={`p-2 rounded ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          onFocus={handleInputFocus}
        >
          <textarea
            value={element.content as string}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate(element.id, e.target.value)}
            onMouseUp={handleTextSelect}
            className="w-full min-h-[100px] border-none outline-none resize-none"
            placeholder="Escribe tu párrafo..."
          />
        </div>
      );

    case 'table':
      return (
        <TableEditor 
          element={element} 
          onUpdate={onUpdate} 
          isSelected={isSelected} 
        />
      );

    case 'image':
      return (
        <ImageEditor 
          imageUrl='https://via.placeholder.com/600x400.png?text=Sample+Image'
        />
      );

    case 'math':
      return (
        <div className={`p-2 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
          <input
            type="text"
            value={element.content as string}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(element.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Escribe tu fórmula matemática..."
            onFocus={handleInputFocus}
          />
          <div className="text-sm text-gray-500 mt-1">
            Vista previa: \\({element.content || 'fórmula'}\\)
          </div>
        </div>
      );

    case 'link':
      return (
        <LinkEditor 
          element={element} 
          onUpdate={onUpdate} 
          isSelected={isSelected} 
        />
      );

    case 'crossref':
      return (
        <CrossrefEditor 
          element={element} 
          onUpdate={onUpdate} 
          references={references} 
          isSelected={isSelected} 
        />
      );

    case 'cite':
      return (
        <CitationEditor 
          element={element} 
          onUpdate={onUpdate} 
          citations={citations} 
          isSelected={isSelected} 
        />
      );

    case 'bulletList':
    case 'numberList':
      return (
        <ListEditor 
          element={element} 
          onUpdate={onUpdate} 
          isSelected={isSelected} 
        />
      );

    case 'bold':
      return (
        <span
          className={`font-bold ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => onSelect(element.id)}
        >
          {element.content as string}
        </span>
      );

    case 'italic':
      return (
        <span
          className={`italic ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => onSelect(element.id)}
        >
          {element.content as string}
        </span>
      );

    default:
      const exhaustiveCheck: never = element.type;
      return null;
  }
};

export default DocumentElementComponent;
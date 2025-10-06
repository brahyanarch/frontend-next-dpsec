// components/LatexVisualEditor.tsx
import { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Link, Image, Table, List, 
  Hash, Sigma, BookOpen, Quote
} from 'lucide-react';
import Toolbar from './Toolbar';
import DocumentElementComponent from './DocumentElementComponent';
//import FloatingFormatMenu from './FloatingFormatMenu';
import {
  DocumentElement,
  ElementType,
  Reference,
  Citation,
  SelectedText,
  FormatMenuPosition
} from '../types/latex';

export default function LatexVisualEditor() {
  const [elements, setElements] = useState<DocumentElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [references, setReferences] = useState<Reference[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [showFormatMenu, setShowFormatMenu] = useState<boolean>(false);
  const [formatMenuPosition, setFormatMenuPosition] = useState<FormatMenuPosition>({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState<SelectedText>({ 
    elementId: null, 
    start: 0, 
    end: 0 
  });

  const addElement = (type: ElementType, initialContent: any = ''): void => {
    const newElement: DocumentElement = {
      id: Date.now().toString(),
      type,
      content: initialContent,
      metadata: {}
    };

    switch (type) {
      case 'section':
      case 'subsection':
      case 'subsubsection':
        newElement.content = 'Nuevo título';
        break;
      case 'table':
        newElement.content = {
          rows: 3,
          cols: 3,
          data: Array(3).fill(null).map(() => Array(3).fill('')),
          alignments: Array(3).fill('left'),
          borders: 'all' as const,
          caption: '',
          label: ''
        };
        break;
      case 'image':
        newElement.content = {
          url: '',
          caption: '',
          label: ''
        };
        break;
      case 'bulletList':
      case 'numberList':
        newElement.content = ['Primer elemento'];
        break;
      default:
        newElement.content = initialContent;
    }

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateElement = (id: string, newContent: any): void => {
    setElements(prev => 
      prev.map(el => el.id === id ? { ...el, content: newContent } : el)
    );
  };

  const applyTextFormat = (format: 'bold' | 'italic'): void => {
    if (!selectedText.elementId) return;

    const element = elements.find(el => el.id === selectedText.elementId);
    if (!element || element.type !== 'paragraph') return;

    const text: string = element.content;
    const selected = text.substring(selectedText.start, selectedText.end);
    
    let newText = '';
    switch (format) {
      case 'bold':
        newText = text.substring(0, selectedText.start) + 
                 `\\textbf{${selected}}` + 
                 text.substring(selectedText.end);
        break;
      case 'italic':
        newText = text.substring(0, selectedText.start) + 
                 `\\textit{${selected}}` + 
                 text.substring(selectedText.end);
        break;
      default:
        return;
    }

    updateElement(selectedText.elementId, newText);
    setShowFormatMenu(false);
  };

  const handleTextSelection = (elementId: string, selection: Selection): void => {
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    setSelectedText({
      elementId,
      start: range.startOffset,
      end: range.endOffset
    });
    
    setFormatMenuPosition({ 
      x: rect.left, 
      y: rect.top - 50 
    });
    setShowFormatMenu(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toolbar onAddElement={addElement} />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          {elements.map((element) => (
            <div key={element.id} className="mb-4">
              <DocumentElementComponent
                element={element}
                onUpdate={updateElement}
                onSelect={setSelectedElement}
                onTextSelect={handleTextSelection}
                references={references}
                citations={citations}
                isSelected={selectedElement === element.id}
              />
            </div>
          ))}
          
          {elements.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <p>Comienza agregando elementos desde la barra de herramientas</p>
            </div>
          )}
        </div>
      </div>

      {showFormatMenu && (
        
        <div>sad</div>

      )}
    </div>
  );
}
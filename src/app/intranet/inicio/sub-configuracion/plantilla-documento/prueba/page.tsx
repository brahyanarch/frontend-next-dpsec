// app/configuracion/document-template/page.tsx
'use client';
import { useState } from 'react';

type ContentItem = 
  | { type: 'section'; title: string; content: ContentItem[] }
  | { type: 'subsection'; title: string; content: ContentItem[] }
  | { type: 'subsubsection'; title: string; content: ContentItem[] }
  | { type: 'text'; content: string }
  | { type: 'enumerate'; items: string[] }
  | { type: 'itemize'; items: string[] }
  | { type: 'table'; data: string[][] }
  | { type: 'image'; url: string; caption: string; width?: string };

export default function DocumentTemplate() {
  const [documentContent, setDocumentContent] = useState<ContentItem[]>([]);
  const [showLatex, setShowLatex] = useState(false);

  const addItem = (type: ContentItem['type'], parentPath: number[] = []) => {
    const newItem: ContentItem = (() => {
      switch (type) {
        case 'section':
        case 'subsection':
        case 'subsubsection':
          return { type, title: '', content: [] };
        case 'text':
          return { type, content: '' };
        case 'enumerate':
        case 'itemize':
          return { type, items: [''] };
        case 'table':
          return { type, data: [['', ''], ['', '']] };
        case 'image':
          return { type, url: '', caption: '', width: '0.8' };
      }
    })();

    setDocumentContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      let currentLevel = newContent;
      
      for (const index of parentPath) {
        const section = currentLevel[index] as Extract<ContentItem, { content: ContentItem[] }>;
        currentLevel = section.content;
      }
      
      currentLevel.push(newItem);
      return newContent;
    });
  };

  const removeItem = (path: number[]) => {
    setDocumentContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      
      if (path.length === 1) {
        // Eliminar elemento del nivel raíz
        newContent.splice(path[0], 1);
        return newContent;
      }
      
      // Eliminar elemento anidado
      let current = newContent;
      for (let i = 0; i < path.length - 1; i++) {
        const section = current[path[i]] as Extract<ContentItem, { content: ContentItem[] }>;
        current = section.content;
      }
      
      current.splice(path[path.length - 1], 1);
      return newContent;
    });
  };

  const updateItem = (path: number[], updates: Partial<ContentItem>) => {
    setDocumentContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      let current = newContent;
      
      for (let i = 0; i < path.length - 1; i++) {
        const section = current[path[i]] as Extract<ContentItem, { content: ContentItem[] }>;
        current = section.content;
      }
      
      current[path[path.length - 1]] = { ...current[path[path.length - 1]], ...updates };
      return newContent;
    });
  };

  const generateLatexCode = (content: ContentItem[] = documentContent, level: number = 0): string => {
    return content.map(item => {
      const indent = '  '.repeat(level);
      
      switch (item.type) {
        case 'section':
          return `${indent}\\section{${item.title || 'Título de sección'}}\n${generateLatexCode(item.content, level + 1)}`;
        
        case 'subsection':
          return `${indent}\\subsection{${item.title || 'Título de subsección'}}\n${generateLatexCode(item.content, level + 1)}`;
        
        case 'subsubsection':
          return `${indent}\\subsubsection{${item.title || 'Título de subsubsección'}}\n${generateLatexCode(item.content, level + 1)}`;
        
        case 'text':
          return `${indent}${item.content}`;
        
        case 'enumerate':
          const enumerateItems = item.items.filter(i => i.trim()).map(i => `${indent}  \\item ${i}`).join('\n');
          return item.items.filter(i => i.trim()).length > 0 
            ? `${indent}\\begin{enumerate}\n${enumerateItems}\n${indent}\\end{enumerate}`
            : '';
        
        case 'itemize':
          const itemizeItems = item.items.filter(i => i.trim()).map(i => `${indent}  \\item ${i}`).join('\n');
          return item.items.filter(i => i.trim()).length > 0
            ? `${indent}\\begin{itemize}\n${itemizeItems}\n${indent}\\end{itemize}`
            : '';
        
        case 'table':
          if (item.data.length === 0 || !item.data.some(row => row.some(cell => cell.trim()))) return '';
          const columns = 'l'.repeat(item.data[0].length);
          const tableRows = item.data
            .filter(row => row.some(cell => cell.trim()))
            .map(row => `${indent}  ${row.join(' & ')} \\\\`)
            .join('\n');
          return `${indent}\\begin{tabular}{${columns}}\n${tableRows}\n${indent}\\end{tabular}`;
        
        case 'image':
          if (!item.url.trim()) return '';
          const width = item.width ? `[width=${item.width}\\textwidth]` : '';
          const caption = item.caption ? `\n${indent}\\caption{${item.caption}}` : '';
          return `${indent}\\begin{figure}[h]\n${indent}  \\centering\n${indent}  \\includegraphics${width}{${item.url}}${caption}\n${indent}\\end{figure}`;
        
        default:
          return '';
      }
    }).filter(item => item.trim()).join('\n\n');
  };

  const renderContent = (content: ContentItem[], path: number[] = []) => {
    return content.map((item, index) => {
      const currentPath = [...path, index];
      
      const renderDeleteButton = () => (
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs ml-2"
          onClick={() => removeItem(currentPath)}
          title="Eliminar elemento"
        >
          🗑️ Eliminar
        </button>
      );

      const renderAddButtons = (showSubsections: boolean = true) => (
        <div className="flex gap-2 mt-2 flex-wrap">
          {showSubsections && (
            <>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                onClick={() => addItem('subsection', currentPath)}
              >
                + Subsección
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                onClick={() => addItem('subsubsection', currentPath)}
              >
                + Subsubsección
              </button>
            </>
          )}
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            onClick={() => addItem('text', currentPath)}
          >
            + Texto
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
            onClick={() => addItem('enumerate', currentPath)}
          >
            + Lista Ordenada
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
            onClick={() => addItem('itemize', currentPath)}
          >
            + Lista No Ordenada
          </button>
          <button
            className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm"
            onClick={() => addItem('table', currentPath)}
          >
            + Tabla
          </button>
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-sm"
            onClick={() => addItem('image', currentPath)}
          >
            + Imagen
          </button>
        </div>
      );

      switch (item.type) {
        case 'section':
          return (
            <div key={index} className="ml-0 my-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
              <div className="flex items-center justify-between mb-2">
                <input
                  className="text-xl font-bold block w-full p-2 border rounded"
                  value={item.title}
                  onChange={(e) => updateItem(currentPath, { title: e.target.value })}
                  placeholder="Título de sección"
                />
                {renderDeleteButton()}
              </div>
              {renderContent(item.content, currentPath)}
              {renderAddButtons(true)}
            </div>
          );

        case 'subsection':
          return (
            <div key={index} className="ml-4 my-3 p-3 border-l-4 border-green-500 bg-green-50 rounded">
              <div className="flex items-center justify-between mb-2">
                <input
                  className="text-lg font-semibold block w-full p-2 border rounded"
                  value={item.title}
                  onChange={(e) => updateItem(currentPath, { title: e.target.value })}
                  placeholder="Título de subsección"
                />
                {renderDeleteButton()}
              </div>
              {renderContent(item.content, currentPath)}
              {renderAddButtons(true)}
            </div>
          );

        case 'subsubsection':
          return (
            <div key={index} className="ml-8 my-2 p-2 border-l-4 border-yellow-500 bg-yellow-50 rounded">
              <div className="flex items-center justify-between mb-2">
                <input
                  className="text-md font-medium block w-full p-2 border rounded"
                  value={item.title}
                  onChange={(e) => updateItem(currentPath, { title: e.target.value })}
                  placeholder="Título de subsubsección"
                />
                {renderDeleteButton()}
              </div>
              {renderContent(item.content, currentPath)}
              {renderAddButtons(false)}
            </div>
          );

        case 'text':
          return (
            <div key={index} className="ml-4 my-2 p-3 bg-white border rounded">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-500 font-medium">Texto</span>
                {renderDeleteButton()}
              </div>
              <textarea
                className="w-full p-2 border rounded"
                value={item.content}
                onChange={(e) => updateItem(currentPath, { content: e.target.value })}
                placeholder="Escribe tu texto aquí..."
                rows={3}
              />
            </div>
          );

        case 'enumerate':
          return (
            <div key={index} className="ml-4 my-2 p-3 bg-white border rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 font-medium">Lista Ordenada</span>
                {renderDeleteButton()}
              </div>
              <ol className="list-decimal list-inside">
                {item.items.map((listItem, itemIndex) => (
                  <li key={itemIndex} className="my-1">
                    <input
                      className="w-full p-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      value={listItem}
                      onChange={(e) => {
                        const newItems = [...item.items];
                        newItems[itemIndex] = e.target.value;
                        updateItem(currentPath, { items: newItems });
                      }}
                      placeholder={`Elemento ${itemIndex + 1}`}
                    />
                  </li>
                ))}
              </ol>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded mt-1 text-xs"
                onClick={() => updateItem(currentPath, { 
                  items: [...item.items, ''] 
                })}
              >
                + Agregar elemento
              </button>
            </div>
          );

        case 'itemize':
          return (
            <div key={index} className="ml-4 my-2 p-3 bg-white border rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 font-medium">Lista No Ordenada</span>
                {renderDeleteButton()}
              </div>
              <ul className="list-disc list-inside">
                {item.items.map((listItem, itemIndex) => (
                  <li key={itemIndex} className="my-1">
                    <input
                      className="w-full p-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      value={listItem}
                      onChange={(e) => {
                        const newItems = [...item.items];
                        newItems[itemIndex] = e.target.value;
                        updateItem(currentPath, { items: newItems });
                      }}
                      placeholder={`Elemento ${itemIndex + 1}`}
                    />
                  </li>
                ))}
              </ul>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded mt-1 text-xs"
                onClick={() => updateItem(currentPath, { 
                  items: [...item.items, ''] 
                })}
              >
                + Agregar elemento
              </button>
            </div>
          );

        case 'table':
          return (
            <div key={index} className="ml-4 my-3 p-3 bg-white border rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 font-medium">Tabla</span>
                {renderDeleteButton()}
              </div>
              <div className="overflow-x-auto">
                <table className="border-collapse border border-gray-400 min-w-full">
                  <tbody>
                    {item.data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border border-gray-300 p-1">
                            <input
                              className="w-full p-1 min-w-[80px] focus:outline-none focus:border-blue-500"
                              value={cell}
                              onChange={(e) => {
                                const newData = item.data.map(r => [...r]);
                                newData[rowIndex][cellIndex] = e.target.value;
                                updateItem(currentPath, { data: newData });
                              }}
                              placeholder={`Celda ${rowIndex + 1}-${cellIndex + 1}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                  onClick={() => updateItem(currentPath, {
                    data: [...item.data, Array(item.data[0].length).fill('')]
                  })}
                >
                  + Fila
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                  onClick={() => updateItem(currentPath, {
                    data: item.data.map(row => [...row, ''])
                  })}
                >
                  + Columna
                </button>
              </div>
            </div>
          );

        case 'image':
          return (
            <div key={index} className="ml-4 my-3 p-3 bg-white border rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 font-medium">Imagen</span>
                {renderDeleteButton()}
              </div>
              <div className="space-y-2">
                <input
                  type="url"
                  className="w-full p-2 border rounded"
                  value={item.url}
                  onChange={(e) => updateItem(currentPath, { url: e.target.value })}
                  placeholder="URL de la imagen"
                />
                <input
                  className="w-full p-2 border rounded"
                  value={item.caption}
                  onChange={(e) => updateItem(currentPath, { caption: e.target.value })}
                  placeholder="Pie de imagen (opcional)"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Ancho:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={item.width || '0.8'}
                    onChange={(e) => updateItem(currentPath, { width: e.target.value })}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600">{(parseFloat(item.width || '0.8') * 100).toFixed(0)}%</span>
                </div>
                {item.url && (
                  <div className="mt-2 p-2 border rounded bg-gray-50">
                    <img 
                      src={item.url} 
                      alt={item.caption || 'Imagen'} 
                      className="max-w-full h-auto mx-auto"
                      style={{ maxWidth: `${(parseFloat(item.width || '0.8') * 100)}%` }}
                    />
                    {item.caption && (
                      <p className="text-center text-sm text-gray-600 mt-2">{item.caption}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );

        default:
          return null;
      }
    });
  };

  const latexCode = generateLatexCode();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Plantilla Documentaria LaTeX</h1>
      
      <div className="flex gap-2 mb-6 flex-wrap">
        <button 
          onClick={() => addItem('section')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          + Sección
        </button>
        <button 
          onClick={() => addItem('text')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          + Texto
        </button>
        <button 
          onClick={() => addItem('enumerate')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
        >
          + Lista Ordenada
        </button>
        <button 
          onClick={() => addItem('itemize')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition"
        >
          + Lista No Ordenada
        </button>
        <button 
          onClick={() => addItem('table')}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition"
        >
          + Tabla
        </button>
        <button 
          onClick={() => addItem('image')}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded transition"
        >
          + Imagen
        </button>
        <button 
          onClick={() => setShowLatex(!showLatex)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
        >
          {showLatex ? 'Ocultar LaTeX' : 'Ver Código LaTeX'}
        </button>
        {documentContent.length > 0 && (
          <button 
            onClick={() => setDocumentContent([])}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            Limpiar Todo
          </button>
        )}
      </div>

      {showLatex && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Código LaTeX Generado:</h3>
          <pre className="text-sm bg-white p-4 rounded border overflow-x-auto max-h-96 overflow-y-auto">
            {latexCode || "// Agrega contenido para generar código LaTeX"}
          </pre>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => navigator.clipboard.writeText(latexCode)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Copiar Código LaTeX
            </button>
            <button
              onClick={() => {
                const blob = new Blob([latexCode], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'documento.tex';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Descargar Archivo .tex
            </button>
          </div>
        </div>
      )}

      <div className="border rounded-lg p-6 bg-gray-50 shadow-sm">
        {documentContent.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Comienza agregando un elemento a tu documento
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <button 
                onClick={() => addItem('section')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              >
                + Sección
              </button>
              <button 
                onClick={() => addItem('text')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              >
                + Texto
              </button>
            </div>
          </div>
        ) : (
          renderContent(documentContent)
        )}
      </div>
    </div>
  );
}
// app/page.tsx
'use client'; // This must be a Client Component because it uses state and event handlers

import { useState } from 'react';
import LatexVisualEditor from './components/LatexVisualEditor';
import { generateLatexCode } from './utils/LatexGenerator';
import { DocumentElement } from './types/latex';

export default function HomePage() {
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationLog, setCompilationLog] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // This function would receive the elements from your LatexVisualEditor
  const handleCompile = async (elements: DocumentElement[]) => {
    setIsCompiling(true);
    setCompilationLog('Compiling...');
    
    try {
      // 1. Generate LaTeX code from editor elements
      const latexCode = generateLatexCode(elements);
      console.log('Generated LaTeX:', latexCode); // For debugging
      
      // 2. Send to your compilation API
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latexCode: latexCode,
          dependencies: ['graphicx', 'amsmath', 'hyperref', 'booktabs']
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.logs || 'Compilation failed');
      }

      // 3. Handle the PDF response
      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setCompilationLog('Compilation successful!');
      
    } catch (error) {
      console.error('Compilation error:', error);
      setCompilationLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleNewDocument = () => {
    // Logic to reset the editor to initial state
    setPdfUrl(null);
    setCompilationLog('');
  };

  const handleSaveTemplate = () => {
    // Logic to save the current document as a template
    console.log('Saving template...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                LaTeX Document Orchestrator
              </h1>
              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Beta
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleNewDocument}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                New Document
              </button>
              
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save as Template
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Editor Section */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Visual LaTeX Editor
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Build your document visually without writing LaTeX code
                </p>
              </div>
              
              <div className="p-6">
                <LatexVisualEditor onCompile={handleCompile} />
              </div>
            </div>
          </div>

          {/* Preview & Output Section */}
          <div className="lg:w-2/5 flex flex-col gap-6">
            {/* Compilation Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Document Compilation
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleCompile([])} // You'll need to pass actual elements from your editor
                  disabled={isCompiling}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isCompiling ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Compiling...
                    </span>
                  ) : 'Compile to PDF'}
                </button>

                {/* Compilation Status */}
                {compilationLog && (
                  <div className={`p-3 rounded-md text-sm ${
                    compilationLog.includes('Error') 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : compilationLog.includes('successful')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    <div className="font-medium">
                      {compilationLog.includes('Error') ? 'Compilation Failed' : 
                       compilationLog.includes('successful') ? 'Success' : 'Status'}
                    </div>
                    <div className="mt-1">{compilationLog}</div>
                  </div>
                )}
              </div>
            </div>

            {/* PDF Preview */}
            {pdfUrl && (
              <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    PDF Preview
                  </h3>
                </div>
                
                <div className="flex-1 p-4">
                  <iframe 
                    src={pdfUrl}
                    className="w-full h-full min-h-[500px] border border-gray-200 rounded-md"
                    title="Compiled PDF Document"
                  />
                  
                  <div className="mt-4 flex justify-end space-x-3">
                    <a
                      href={pdfUrl}
                      download="document.pdf"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200"
                    >
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  Import .bib File
                </button>
                <button className="p-3 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  Manage Templates
                </button>
                <button className="p-3 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  Export Project
                </button>
                <button className="p-3 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  Project Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
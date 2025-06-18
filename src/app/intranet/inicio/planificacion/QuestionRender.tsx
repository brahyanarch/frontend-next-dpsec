import React, { ChangeEvent } from 'react';
import { Question, QuestionType, AnswerValue } from '@/types/project.type';

interface QuestionRendererProps {
  question: Question;
  value: AnswerValue;
  error: string | null;
  onChange: (value: AnswerValue) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ 
  question, 
  value, 
  error,
  onChange 
}) => {
  const renderInput = () => {
    switch (question.type) {
      case QuestionType.TEXT:
        return (
          <input
            type="text"
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
        );
        
      case QuestionType.NUMBER:
        return (
          <input
            type="number"
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
        );
        
      case QuestionType.DATE:
        return (
          <input
            type="date"
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
        );
        
      case QuestionType.FILE:
        return (
          <div className="flex items-center">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click para subir</span> o arrastra un archivo
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onChange(e.target.files[0]);
                  }
                }}
              />
            </label>
            {value && (
              <span className="ml-4 text-sm text-gray-500">
                {(value as File).name || "Archivo seleccionado"}
              </span>
            )}
          </div>
        );
        
      case QuestionType.SINGLECHOICE:
        return (
          <div className="space-y-2">
            {question.opcs.map(opcion => (
              <div key={opcion.idOpc} className="flex items-center">
                <input
                  type="radio"
                  id={`radio-${question.idp}-${opcion.idOpc}`}
                  name={`radio-${question.idp}`}
                  checked={value === opcion.idOpc}
                  onChange={() => onChange(opcion.idOpc)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label 
                  htmlFor={`radio-${question.idp}-${opcion.idOpc}`} 
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  {opcion.txtOpc}
                </label>
              </div>
            ))}
          </div>
        );
        
      case QuestionType.MULTIPLECHOICE:
        return (
          <div className="space-y-2">
            {question.opcs.map(opcion => (
              <div key={opcion.idOpc} className="flex items-center">
                <input
                  type="checkbox"
                  id={`checkbox-${question.idp}-${opcion.idOpc}`}
                  checked={(value as number[] || []).includes(opcion.idOpc)}
                  onChange={(e) => {
                    const current = (value as number[] || []);
                    if (e.target.checked) {
                      onChange([...current, opcion.idOpc]);
                    } else {
                      onChange(current.filter(id => id !== opcion.idOpc));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label 
                  htmlFor={`checkbox-${question.idp}-${opcion.idOpc}`} 
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  {opcion.txtOpc}
                </label>
              </div>
            ))}
          </div>
        );
        
      case QuestionType.DROPDOWN:
        return (
          <select
            value={value as string || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
          >
            <option value="">Selecciona una opción</option>
            {question.opcs.map(opcion => (
              <option key={opcion.idOpc} value={opcion.idOpc}>
                {opcion.txtOpc}
              </option>
            ))}
          </select>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      id={`question-${question.idp}`}
      className={`p-4 rounded-lg border ${
        error ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
      }`}
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {question.nmPrg} {error && <span className="text-red-500">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default QuestionRenderer;
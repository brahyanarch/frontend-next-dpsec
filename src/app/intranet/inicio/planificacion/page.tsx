"use client"
import React, { useState } from 'react';
import DynamicForm from './DinamycForm';
import { Question, QuestionType } from '@/types/project.type';

const HomePage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<string | null>(null);

  // Datos de ejemplo basados en el JSON proporcionado
  const questionsData: Question[] = [
    {
      "idp": 5,
      "opcs": [],
      "nmPrg": "Pregunta de texto",
      "type": QuestionType.TEXT
    },
    {
      "idp": 6,
      "opcs": [
        {
          "idOpc": 23,
          "idp": 6,
          "txtOpc": "Opción 1"
        },
        {
          "idOpc": 24,
          "idp": 6,
          "txtOpc": "Opción 2"
        }
      ],
      "nmPrg": "Selección única",
      "type": QuestionType.SINGLECHOICE
    },
    {
      "idp": 34,
      "opcs": [
        {
          "idOpc": 25,
          "idp": 34,
          "txtOpc": "Cambios 1"
        },
        {
          "idOpc": 26,
          "idp": 34,
          "txtOpc": "Cambios 2"
        },
        {
          "idOpc": 27,
          "idp": 34,
          "txtOpc": "Cambios 3"
        }
      ],
      "nmPrg": "Selección múltiple",
      "type": QuestionType.MULTIPLECHOICE
    },
    {
      "idp": 35,
      "opcs": [
        {
          "idOpc": 28,
          "idp": 35,
          "txtOpc": "Desplegable 1"
        },
        {
          "idOpc": 29,
          "idp": 35,
          "txtOpc": "Desplegable 2"
        },
        {
          "idOpc": 30,
          "idp": 35,
          "txtOpc": "Desplegable 3"
        }
      ],
      "nmPrg": "Desplegable",
      "type": QuestionType.DROPDOWN
    },
    {
      "idp": 36,
      "opcs": [],
      "nmPrg": "Subir archivo adicional",
      "type": QuestionType.FILE
    },
    {
      "idp": 37,
      "opcs": [],
      "nmPrg": "Gastos aproximados",
      "type": QuestionType.NUMBER
    },
    {
      "idp": 38,
      "opcs": [],
      "nmPrg": "Fecha máxima de aceptación",
      "type": QuestionType.DATE
    }
  ];

  const handleSubmit = (answers: Record<number, any>) => {
    setIsSubmitting(true);
    setSubmissionResult(null);
    
    // Simular envío a la API
    setTimeout(() => {
      console.log('Respuestas enviadas:', answers);
      setIsSubmitting(false);
      setSubmissionResult('¡Formulario enviado correctamente!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Formulario Dinámico con Next.js
        </h1>
        
        {submissionResult && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-700 font-medium">{submissionResult}</p>
          </div>
        )}
        
        <DynamicForm 
          questions={questionsData} 
          onSubmit={handleSubmit} 
          loading={isSubmitting} 
        />
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Este formulario se genera dinámicamente basado en datos JSON</p>
          <p className="mt-2">Todos los campos son obligatorios y se validan antes de enviar</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
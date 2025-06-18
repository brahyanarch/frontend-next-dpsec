"use client"
import React, { useState, useEffect } from 'react';
import { Question, Answers, Errors, QuestionType, AnswerValue } from '@/types/project.type';
import QuestionRenderer from './QuestionRender';
import FormSubmit from './formSubmit';
import FormError from './FormError';

interface DynamicFormProps {
  questions: Question[];
  onSubmit: (answers: Answers) => void;
  loading?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ questions, onSubmit, loading = false }) => {
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Inicializar respuestas
  useEffect(() => {
    const initialAnswers: Answers = {};
    questions.forEach(q => {
      if (q.type === QuestionType.MULTIPLECHOICE) {
        initialAnswers[q.idp] = [];
      } else {
        initialAnswers[q.idp] = '';
      }
    });
    setAnswers(initialAnswers);
  }, [questions]);

  const handleChange = (idp: number, value: AnswerValue) => {
    setAnswers(prev => ({
      ...prev,
      [idp]: value
    }));
    
    // Limpiar error al modificar
    if (errors[idp]) {
      setErrors(prev => ({ ...prev, [idp]: null }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    let isValid = true;
    setFormError(null);

    questions.forEach(q => {
      const value = answers[q.idp];
      
      switch (q.type) {
        case QuestionType.TEXT:
        case QuestionType.NUMBER:
        case QuestionType.DATE:
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            newErrors[q.idp] = 'Este campo es obligatorio';
            isValid = false;
          }
          break;
          
        case QuestionType.SINGLECHOICE:
        case QuestionType.DROPDOWN:
          if (!value && value !== 0) {
            newErrors[q.idp] = 'Selecciona una opción';
            isValid = false;
          }
          break;
          
        case QuestionType.MULTIPLECHOICE:
          if (!value || (Array.isArray(value) && value.length === 0)) {
            newErrors[q.idp] = 'Selecciona al menos una opción';
            isValid = false;
          }
          break;
          
        case QuestionType.FILE:
          if (!value) {
            newErrors[q.idp] = 'Debes subir un archivo';
            isValid = false;
          }
          break;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(answers);
    } else {
      setFormError('Por favor, completa todos los campos requeridos');
      // Scroll al primer error
      const firstErrorKey = Object.keys(errors).find(key => errors[Number(key)]);
      if (firstErrorKey) {
        document.getElementById(`question-${firstErrorKey}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Formulario Dinámico</h1>
      
      {formError && <FormError message={formError} />}
      
      <div className="space-y-6">
        {questions.map(question => (
          <QuestionRenderer
            key={question.idp}
            question={question}
            value={answers[question.idp]}
            error={errors[question.idp]}
            onChange={(value) => handleChange(question.idp, value)}
          />
        ))}
      </div>
      
      <FormSubmit loading={loading} />
    </form>
  );
};

export default DynamicForm;
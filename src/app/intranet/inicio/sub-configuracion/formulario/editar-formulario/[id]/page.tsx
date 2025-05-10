"use client"
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams, useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { Toaster, toast } from "sonner"
import { FormularioService } from '@/services/api/formulario.service';

export type QuestionType = 'TEXT' | 'MULTIPLECHOICE' | 'SINGLECHOICE' | 'DROPDOWN' | 'DATE' | 'FILE' | 'NUMBER';
export interface QuestionOption {
  idOpc?: number | string; // Cambiado a idOpc para coincidir con el backend
  txtOpc: string; // Cambiado a txtOpc
}

export interface Question {
  idp: number | string; // Cambiado a idp para coincidir con el backend
  nmPrg: string; // Cambiado a nmPrg
  type: QuestionType;
  opcs: QuestionOption[]; // Cambiado a opcs
}

export interface FormData {
  title: string;
  questions: Question[];
}


interface QuestionItemProps {
  question: Question;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ question, updateQuestion, deleteQuestion } ) => {
  const handleTypeChange = (value: string) => {
    const newType = value as QuestionType;
    const requiresOptions = ['MULTIPLECHOICE', 'SINGLECHOICE', 'DROPDOWN'].includes(newType);
    
    updateQuestion(String(question.idp), { 
      type: newType,
      opcs: requiresOptions 
        ? question.opcs.length > 0 
          ? question.opcs  // Mantener opciones existentes
          : [{ idOpc: generateTempId(), txtOpc: '' }]  // Inicializar si no hay
        : question.opcs  // Conservar opciones aunque el tipo no las use (para posible reuso)
    });
  };
  
  // En la función saveForm, agregar validación final
  

  const generateTempId = () => `temp-${uuidv4()}`;
  return (
    <div className="mb-4 p-4 border rounded">
      <Input
        type="text"
        value={question.nmPrg}
        onChange={(e) => updateQuestion(String(question.idp), { nmPrg: e.target.value })}
        placeholder="Titulo de la pregunta"
        className="mb-2 text-slate-900 dark:text-slate-100"
      />
      
      <Select onValueChange={handleTypeChange} value={question.type}>
        <SelectTrigger className="mb-2 text-slate-900 dark:text-slate-100">
          <SelectValue placeholder="Tipo de pregunta" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TEXT">Tipo texto</SelectItem>
          <SelectItem value="DROPDOWN">Tipo desplegable</SelectItem>
          <SelectItem value="SINGLECHOICE">Tipo selección única</SelectItem>
          <SelectItem value="MULTIPLECHOICE">Tipo selección múltiple</SelectItem>
          <SelectItem value="FILE">Tipo archivo</SelectItem>
          <SelectItem value="DATE">Tipo fecha</SelectItem>
          <SelectItem value="NUMBER">Tipo numero</SelectItem>
        </SelectContent>
      </Select>

      {(question.type === 'DROPDOWN' || question.type === 'MULTIPLECHOICE' || question.type === 'SINGLECHOICE') && (
        <div className="mb-2 text-slate-900 dark:text-slate-100">
          {question.opcs.map((option, index) => (
            <div key={index} className="flex mb-2">
              <Input
                type="text"
                value={option.txtOpc}
                onChange={(e) => {
                  const newOptions = [...question.opcs];
                  newOptions[index] = { ...newOptions[index], txtOpc: e.target.value };
                  updateQuestion(String(question.idp), { opcs: newOptions });
                }}
                placeholder={`Opción ${index + 1}`}
                className="mr-2"
              />
              <Button 
                onClick={() => {
                  const newOptions = question.opcs.filter((_, i) => i !== index);
                  updateQuestion(String(question.idp), { opcs: newOptions });
                }} 
                variant="destructive"
              >
                Eliminar
              </Button>
            </div>
          ))}
          <Button 
            onClick={() => {
              const newOptions = [...question.opcs, { 
                idOpc: generateTempId(), 
                txtOpc: '' 
              }];
              updateQuestion(String(question.idp), { opcs: newOptions });
            }} 
            variant="outline" 
            className="mt-2"
          >
            Agregar Opción
          </Button>
        </div>
      )}
      
      <Button 
        onClick={() => deleteQuestion(String(question.idp))} 
        variant="destructive" 
        className="mt-2"
      >
        Eliminar Pregunta
      </Button>
    </div>
  );
};
  
  
  interface AddQuestionButtonProps {
    addQuestion: (type: QuestionType) => void;
  }
  
  export const AddQuestionButton: React.FC<AddQuestionButtonProps> = ({ addQuestion }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className='bg-blue-600 text-white dark:text-slate-100'>Agregar Pregunta</Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="grid gap-4">
            <Button onClick={() => addQuestion('TEXT')}>Tipo texto</Button>
            <Button onClick={() => addQuestion('DATE')}>Tipo fecha</Button>
            <Button onClick={() => addQuestion('SINGLECHOICE')}>Tipo selección única</Button>
            <Button onClick={() => addQuestion('MULTIPLECHOICE')}>Tipo selección múltiple</Button>
            <Button onClick={() => addQuestion('DROPDOWN')}>Tipo selección desplegable</Button>
            <Button onClick={() => addQuestion('FILE')}>Tipo archivo</Button>
            <Button onClick={() => addQuestion('NUMBER')}>Tipo numero</Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };
  
  
  
  export const DynamicForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
      title: '',
      questions: [],
    });
    const [nombre, setNombre] = useState("");
    const [isFocusedNombre, setIsFocusedNombre] = useState(false);
    const [error, setError] = useState(false);
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    useEffect(() => {
      const fetchQuestions = async () => {
        try {
          if (!id) return;
          
          const data = await FormularioService.getFormById(id);
          setNombre(data.name);
          
          const formattedQuestions = data.preguntas.map((q: any) => ({
            idp: q.idp.toString(), // Usar idp en lugar de id
            nmPrg: q.nmPrg, // Usar nmPrg en lugar de questionText
            type: q.type,
            opcs: q.opcs.map((opt: any) => ({ 
              idOpc: opt.idOpc,
              txtOpc: opt.txtOpc 
            }))
          }));
        
          setFormData(prev => ({
            ...prev,
            questions: formattedQuestions
          }));
    
        } catch (error) {
          console.error('Error fetching questions:', error);
          toast.error('Error al cargar el formulario');
        }
      };
    
      fetchQuestions();
    }, [id]);

    const generateTempId = () => `temp-${uuidv4()}`;
    const addQuestion = (type: QuestionType) => {
      const newQuestion: Question = {
        idp: generateTempId(), // ID temporal
        type,
        nmPrg: '',
        opcs: type === 'DROPDOWN' || type === 'MULTIPLECHOICE' || type === 'SINGLECHOICE' 
          ? [{ idOpc: generateTempId(), txtOpc: '' }] 
          : [],
      };
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
    };
  
    const updateQuestion = (id: string, updates: Partial<Question>) => {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.map(q => 
          String(q.idp) === id ? { ...q, ...updates } : q
        ),
      }));
    };
  
    const deleteQuestion = (id: string) => {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q.idp !== id),
      }));
    };
  
    const redirigir = () => {
      router.back();
    }
  
    const saveForm = async () => {
      if (!nombre.trim()) {
        setError(true);
        toast.error('El título es obligatorio');
        return;
      }
    
      try {
        if (!id) throw new Error('ID de formulario no encontrado');
        
        const formattedQuestions = formData.questions.map(question => {
          const isNewQuestion = typeof question.idp === 'string' && question.idp.startsWith('temp-');
          
          return {
            idp: isNewQuestion ? undefined : Number(question.idp),
            nmPrg: question.nmPrg,
            type: question.type,
            opcs: question.opcs.map(opt => ({
              idOpc: typeof opt.idOpc === 'string' && opt.idOpc.startsWith('temp-') ? undefined : opt.idOpc,
              txtOpc: opt.txtOpc
            }))
          };
        });
    
        await FormularioService.updateForm(id, {
          name: nombre,
          preguntas: formattedQuestions
        });
    
        toast.success('Formulario actualizado exitosamente');
        router.push('/intranet/inicio/sub-configuracion/formulario?actualizado=true');
      } catch (error) {
        console.error('Error saving form:', error);
        toast.error('Error al guardar el formulario');
      }
    };
  
    return (
      <div className="max-w-2xl mx-auto p-4">
        
        <div className="relative mt-4" >
            <Label
              htmlFor="nombre-formulario"
              className={`absolute left-3 transition-all duration-200 cursor-text ${
                nombre || isFocusedNombre
                  ? "top-[-10px] text-sm bg-background px-1 text-primary"
                  : "top-3 text-muted-foreground"
              } ${error ? "text-red-500" : ""}`}
            >
              Titulo del formulario <span className="text-red-600">*</span>
            </Label>
            <Input
              id="nombre-formulario"
              value={nombre}
              onChange={(e) => {
                  setNombre(e.target.value);
                  if (error) setError(false); // Quitar error al escribir
                }}
              onFocus={() => setIsFocusedNombre(true)}
              onBlur={() => setIsFocusedNombre(false)}
              className={`pt-4 ${error ? "border-red-500" : ""}`}
              placeholder={isFocusedNombre ? "Escriba aqui el titulo del formulario" : ""}
            />
            {error && (
                <p className="mt-2 text-sm text-red-500">
                ¡Ups! El titulo es obligatorio
              </p>
            )}
          </div>

          <Separator className="my-4 bg-black" />
            <div className='border rounded p-4'>

        {formData.questions.map(question => (
            <QuestionItem
            key={question.idp}
            question={question}
            updateQuestion={updateQuestion}
            deleteQuestion={deleteQuestion}
            />
        ))}

        <AddQuestionButton addQuestion={addQuestion} />
        
        <Button onClick={redirigir} className="mt-4 bg-red-600 text-white hover:bg-red-800 hover:text-white">
          Cancelar
        </Button>
        <Button onClick={saveForm} className="mt-4 bg-green-600 hover:bg-green-800">
          Guardar Formulario
        </Button>
        </div>
      </div>
    );
  };

export default DynamicForm;


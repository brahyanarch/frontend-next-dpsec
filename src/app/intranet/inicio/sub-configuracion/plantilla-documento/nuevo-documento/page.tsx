"use client"
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, usePathname } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { DocumentosService } from '@/services/api/documentos.service';
import { Toaster, toast } from "sonner"

export type DocumentElementType = 'section' | 'subsection' | 'subsubsection' | 'itemize' | 'enumerate' | 'text';

export interface DocumentElement {
  id: string;
  type: DocumentElementType;
  contenido: string;
  items: string[];
  iseditable: boolean;
  orden: number;
}

export interface DocumentData {
  title: string;
  elements: DocumentElement[];
}

interface DocumentElementItemProps {
  element: DocumentElement;
  updateElement: (id: string, updates: Partial<DocumentElement>) => void;
  deleteElement: (id: string) => void;
  moveElement: (id: string, direction: 'up' | 'down') => void;
}

export const DocumentElementItem: React.FC<DocumentElementItemProps> = ({ 
  element, 
  updateElement, 
  deleteElement,
  moveElement 
}) => {
  const handleTypeChange = (value: string) => {
    updateElement(element.id, { 
      type: value as DocumentElement['type'],
      // Reset items cuando cambia el tipo, excepto para itemize y enumerate
      items: (value === 'itemize' || value === 'enumerate') ? [''] : []
    });
  };

  return (
    <div className="mb-4 p-4 border rounded bg-white dark:bg-slate-800">
      <div className="flex gap-2 mb-2">
        <Button 
          onClick={() => moveElement(element.id, 'up')} 
          variant="outline" 
          size="sm"
          disabled={element.orden === 1}
        >
          ↑
        </Button>
        <Button 
          onClick={() => moveElement(element.id, 'down')} 
          variant="outline" 
          size="sm"
        >
          ↓
        </Button>
        <span className="flex items-center px-2 text-sm text-slate-500">
          Orden: {element.orden}
        </span>
      </div>

      <Select onValueChange={handleTypeChange} value={element.type}>
        <SelectTrigger className="mb-2">
          <SelectValue placeholder="Tipo de elemento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="section">Sección</SelectItem>
          <SelectItem value="subsection">Subsección</SelectItem>
          <SelectItem value="subsubsection">Subsubsección</SelectItem>
          <SelectItem value="itemize">Lista con viñetas</SelectItem>
          <SelectItem value="enumerate">Lista numerada</SelectItem>
          <SelectItem value="text">Texto simple</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="text"
        value={element.contenido}
        onChange={(e) => updateElement(element.id, { contenido: e.target.value })}
        placeholder={
          element.type === 'section' ? "Título de sección" :
          element.type === 'subsection' ? "Título de subsección" :
          element.type === 'subsubsection' ? "Título de subsubsección" :
          element.type === 'text' ? "Texto del párrafo" :
          "Título (opcional)"
        }
        className="mb-2"
      />

      {(element.type === 'itemize' || element.type === 'enumerate') && (
        <div className="mb-2">
          <Label className="mb-2 block">Elementos de la lista:</Label>
          {element.items?.map((item, index) => (
            <div key={index} className="flex mb-2 gap-2">
              <Input
                type="text"
                value={item}
                onChange={(e) => {
                  const newItems = [...(element.items || [])];
                  newItems[index] = e.target.value;
                  updateElement(element.id, { items: newItems });
                }}
                placeholder={`Elemento ${index + 1}`}
              />
              <Button 
                onClick={() => {
                  const newItems = element.items?.filter((_, i) => i !== index);
                  updateElement(element.id, { items: newItems });
                }} 
                variant="destructive"
                size="sm"
              >
                Eliminar
              </Button>
            </div>
          ))}
          <Button 
            onClick={() => {
              const newItems = [...(element.items || []), ''];
              updateElement(element.id, { items: newItems });
            }} 
            variant="outline" 
            className="mt-2"
          >
            Agregar Elemento
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-2">
          <Label htmlFor={`editable-${element.id}`}>Editable</Label>
          <input
            id={`editable-${element.id}`}
            type="checkbox"
            checked={element.iseditable}
            onChange={(e) => updateElement(element.id, { iseditable: e.target.checked })}
            className="h-4 w-4"
          />
        </div>
        
        <Button 
          onClick={() => deleteElement(element.id)} 
          variant="destructive"
        >
          Eliminar Elemento
        </Button>
      </div>
    </div>
  );
};

interface AddElementButtonProps {
  addElement: (type: DocumentElementType) => void;
}

export const AddElementButton: React.FC<AddElementButtonProps> = ({ addElement }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className='bg-blue-600 text-white'>
          Agregar Elemento
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-2">
          <Button onClick={() => addElement('section')} variant="outline">
            Sección
          </Button>
          <Button onClick={() => addElement('subsection')} variant="outline">
            Subsección
          </Button>
          <Button onClick={() => addElement('subsubsection')} variant="outline">
            Subsubsección
          </Button>
          <Button onClick={() => addElement('itemize')} variant="outline">
            Lista con viñetas
          </Button>
          <Button onClick={() => addElement('enumerate')} variant="outline">
            Lista numerada
          </Button>
          <Button onClick={() => addElement('text')} variant="outline">
            Texto simple
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const DocumentBuilder: React.FC = () => {
  const [documentData, setDocumentData] = useState<DocumentData>({
    title: '',
    elements: [],
  });
  const [nombre, setNombre] = useState("");
  const [isFocusedNombre, setIsFocusedNombre] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const addElement = (type: DocumentElementType) => {
    const newElement: DocumentElement = {
      id: uuidv4(),
      type,
      contenido: '',
      items: type === 'itemize' || type === 'enumerate' ? [''] : [],
      iseditable: false,
      orden: documentData.elements.length + 1,
    };
    setDocumentData(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));
  };

  const updateElement = (id: string, updates: Partial<DocumentElement>) => {
    setDocumentData(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      ),
    }));
  };

  const deleteElement = (id: string) => {
    setDocumentData(prev => ({
      ...prev,
      elements: prev.elements
        .filter(el => el.id !== id)
        .map((el, index) => ({ ...el, orden: index + 1 }))
    }));
  };

  const moveElement = (id: string, direction: 'up' | 'down') => {
    setDocumentData(prev => {
      const elements = [...prev.elements];
      const currentIndex = elements.findIndex(el => el.id === id);
      
      if (direction === 'up' && currentIndex > 0) {
        [elements[currentIndex], elements[currentIndex - 1]] = 
        [elements[currentIndex - 1], elements[currentIndex]];
      } else if (direction === 'down' && currentIndex < elements.length - 1) {
        [elements[currentIndex], elements[currentIndex + 1]] = 
        [elements[currentIndex + 1], elements[currentIndex]];
      }
      
      // Recalcular órdenes
      return {
        ...prev,
        elements: elements.map((el, index) => ({ ...el, orden: index + 1 }))
      };
    });
  };

  const redirigir = () => {
    router.push('/intranet/inicio/sub-configuracion/plantilla-documento');
  }

  const handleSaveDocument = async () => {
    if (!nombre.trim()) {
      setError(true);
      toast.error("El título del documento es obligatorio");
      return;
    }

    try {
      // Aquí llamarías a tu servicio para guardar el documento
      const response = await DocumentosService.createDocument(nombre, documentData.elements);
      
      console.log("Estructura generada:", {
        title: nombre,
        elements: documentData.elements
      });
      
      setError(false);
      toast.success("Documento guardado exitosamente");
      redirigir();
    } catch (error) {
      setError(true);
      console.error("Error al guardar el documento:", error);
      toast.error("Error al guardar el documento");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      
      <div className="relative mt-4">
        <Label
          htmlFor="nombre-documento"
          className={`absolute left-3 transition-all duration-200 cursor-text ${
            nombre || isFocusedNombre
              ? "top-[-10px] text-sm bg-background px-1 text-primary"
              : "top-3 text-muted-foreground"
          } ${error ? "text-red-500" : ""}`}
        >
          Título del documento <span className="text-red-600">*</span>
        </Label>
        
        <Input
          id="nombre-documento"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            if (error) setError(false);
          }}
          onFocus={() => setIsFocusedNombre(true)}
          onBlur={() => setIsFocusedNombre(false)}
          className={`pt-4 ${error ? "border-red-500" : ""}`}
          placeholder={isFocusedNombre ? "Escriba aquí el título del documento" : ""}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">
            ¡Ups! El título es obligatorio
          </p>
        )}
      </div>

      <Separator className="my-4" />

      <div className='border rounded p-4 bg-slate-50 dark:bg-slate-900'>
        {documentData.elements.map(element => (
          <DocumentElementItem
            key={element.id}
            element={element}
            updateElement={updateElement}
            deleteElement={deleteElement}
            moveElement={moveElement}
          />
        ))}

        <div className="flex gap-2 mt-4 flex-wrap">
          <AddElementButton addElement={addElement} />
          <Button onClick={redirigir} variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleSaveDocument} className="bg-green-600 hover:bg-green-700">
            Guardar Documento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentBuilder;
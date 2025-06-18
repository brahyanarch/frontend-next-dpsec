// components/project-upload/ProjectUploadStepper.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { Check, ChevronLeft, ChevronRight, FileText, Plus, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ProjectService } from '@/services/api/project.service';

interface Pregunta {
  id: string;
  tipo: 'texto' | 'opcion_unica' | 'multiple' | 'fecha' | 'archivo';
  enunciado: string;
  opciones?: string[];
}

interface Actividad {
  id: number;
  nombre: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  preguntas: Pregunta[];
  respuestas: { [key: string]: string | string[] | File | null };
  archivo: File | null;
}

const preguntasEjemplo: Pregunta[] = [
  {
    id: '1',
    tipo: 'texto',
    enunciado: 'Descripción detallada de la actividad'
  },
  {
    id: '2',
    tipo: 'opcion_unica',
    enunciado: 'Tipo de actividad',
    opciones: ['Desarrollo', 'Investigación', 'Pruebas', 'Documentación']
  },
  {
    id: '3',
    tipo: 'multiple',
    enunciado: 'Recursos requeridos',
    opciones: ['Personal', 'Equipos', 'Materiales', 'Financiamiento']
  },
  {
    id: '4',
    tipo: 'fecha',
    enunciado: 'Fecha crítica de revisión'
  },
  {
    id: '5',
    tipo: 'archivo',
    enunciado: 'Documentación adicional (opcional)'
  }
];

export default function ProjectUploadStepper() {
  const [step, setStep] = useState(1);
  const [planGeneral, setPlanGeneral] = useState<File | null>(null);
  const [actividades, setActividades] = useState<Actividad[]>([
    {
      id: 1,
      nombre: 'Actividad Principal',
      fechaInicio: null,
      fechaFin: null,
      preguntas: [],
      respuestas: {},
      archivo: null
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const agregarActividad = () => {
    const nuevaActividad: Actividad = {
      id: actividades.length + 1,
      nombre: `Actividad ${actividades.length + 1}`,
      fechaInicio: null,
      fechaFin: null,
      preguntas: [],
      respuestas: {},
      archivo: null
    };
    setActividades([...actividades, nuevaActividad]);
  };

  const cargarPreguntas = (actividadId: number) => {
    setActividades(prev => 
      prev.map(act => 
        act.id === actividadId 
          ? { ...act, preguntas: preguntasEjemplo } 
          : act
      )
    );
  };

  const handleFechaChange = (
    actividadId: number, 
    campo: 'fechaInicio' | 'fechaFin', 
    fecha: Date | undefined
  ) => {
    setActividades(prev => 
      prev.map(act => 
        act.id === actividadId 
          ? { ...act, [campo]: fecha || null } 
          : act
      )
    );
  };

  const handleRespuestaChange = (
    actividadId: number,
    preguntaId: string,
    valor: string | string[] | File
  ) => {
    setActividades(prev => 
      prev.map(act => {
        if (act.id === actividadId) {
          return {
            ...act,
            respuestas: {
              ...act.respuestas,
              [preguntaId]: valor
            }
          };
        }
        return act;
      })
    );
  };

  const handleArchivoActividad = (
    actividadId: number, 
    archivo: File
  ) => {
    setActividades(prev => 
      prev.map(act => 
        act.id === actividadId 
          ? { ...act, archivo } 
          : act
      )
    );
  };

  const handleNombreChange = (
    actividadId: number,
    nombre: string
  ) => {
    setActividades(prev => 
      prev.map(act => 
        act.id === actividadId 
          ? { ...act, nombre } 
          : act
      )
    );
  };

  const siguientePaso = () => {
    if (step === 1 && !planGeneral) {
      alert('Debes subir el plan general primero');
      return;
    }
    
    if (step === 2) {
      // Validar fechas de actividades
      const actividadesIncompletas = actividades.some(act => 
        !act.fechaInicio || !act.fechaFin
      );
      
      if (actividadesIncompletas) {
        alert('Todas las actividades deben tener fechas de inicio y fin');
        return;
      }
    }
    
    setStep(step + 1);
  };

  const enviarProyecto = async () => {
  setIsLoading(true);
  
  try {
    const formData = new FormData();
    
    // 1. Agregar plan general (PDF)
    if (planGeneral) {
      formData.append('planGeneral', planGeneral);
    }

    // 2. Agregar datos de cada actividad
    actividades.forEach((actividad, index) => {
      // Metadatos básicos de la actividad
      formData.append(`actividades[${index}].id`, actividad.id.toString());
      formData.append(`actividades[${index}].nombre`, actividad.nombre);
      
      if (actividad.fechaInicio) {
        formData.append(
          `actividades[${index}].fechaInicio`, 
          actividad.fechaInicio.toISOString()
        );
      }
      
      if (actividad.fechaFin) {
        formData.append(
          `actividades[${index}].fechaFin`, 
          actividad.fechaFin.toISOString()
        );
      }
      
      // Archivo de la actividad (PDF)
      if (actividad.archivo) {
        formData.append(
          `actividades[${index}].archivo`, 
          actividad.archivo
        );
      }
      
      // Respuestas a preguntas
      Object.entries(actividad.respuestas).forEach(([preguntaId, respuesta]) => {
        const key = `actividades[${index}].respuestas[${preguntaId}]`;
        
        if (respuesta instanceof File) {
          // Si es un archivo, agregarlo directamente
          formData.append(key, respuesta);
        } else if (Array.isArray(respuesta)) {
          // Si es un array (para múltiples selecciones)
          respuesta.forEach((item, idx) => {
            formData.append(`${key}[${idx}]`, item);
          });
        } else if (typeof respuesta === 'object' && respuesta !== null) {
          // Si es un objeto (por ejemplo, para fechas)
          formData.append(key, JSON.stringify(respuesta));
        } else {
          // Para valores simples (string, number, etc.)
          formData.append(key, respuesta || '');
        }
      });
    });

    // 3. Enviar a la API
    //const response = await ProjectService.getForms();

    /*if (!response.ok) {
      throw new Error('Error al enviar el proyecto');
    }

    const result = await response.json();
    console.log('Proyecto enviado con éxito:', result);
    */
    setIsSubmitted(true);
  } catch (error) {
    console.error('Error al enviar proyecto:', error);
    alert('Hubo un error al enviar el proyecto. Por favor, intenta de nuevo.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Subir Nuevo Proyecto
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="mb-8">
            <Progress value={step * 25} className="h-2" />
            <div className="flex justify-between mt-4">
              <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {step > 1 ? <Check size={16} /> : 1}
                </div>
                <span className="text-sm">Plan General</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {step > 2 ? <Check size={16} /> : 2}
                </div>
                <span className="text-sm">Actividades</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {step > 3 ? <Check size={16} /> : 3}
                </div>
                <span className="text-sm">Resumen</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 4 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  4
                </div>
                <span className="text-sm">Confirmar</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold">Paso 1: Plan General del Proyecto</h3>
                <p className="text-muted-foreground mt-2">
                  Sube el documento PDF que contiene el plan completo del proyecto
                </p>
              </div>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center">
                {planGeneral ? (
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-primary mb-3" />
                    <p className="font-medium">{planGeneral.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(planGeneral.size / 1024).toFixed(2)} KB
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setPlanGeneral(null)}
                    >
                      Cambiar Archivo
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <div className="mb-4">
                      <p className="font-medium">Arrastra tu archivo aquí</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        O haz clic para seleccionar
                      </p>
                    </div>
                    <div className="relative">
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setPlanGeneral(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button>
                        Seleccionar Archivo
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Solo se aceptan archivos PDF (máx. 10MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold">Paso 2: Configurar Actividades</h3>
                <p className="text-muted-foreground mt-2">
                  Agrega las actividades de tu proyecto con sus fechas, preguntas y archivos
                </p>
              </div>
              
              <div className="space-y-6">
                {actividades.map((actividad, index) => (
                  <Card key={actividad.id} className="relative">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          <Input
                            value={actividad.nombre}
                            onChange={(e) => handleNombreChange(actividad.id, e.target.value)}
                            className="text-lg font-semibold border-none shadow-none focus:border focus:shadow"
                          />
                        </CardTitle>
                        <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">
                          Actividad #{index + 1}
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Fecha de inicio</Label>
                          <Calendar
                            mode="single"
                            selected={actividad.fechaInicio || undefined}
                            onSelect={(date) => handleFechaChange(actividad.id, 'fechaInicio', date)}
                            className="rounded-md border mt-1"
                            locale={es}
                          />
                        </div>
                        
                        <div>
                          <Label>Fecha de finalización</Label>
                          <Calendar
                            mode="single"
                            selected={actividad.fechaFin || undefined}
                            onSelect={(date) => handleFechaChange(actividad.id, 'fechaFin', date)}
                            className="rounded-md border mt-1"
                            locale={es}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          onClick={() => cargarPreguntas(actividad.id)}
                          disabled={actividad.preguntas.length > 0}
                        >
                          Cargar Preguntas de la Actividad
                        </Button>
                        
                        {actividad.preguntas.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {actividad.preguntas.map((pregunta) => (
                              <div key={pregunta.id} className="border rounded-lg p-4">
                                <Label className="block mb-2 font-medium">
                                  {pregunta.enunciado}
                                </Label>
                                
                                {pregunta.tipo === 'texto' && (
                                  <Input
                                    type="text"
                                    onChange={(e) => 
                                      handleRespuestaChange(
                                        actividad.id, 
                                        pregunta.id, 
                                        e.target.value
                                      )
                                    }
                                    className="w-full"
                                  />
                                )}
                                
                                {pregunta.tipo === 'opcion_unica' && pregunta.opciones && (
                                  <div className="space-y-2">
                                    {pregunta.opciones.map((opcion) => (
                                      <div key={opcion} className="flex items-center">
                                        <input
                                          type="radio"
                                          name={`pregunta-${pregunta.id}`}
                                          id={`${actividad.id}-${pregunta.id}-${opcion}`}
                                          value={opcion}
                                          onChange={(e) => 
                                            handleRespuestaChange(
                                              actividad.id, 
                                              pregunta.id, 
                                              e.target.value
                                            )
                                          }
                                          className="mr-2"
                                        />
                                        <label htmlFor={`${actividad.id}-${pregunta.id}-${opcion}`}>
                                          {opcion}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {pregunta.tipo === 'multiple' && pregunta.opciones && (
                                  <div className="space-y-2">
                                    {pregunta.opciones.map((opcion) => (
                                      <div key={opcion} className="flex items-center">
                                        <input
                                          type="checkbox"
                                          id={`${actividad.id}-${pregunta.id}-${opcion}`}
                                          value={opcion}
                                          onChange={(e) => {
                                            const current = actividad.respuestas[pregunta.id] as string[] || [];
                                            const newValue = e.target.checked
                                              ? [...current, opcion]
                                              : current.filter(v => v !== opcion);
                                            handleRespuestaChange(actividad.id, pregunta.id, newValue);
                                          }}
                                          className="mr-2"
                                        />
                                        <label htmlFor={`${actividad.id}-${pregunta.id}-${opcion}`}>
                                          {opcion}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {pregunta.tipo === 'fecha' && (
                                  <Input
                                    type="date"
                                    onChange={(e) => 
                                      handleRespuestaChange(
                                        actividad.id, 
                                        pregunta.id, 
                                        e.target.value
                                      )
                                    }
                                    className="w-full"
                                  />
                                )}
                                
                                {pregunta.tipo === 'archivo' && (
                                  <div className="mt-2">
                                    <Input
                                      type="file"
                                      onChange={(e) => 
                                        handleRespuestaChange(
                                          actividad.id, 
                                          pregunta.id, 
                                          e.target.files?.[0] as File
                                        )
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <Label>Archivo de la actividad (PDF)</Label>
                        <div className="mt-2">
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => 
                              handleArchivoActividad(
                                actividad.id, 
                                e.target.files?.[0] as File
                              )
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="outline" 
                    onClick={agregarActividad}
                    className="flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Otra Actividad
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold">Paso 3: Resumen del Proyecto</h3>
                <p className="text-muted-foreground mt-2">
                  Revisa toda la información antes de confirmar
                </p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Plan General</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-primary mr-3" />
                    <div>
                      <p className="font-medium">{planGeneral?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(planGeneral ? planGeneral.size / 1024 : 0).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Actividades ({actividades.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {actividades.map((actividad) => (
                    <div key={actividad.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">{actividad.nombre}</h4>
                        <div className="text-sm text-muted-foreground">
                          {actividad.fechaInicio && actividad.fechaFin ? (
                            <span>
                              {format(actividad.fechaInicio, 'dd/MM/yyyy')} - {format(actividad.fechaFin, 'dd/MM/yyyy')}
                            </span>
                          ) : (
                            <span className="text-destructive">Fechas no definidas</span>
                          )}
                        </div>
                      </div>
                      
                      {actividad.preguntas.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Respuestas:
                          </p>
                          <div className="space-y-2">
                            {actividad.preguntas.map(pregunta => (
                              <div key={pregunta.id} className="text-sm">
                                <span className="font-medium">{pregunta.enunciado}:</span> 
                                <span className="ml-2">
                                  {actividad.respuestas[pregunta.id] 
                                    ? (Array.isArray(actividad.respuestas[pregunta.id]) 
                                        ? (actividad.respuestas[pregunta.id] as string[]).join(', ') 
                                        : actividad.respuestas[pregunta.id]?.toString())
                                    : 'Sin respuesta'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Archivo adjunto:
                        </p>
                        {actividad.archivo ? (
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="text-sm">{actividad.archivo.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-destructive">No se ha subido archivo</span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {isSubmitted ? '¡Proyecto Enviado con Éxito!' : 'Paso 4: Confirmar Proyecto'}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {isSubmitted 
                    ? 'Tu proyecto ha sido registrado correctamente.' 
                    : 'Revisa y confirma la información del proyecto'}
                </p>
              </div>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">¡Proyecto Registrado!</h4>
                  <p className="text-muted-foreground">
                    Tu proyecto ha sido enviado exitosamente. Recibirás una notificación cuando sea revisado.
                  </p>
                  <div className="mt-8">
                    <Button onClick={() => {
                      setStep(1);
                      setPlanGeneral(null);
                      setActividades([{
                        id: 1,
                        nombre: 'Actividad Principal',
                        fechaInicio: null,
                        fechaFin: null,
                        preguntas: [],
                        respuestas: {},
                        archivo: null
                      }]);
                      setIsSubmitted(false);
                    }}>
                      Subir Otro Proyecto
                    </Button>
                    <Button onClick={() => {
                      //ir a mis proyectos
                      window.location.href = '/intranet/inicio/planificacion/mis-proyectos';
                    }}>
                      Ir a mis proyectos
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Confirmar Envío</h4>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Al confirmar, estarás enviando toda la información del proyecto para su revisión. 
                    ¿Estás seguro de que todo está correcto?
                  </p>
                  
                  <div className="flex justify-center gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(3)}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Volver
                    </Button>
                    <Button 
                      onClick={enviarProyecto}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Enviando...' : 'Confirmar y Enviar'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        {step < 4 && !isSubmitted && (
          <div className="flex justify-between px-6 pb-6">
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)} 
              disabled={step === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
            
            <Button onClick={siguientePaso}>
              {step === 3 ? 'Revisar y Confirmar' : 'Siguiente'} 
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
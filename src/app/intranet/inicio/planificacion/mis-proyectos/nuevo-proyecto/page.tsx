// components/project-upload/ProjectUploadStepper.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { Check, ChevronLeft, ChevronRight, FileText, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ProjectService, ProjectSchema } from '@/services/api/project.service';

interface Opcion {
  idOpc: number;
  txtOpc: string;
}

interface Pregunta {
  idp: number;
  type: "TEXT" | "MULTIPLECHOICE" | "SINGLECHOICE" | "DROPDOWN" | "DATE" | "FILE" | "NUMBER";
  nmPrg: string;
  opcs?: Opcion[];
}

interface Actividad {
  id: number;
  nombre: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  preguntas: Pregunta[];
  respuestas: { [key: string]: string | string[] | File | null };
}

export default function ProjectUploadStepper() {
  const [step, setStep] = useState(1);
  const [actividades, setActividades] = useState<Actividad[]>([
    {
      id: 1,
      nombre: 'Actividad Principal',
      fechaInicio: null,
      fechaFin: null,
      preguntas: [],
      respuestas: {}
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [preguntasPlantilla, setPreguntasPlantilla] = useState<Pregunta[]>([]);
  const [fechaInicialProyecto, setFechaInicialProyecto] = useState<Date | null>(null);
  const [fechaFinalProyecto, setFechaFinalProyecto] = useState<Date | null>(null);

  // Fetch questions from service
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const preguntas = await ProjectService.getQuestions();
        setPreguntasPlantilla(preguntas);
      } catch (error) {
        console.error('Error loading questions', error);
      }
    };

    fetchQuestions();
  }, []);

  // Calculate project dates whenever activities change
  useEffect(() => {
    const dates = actividades.flatMap(act => 
      [act.fechaInicio, act.fechaFin].filter(Boolean) as Date[]
    );
    
    if (dates.length > 0) {
      const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
      setFechaInicialProyecto(minDate);
      setFechaFinalProyecto(maxDate);
    } else {
      setFechaInicialProyecto(null);
      setFechaFinalProyecto(null);
    }
  }, [actividades]);

  const agregarActividad = () => {
    const nuevaActividad: Actividad = {
      id: actividades.length + 1,
      nombre: `Actividad ${actividades.length + 1}`,
      fechaInicio: null,
      fechaFin: null,
      preguntas: [],
      respuestas: {}
    };
    setActividades([...actividades, nuevaActividad]);
  };

  const cargarPreguntas = (actividadId: number) => {
    if (preguntasPlantilla.length === 0) return;
    
    setActividades(prev => 
      prev.map(act => 
        act.id === actividadId 
          ? { ...act, preguntas: preguntasPlantilla } 
          : act
      )
    );
  };

  const handleFechaChange = (
    actividadId: number, 
    campo: 'fechaInicio' | 'fechaFin', 
    fecha: Date | undefined
  ) => {
    if (!fecha) return;
    
    // Prevent setting past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (fecha < today) return;
    
    setActividades(prev => 
      prev.map(act => 
        act.id === actividadId 
          ? { ...act, [campo]: fecha } 
          : act
      )
    );
  };

  const handleRespuestaChange = (
    actividadId: number,
    preguntaId: number,
    valor: string | string[] | File | null
  ) => {
    setActividades(prev => 
      prev.map(act => {
        if (act.id === actividadId) {
          const newRespuestas = { ...act.respuestas };
          
          if (valor === null) {
            delete newRespuestas[preguntaId];
          } else {
            newRespuestas[preguntaId] = valor;
          }
          
          return {
            ...act,
            respuestas: newRespuestas
          };
        }
        return act;
      })
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
    if (step === 1) {
      // Validate activities
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
    const projectData = {
      fechaInicioProyecto: fechaInicialProyecto?.toISOString(),
      fechaFinProyecto: fechaFinalProyecto?.toISOString(),
      actividades: actividades.map(actividad => ({
        id: actividad.id,
        nombre: actividad.nombre,
        fechaInicio: actividad.fechaInicio?.toISOString() ?? null,
        fechaFin: actividad.fechaFin?.toISOString() ?? null,
        preguntas: actividad.preguntas.map(pregunta => ({
          idp: pregunta.idp,
          nmPrg: pregunta.nmPrg,
          type: pregunta.type,
          opcs: pregunta.opcs?.map(opcion => ({
            idOpc: opcion.idOpc,
            txtOpc: opcion.txtOpc
          }))
        })),
        respuestas: actividad.respuestas
      }))
    };

    // ✅ Validar antes de crear el FormData
    ProjectSchema.parse(projectData);

    // Después de validar, puedes convertir `projectData` a FormData si es necesario
    const formData = new FormData();
    // Agrega aquí lo que ya hiciste antes...
    
    await ProjectService.createProject(projectData); // o formData si cambias tu servicio
    setIsSubmitted(true);
  } catch (error) {
    console.error('Error al enviar proyecto:', error);
    alert('Hubo un error al enviar el proyecto. Por favor, intenta de nuevo.');
  } finally {
    setIsLoading(false);
  }
};

  // Función para renderizar inputs
  const renderQuestionInput = (actividad: Actividad, pregunta: Pregunta) => {
    const uniqueKey = `act-${actividad.id}-preg-${pregunta.idp}`;
    
    switch (pregunta.type) {
      case 'TEXT':
        return (
          <Input
            type="text"
            onChange={(e) => 
              handleRespuestaChange(
                actividad.id, 
                pregunta.idp, 
                e.target.value
              )
            }
            className="w-full"
          />
        );
        
      case 'SINGLECHOICE':
        return pregunta.opcs && (
          <div className="space-y-2">
            {pregunta.opcs.map((opcion, index) => (
              <div key={`${uniqueKey}-option-${index}`} className="flex items-center">
                <input
                  type="radio"
                  name={`pregunta-${uniqueKey}`}
                  id={`${uniqueKey}-option-${index}`}
                  value={opcion.idOpc}
                  onChange={(e) => 
                    handleRespuestaChange(
                      actividad.id, 
                      pregunta.idp, 
                      e.target.value
                    )
                  }
                  className="mr-2"
                />
                <label htmlFor={`${uniqueKey}-option-${index}`}>
                  {opcion.txtOpc}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'MULTIPLECHOICE':
        return pregunta.opcs && (
          <div className="space-y-2">
            {pregunta.opcs.map((opcion, index) => {
              const current = actividad.respuestas[pregunta.idp] as string[] || [];
              const isChecked = current.includes(opcion.idOpc.toString());
              
              return (
                <div key={`${uniqueKey}-option-${index}`} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${uniqueKey}-option-${index}`}
                    value={opcion.idOpc}
                    checked={isChecked}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...current, opcion.idOpc.toString()]
                        : current.filter(v => v !== opcion.idOpc.toString());
                      handleRespuestaChange(actividad.id, pregunta.idp, newValue);
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`${uniqueKey}-option-${index}`}>
                    {opcion.txtOpc}
                  </label>
                </div>
              );
            })}
          </div>
        );
        
      case 'DROPDOWN':
        return pregunta.opcs && (
          <select
            onChange={(e) => 
              handleRespuestaChange(
                actividad.id, 
                pregunta.idp, 
                e.target.value
              )
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="">Seleccionar...</option>
            {pregunta.opcs.map((opcion, index) => (
              <option key={`${uniqueKey}-option-${index}`} value={opcion.idOpc}>
                {opcion.txtOpc}
              </option>
            ))}
          </select>
        );
        
      case 'DATE':
        return (
          <Input
            type="date"
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => 
              handleRespuestaChange(
                actividad.id, 
                pregunta.idp, 
                e.target.value
              )
            }
            className="w-full"
          />
        );
        
      case 'NUMBER':
        return (
          <Input
            type="number"
            onChange={(e) => 
              handleRespuestaChange(
                actividad.id, 
                pregunta.idp, 
                e.target.value
              )
            }
            className="w-full"
          />
        );
        
      case 'FILE':
        return (
          <div className="mt-2">
            <Input
              type="file"
              onChange={(e) => 
                handleRespuestaChange(
                  actividad.id, 
                  pregunta.idp, 
                  e.target.files?.[0] || null
                )
              }
              className="w-full"
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  // Función para obtener el texto de respuesta
  const obtenerTextoRespuesta = (pregunta: Pregunta, respuesta: any) => {
    if (respuesta === null || respuesta === undefined) return 'Sin respuesta';
    
    // Manejar archivos
    if (respuesta instanceof File) {
      return respuesta.name;
    }
    
    // Manejar arrays (opciones múltiples)
    if (Array.isArray(respuesta)) {
      return respuesta
        .map(id => {
          const opcion = pregunta.opcs?.find(opc => opc.idOpc.toString() === id);
          return opcion ? opcion.txtOpc : id;
        })
        .join(', ');
    }
    
    // Manejar opciones simples
    if (pregunta.opcs && pregunta.opcs.length > 0) {
      const opcion = pregunta.opcs?.find(opc => opc.idOpc.toString() === respuesta);
      return opcion ? opcion.txtOpc : respuesta;
    }
    
    // Manejar otros tipos
    return respuesta.toString();
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
            <Progress value={step * 33.33} className="h-2" />
            <div className="flex justify-between mt-4">
              <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {step > 1 ? <Check size={16} /> : 1}
                </div>
                <span className="text-sm">Actividades</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {step > 2 ? <Check size={16} /> : 2}
                </div>
                <span className="text-sm">Resumen</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  3
                </div>
                <span className="text-sm">Confirmar</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold">Paso 1: Configurar Actividades</h3>
                <p className="text-muted-foreground mt-2">
                  Agrega las actividades de tu proyecto con sus fechas y preguntas
                </p>
              </div>
              
              <div className="space-y-6">
                {actividades.map((actividad) => (
                  <Card key={`actividad-${actividad.id}`} className="relative">
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
                          Actividad #{actividad.id}
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
                            disabled={{ before: new Date() }}
                            initialFocus
                          />
                          {actividad.fechaInicio && (
                            <p className="text-sm mt-2">
                              {format(actividad.fechaInicio, 'PPP', { locale: es })}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label>Fecha de finalización</Label>
                          <Calendar
                            mode="single"
                            selected={actividad.fechaFin || undefined}
                            onSelect={(date) => handleFechaChange(actividad.id, 'fechaFin', date)}
                            className="rounded-md border mt-1"
                            locale={es}
                            disabled={{ before: new Date() }}
                            initialFocus
                          />
                          {actividad.fechaFin && (
                            <p className="text-sm mt-2">
                              {format(actividad.fechaFin, 'PPP', { locale: es })}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          onClick={() => cargarPreguntas(actividad.id)}
                          disabled={actividad.preguntas.length > 0 || preguntasPlantilla.length === 0}
                        >
                          {preguntasPlantilla.length === 0 
                            ? 'Cargando preguntas...' 
                            : 'Cargar Preguntas de la Actividad'}
                        </Button>
                        
                        {actividad.preguntas.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {actividad.preguntas.map((pregunta) => (
                              <div 
                                key={`act-${actividad.id}-preg-${pregunta.idp}`} 
                                className="border rounded-lg p-4"
                              >
                                <Label className="block mb-2 font-medium">
                                  {pregunta.nmPrg}
                                </Label>
                                {renderQuestionInput(actividad, pregunta)}
                              </div>
                            ))}
                          </div>
                        )}
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

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold">Paso 2: Resumen del Proyecto</h3>
                <p className="text-muted-foreground mt-2">
                  Revisa toda la información antes de confirmar
                </p>
              </div>
              
              {/* Project Dates Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Fechas del Proyecto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Fecha Inicial del Proyecto</Label>
                      <p className="font-medium">
                        {fechaInicialProyecto 
                          ? format(fechaInicialProyecto, 'PPP', { locale: es }) 
                          : 'No definida'}
                      </p>
                    </div>
                    <div>
                      <Label>Fecha Final del Proyecto</Label>
                      <p className="font-medium">
                        {fechaFinalProyecto 
                          ? format(fechaFinalProyecto, 'PPP', { locale: es }) 
                          : 'No definida'}
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
                    <div 
                      key={`resumen-actividad-${actividad.id}`} 
                      className="border rounded-lg p-4"
                    >
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
                              <div 
                                key={`resumen-act-${actividad.id}-preg-${pregunta.idp}`} 
                                className="text-sm"
                              >
                                <span className="font-medium">{pregunta.nmPrg}:</span> 
                                <span className="ml-2">
                                  {obtenerTextoRespuesta(
                                    pregunta, 
                                    actividad.respuestas[pregunta.idp]
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {isSubmitted ? '¡Proyecto Enviado con Éxito!' : 'Paso 3: Confirmar Proyecto'}
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
                  <div className="mt-8 flex gap-3 justify-center">
                    <Button onClick={() => {
                      setStep(1);
                      setActividades([{
                        id: 1,
                        nombre: 'Actividad Principal',
                        fechaInicio: null,
                        fechaFin: null,
                        preguntas: [],
                        respuestas: {}
                      }]);
                      setIsSubmitted(false);
                    }}>
                      Subir Otro Proyecto
                    </Button>
                    <Button variant="secondary" onClick={() => {
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
                      onClick={() => setStep(2)}
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
        
        {step < 3 && !isSubmitted && (
          <div className="flex justify-between px-6 pb-6">
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)} 
              disabled={step === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
            
            <Button onClick={siguientePaso}>
              {step === 2 ? 'Revisar y Confirmar' : 'Siguiente'} 
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
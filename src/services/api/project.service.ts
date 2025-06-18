import { apiClient } from './API.service'; // Asumiendo que tienes un cliente API configurado
import { ProjectUploadData, Pregunta } from '../types'; // Ajusta las importaciones según tu estructura
import { toast } from 'sonner';
import { z } from 'zod';
import { ProjectSchema } from '@/app/intranet/inicio/planificacion/mis-proyectos/data/schema'; // Importa tu esquema Zod
import { Project } from 'next/dist/build/swc/types';

export const ProjectService = {
  async uploadProject(data: ProjectUploadData) {
    try {
      // Validar datos con Zod
      const validatedData = ProjectSchema.parse(data);
      
      // Crear FormData
      const formData = new FormData();
      formData.append("planGeneral", validatedData.planGeneral);
      
      // Agregar actividades
      validatedData.actividades.forEach((actividad, index) => {
        formData.append(`actividades[${index}].id`, actividad.id.toString());
        formData.append(`actividades[${index}].nombre`, actividad.nombre);
        formData.append(`actividades[${index}].fechaInicio`, actividad.fechaInicio.toISOString());
        formData.append(`actividades[${index}].fechaFin`, actividad.fechaFin.toISOString());
        
        if (actividad.archivo) {
          formData.append(`actividades[${index}].archivo`, actividad.archivo);
        }
        
        Object.entries(actividad.respuestas).forEach(([preguntaId, respuesta]) => {
          const key = `actividades[${index}].respuestas[${preguntaId}]`;
          
          if (respuesta instanceof File) {
            formData.append(key, respuesta);
          } else if (Array.isArray(respuesta)) {
            respuesta.forEach((item, idx) => {
              formData.append(`${key}[${idx}]`, item);
            });
          } else {
            formData.append(key, respuesta.toString());
          }
        });
      });
      
      // Enviar a la API
      const response = await apiClient.post('/proyectos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error: any) {
      // Manejo unificado de errores
      let errorMessage = "Error al subir el proyecto";
      
      if (error instanceof z.ZodError) {
        errorMessage = "Errores de validación:\n" + 
          error.errors.map(err => err.message).join("\n");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error("Error en ProjectService.uploadProject:", error);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  async getProjectQuestions(activityId: number): Promise<Pregunta[]> {
    try {
      const response = await apiClient.get(`/actividades/${activityId}/preguntas`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "Error al obtener preguntas";
      
      console.error("Error en ProjectService.getProjectQuestions:", error);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  async getProjectsByUsuario(): Promise<[]> {
    try {
      const response = await apiClient.get('/api/project');
      return response.data;
    } catch (error: any) {
      throw new Error("Fallo"); 
    }
  }

};
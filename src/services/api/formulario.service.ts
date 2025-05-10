// services/api/formulario.service.ts
import { z } from "zod";
import { DataSchema, Data as Forms } from "@/app/intranet/inicio/sub-configuracion/formulario/data/schema"; // Asegúrate de importar tus esquemas de validación
import { getToken } from "@/services/api/getToken.service"; // Importar la función para obtener el token
import { toast } from "sonner"; // Importa la función toast de sonner
import { Data as Form } from "@/app/intranet/inicio/sub-configuracion/formulario/data/schema";
import { API_URL,apiClient } from "@/services/api/API.service"; 


export const FormularioService = {
  getForms: async (): Promise<Forms[]> => {
    try {
      const { data } = await apiClient.get('/api/form');
      return data.forms;
    } catch (error) {
      throw new Error('Error al obtener formularios');
    }
  },

  toggleEstado: async (idf: number, estado: boolean) => {
    try {
      const { data } = await apiClient.put(`/api/form/toggle/${idf}`, { estado });
      return data;
    } catch (error) {
      throw new Error('Error al actualizar el estado');
    }
  },

  createForm: async (nombre: string, preguntas: any[]): Promise<void> => {
    if (!nombre.trim()) {
      toast.error("El nombre del formulario no puede estar vacío.");
      throw new Error("Nombre de formulario vacío");
    }

    try {
      await apiClient.post('/api/form', { name: nombre, preguntas });
      toast.success("Formulario guardado exitosamente");
    } catch (error) {
      throw new Error('Error al guardar formulario');
    }
  },

  getFormById: async (id: string | number): Promise<any> => {
    try {
      const { data } = await apiClient.get(`/api/form/preguntas/${id}`);
      return data;
    } catch (error) {
      throw new Error('Error al obtener formulario');
    }
  },

  updateForm: async (id: string | number, formData: { name: string; preguntas: any[] }): Promise<void> => {
    if (!formData.name.trim()) {
      toast.error("El nombre del formulario no puede estar vacío.");
      throw new Error("Nombre de formulario vacío");
    }

    try {
      await apiClient.put(`/api/form/preguntas/${id}`, formData);
      toast.success("Formulario actualizado exitosamente");
    } catch (error) {
      throw new Error('Error al actualizar formulario');
    }
  },
  // para eliminar un formulario
  deleteForm: async (id: string | number): Promise<void> => {
    try {
      console.log("Eliminando formulario con ID:", id);
      await apiClient.delete(`/api/form/${id}`);
      toast.success("Formulario eliminado exitosamente");
    } catch (error) {
      toast.success("Error al eliminar formulario");
      throw new Error('Error al eliminar formulario');
    }
  },

  copyForm: async (formId: number, newName: string) => {
    try {
      const { data } = await apiClient.post(`/api/form/${formId}/copy`, { newName });
      return data;
    } catch (error) {
      throw new Error('Error al copiar formulario');
    }
  }
};
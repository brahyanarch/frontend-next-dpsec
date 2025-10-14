// services/api/documentos.service.ts
import { z } from "zod";

import { apiClient } from "@/services/api/API.service"; 
import { Document } from "@/app/intranet/inicio/sub-configuracion/plantilla-documento/data/schema";


export const DocumentosService = {
  getDocuments: async (): Promise<Document[]> => {
    try {
      const { data } = await apiClient.get('/api/template/doc');
      return data.plantillas;
    } catch (error) {
      throw new Error('Error al obtener formularios');
    }
  },

  toggleEstado: async (idplantilladoc: number, estado: boolean) => {
    try {
      const { data } = await apiClient.put(`/api/template/toggle/${idplantilladoc}`, { estado });
      return data;
    } catch (error) {
      throw new Error('Error al actualizar el estado');
    }
  },

  createDocument: async (nombre: string, preguntas: any[]): Promise<void> => {
    if (!nombre.trim()) {
      throw new Error("Nombre de formulario vacío");
    }

    try {
      await apiClient.post('/api/template/falta', { name: nombre, preguntas });
    } catch (error) {
      throw new Error('Error al guardar formulario');
    }
  },

  getDocumentBodyById: async (id: string | number): Promise<any> => {
    try {
      const { data } = await apiClient.get(`/api/formtemplate/falta/${id}`);

      return data;
    } catch (error:any) {
      if (error.response?.status === 404) {
      throw new Error("Formulario no encontrado");
    }
      throw new Error('Error al obtener formulario');
    }
  },

  updateDocument: async (id: string | number, formData: { name: string; preguntas: any[] }): Promise<void> => {
    if (!formData.name.trim()) {
      throw new Error("Nombre de formulario vacío");
    }

    try {
      await apiClient.put(`/api/formtemplate/falta/${id}`, formData);
    } catch (error) {
      throw new Error('Error al actualizar formulario');
    }
  },
  // para eliminar un formulario
  deleteForm: async (id: string | number): Promise<void> => {
    try {
      console.log("Eliminando formulario con ID:", id);
      await apiClient.delete(`/api/template/falta/${id}`);
    } catch (error) {
      throw new Error('Error al eliminar formulario');
    }
  },

  copyForm: async (formId: number, newName: string) => {
    try {
      const { data } = await apiClient.post(`/api/template/falta/${formId}/copy`, { newName });
      return data;
    } catch (error) {
      throw new Error('Error al copiar formulario');
    }
  },


};
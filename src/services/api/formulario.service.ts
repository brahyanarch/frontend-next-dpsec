// services/api/formulario.service.ts
import { apiClient } from "@/services/api/API.service"; 

export interface Form {
  idf: number;
  nmForm: string;
  abre: string | null;
  estado: boolean;
  createdAt: string;
  updatedAt: string;
} 

export interface FormsResponse {
  success: boolean;
  data: Form[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}

export interface GetFormsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string; 
  estado?: string;
}
/**
 * Servicio de gestión de formularios
 */

export const FormularioService = {
  /**
   * Obtiene una lista de formularios
  */

  getForms: async (params?: GetFormsParams): Promise<FormsResponse> => {
    try {
      const { data } = await apiClient.get('/api/form', { params });
      return data;
    } catch (error) {
      throw new Error('Error al obtener formularios');
    }
  },
  /**
   * Funcion para cambiar el estado de un formulario
   * @param idf identificador del formulario a cambiar
   * @param estado estado del formulario desactivado o activado
   * @returns Retorna un formulario 
   */
  toggleEstado: async (idf: number, estado: boolean) : Promise<Form> => {
    try {
      const { data } = await apiClient.put(`/api/form/toggle/${idf}`, { estado });
      return data;
    } catch (error) {
      throw new Error('Error al actualizar el estado');
    }
  },

  createForm: async (
  nombre: string,
  preguntas: any[],
  options?: { iddoc?: number | null; longActivity?: boolean; allowDocLink?: boolean }
): Promise<Form> => {
    if (!nombre.trim()) {
      throw new Error("Nombre de formulario vacío");
    }

    try {
      const { data } = await apiClient.post('/api/form', { name: nombre, preguntas,iddoc: options?.iddoc ?? null,
      longActivity: options?.longActivity ?? false,
      allowDocLink: options?.allowDocLink ?? false, });
      return data;
    } catch (error) {
      throw new Error('Error al guardar formulario');
    }
  },

  getFormById: async (id: string | number): Promise<any> => {
    try {
      const { data } = await apiClient.get(`/api/form/preguntas/${id}`);

      return data;
    } catch (error:any) {
      if (error.response?.status === 404) {
      throw new Error("Formulario no encontrado");
    }
      throw new Error('Error al obtener formulario');
    }
  },

  updateForm: async (id: string | number, formData: { name: string; preguntas: any[], iddoc: number, longActivity: boolean, allowDocLink: boolean }): Promise<void> => {
    if (!formData.name.trim()) {
      throw new Error("Nombre de formulario vacío");
    }

    try {
      await apiClient.put(`/api/form/preguntas/${id}`, formData);
    } catch (error) {
      throw new Error('Error al actualizar formulario');
    }
  },
  // para eliminar un formulario
  deleteForm: async (id: string | number): Promise<void> => {
    try {
      console.log("Eliminando formulario con ID:", id);
      await apiClient.delete(`/api/form/${id}`);
    } catch (error) {
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
  },


};
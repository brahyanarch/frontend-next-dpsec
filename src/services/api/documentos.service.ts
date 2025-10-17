// services/api/documentos.service.ts
import { apiClient } from "@/services/api/API.service";

export interface Document {
  idplantilladoc: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsResponse {
  success: boolean;
  data: Document[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}

export interface GetDocumentsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string; 
  estado?: string;
}

/**
 * Servicio de gestión de documentos (plantillas)
 */
export const DocumentosService = {
  /**
   * Obtiene una lista paginada de documentos (plantillas documentarias)
   */
  getDocuments: async (
    params?: GetDocumentsParams
  ): Promise<DocumentsResponse> => {
    try {
      const { data } = await apiClient.get("/api/template/doc", { params });
      return data;
    } catch (error) {
      throw new Error("Error al obtener las plantillas documentarias");
    }
  },

  /**
   * Alterna el estado de una plantilla (activar/desactivar)
   */
  toggleEstado: async (
    idplantilladoc: number,
    estado: boolean
  ): Promise<Document> => {
    try {
      const { data } = await apiClient.put(
        `/api/template/toggle/${idplantilladoc}`,
        { estado }
      );
      return data;
    } catch (error) {
      throw new Error("Error al actualizar el estado de la plantilla");
    }
  },

  /**
   * Crea una nueva plantilla de documento
   */
  createDocument: async (
    nombre: string,
    cuerpo: any[]
  ): Promise<Document> => {
    if (!nombre.trim()) {
      throw new Error("El nombre de la plantilla no puede estar vacío");
    }

    try {
      const { data } = await apiClient.post("/api/template/doc", {
        nombre,
        documentBody: cuerpo,
      });
      return data;
    } catch (error) {
      throw new Error("Error al crear la plantilla documentaria");
    }
  },

  /**
   * Obtiene el cuerpo (contenido) de una plantilla específica
   */
  getDocumentBodyById: async (
    idplantilladoc: number
  ): Promise<{ cuerpo: any[] }> => {
    try {
      const { data } = await apiClient.get(
        `/api/template/doc/${idplantilladoc}`
      );
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Plantilla no encontrada");
      }
      throw new Error("Error al obtener la plantilla");
    }
  },

  /**
   * Actualiza una plantilla existente
   */
  updateDocument: async (
    idplantilladoc: number,
    updateData: { nombre: string; cuerpo: any[] }
  ): Promise<Document> => {
    if (!updateData.nombre.trim()) {
      throw new Error("El nombre de la plantilla no puede estar vacío");
    }

    try {
      const { data } = await apiClient.put(
        `/api/template/doc/${idplantilladoc}`,
        updateData
      );
      return data;
    } catch (error) {
      throw new Error("Error al actualizar la plantilla");
    }
  },

  /**
   * Elimina una plantilla documentaria
   */
  deleteDocument: async (idplantilladoc: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/template/doc/${idplantilladoc}`);
    } catch (error) {
      throw new Error("Error al eliminar la plantilla");
    }
  },

  /**
   * Duplica una plantilla documentaria
   */
  copyDocument: async (
    idplantilladoc: number,
    newName: string
  ): Promise<Document> => {
    try {
      const { data } = await apiClient.post(
        `/api/template/doc/${idplantilladoc}/copy`,
        { newName }
      );
      return data;
    } catch (error) {
      throw new Error("Error al duplicar la plantilla");
    }
  },
  documentsActives: async (): Promise<Document[]> => {
    try {
      const { data } = await apiClient.get("/api/template/doc/actives");
      return data.plantillas; 
    } catch (error) {
      throw new Error("Error al obtener las plantillas activas");
    }
  },
};

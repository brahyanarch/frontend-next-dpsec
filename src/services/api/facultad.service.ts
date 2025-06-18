// services/api/auth.service.ts
import { ProgramaEstudio } from '@/types/index';
import { toast } from "sonner";
import { apiClient } from "@/services/api/API.service";

export const FacultadService = {
  

  obtenerEscuelaProfesional: async (): Promise<ProgramaEstudio[]> => {
    try {
      const response = await apiClient.get('/api/programaestudio');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Error al obtener usuarios";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

};
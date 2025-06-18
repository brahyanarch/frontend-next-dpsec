// services/api/auth.service.ts
import { dataUsuario, LoginResponse, User } from "@/types";
import { Data as UserData } from "@/app/intranet/inicio/sub-configuracion/usuarios/data/schema";
import { toast } from "sonner";
import { API_URL, apiClient } from "@/services/api/API.service";

export const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Error al iniciar sesión";
      throw new Error(errorMessage);
    }
  },

  loginUnique: async (user: User): Promise<LoginResponse> => {
    try {
      const payload = {
        iddatausuario: user.iddatauser,
        idrol: user.roles.id_rol,
        idsubunidad: user.subunidad.id_subuni,
      };
      
      const response = await apiClient.post('/api/auth/login/unique', payload);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Error al seleccionar el rol";
      throw new Error(errorMessage);
    }
  },

  registerData: async (dni: string, email: string, nombre: string, aPaterno: string, aMaterno: string, idpe: number): Promise<LoginResponse> => {
    try {
      const payload = {
        dni: dni,
        email: email,
        nombre: nombre,
        aPaterno: aPaterno,
        aMaterno: aMaterno,
        idpe: idpe || null, // Aseguramos que idpe sea opcional
      };
      
      const response = await apiClient.post('/api/auth/register/datos', payload);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Error al seleccionar el rol";
      throw new Error(errorMessage);
    }
  },

  obtenerUsuarios: async (): Promise<UserData[]> => {
    try {
      const response = await apiClient.get('/api/auth/users');
      return response.data.users;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Error al obtener usuarios";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  updateUserStatus: async (
    userId: number, 
    nuevoEstado: boolean
  ): Promise<boolean> => {
    try {
      await apiClient.put(`/api/auth/user/${userId}/status`, { estado: nuevoEstado });
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Error al actualizar estado";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
};
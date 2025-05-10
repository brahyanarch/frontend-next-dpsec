export const API_URL = process.env.NEXT_PUBLIC_API_URL;
// services/api/client.ts
import axios from 'axios';
import { getToken } from '@/services/api/getToken.service';
import { toast } from 'sonner';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'Error en la solicitud';
    toast.error(message);
    return Promise.reject(error);
  }
);
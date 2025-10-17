// services/tasks.service.ts
import { apiClient } from "@/services/api/API.service";

export interface Task {
  idtask: number;
  title: string;
  description: string;
  estado: 'PENDIENTE' | 'ENPROCESO' | 'COMPLETADO' | 'ARCHIVADO';
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  success: boolean;
  data: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}

export interface GetTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string; // formato: "campo:orden" ej: "title:asc"
  estado?: string;
}

export const TasksService = {
  getTasks: async (params?: GetTasksParams): Promise<TasksResponse> => {
    try {
      const { data } = await apiClient.get('/api/task', { params });
      return data;
    } catch (error) {
      throw new Error('Error al obtener tareas');
    }
  },

  createTask: async (task: Partial<Task>): Promise<Task> => {
    try {
      const { data } = await apiClient.post('/api/task', task);
      return data;
    } catch (error) {
      throw new Error('Error al crear la tarea');
    }
  },

  updateTask: async (id: number, task: Partial<Task>): Promise<Task> => {
    try {
      const { data } = await apiClient.put(`/api/task/${id}`, task);
      return data;
    } catch (error) {
      throw new Error('Error al actualizar la tarea');
    }
  },

  deleteTask: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/task/${id}`);
    } catch (error) {
      throw new Error('Error al eliminar la tarea');
    }
  }
};
// types/index.ts
export interface Subunidad {
    id_subuni: number;
    n_subuni: string;
  }
  
  export interface Role {
    id_rol: number;
    n_rol: string;
  }
  
  export interface dataUsuario {
    iddatauser: number;
    dni: string;
    email: string;
    nombre: string;
    aPaterno: string;
    aMaterno: string;
    idpe?: number;
  }
  
  export interface User {
    iddatauser: number;
    roles: Role;
    subunidad: Subunidad;
  }
  
  export interface LoginResponse {
    message: string;
    admin: boolean;
    users: User[];
    token: string;
    error?: string;
  }
  
  export interface RoleProps {
    title: string;
    subtitle: string;
    onClick: () => void;
  }

  // types/project.ts
export interface Pregunta {
  id: string;
  tipo: 'texto' | 'opcion_unica' | 'multiple' | 'fecha' | 'archivo';
  enunciado: string;
  opciones?: string[];
}

export interface Actividad {
  id: number;
  nombre: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  preguntas: Pregunta[];
  respuestas: { [key: string]: string | string[] | File | null };
  archivo: File | null;
}

export interface ProjectUploadData {
  planGeneral: File | null;
  actividades: Actividad[];
}

export interface ProgramaEstudio {
  idpe: number;
  nmPE: string;
}
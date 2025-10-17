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


export interface Activity {
  idActivi: number
  name: string
  fInit: string
  fFin: string
  estado: string
  tipo: string
  public: boolean
}

export interface Project {
  idproj: number
  plan?: string
  estado: string
  tipo: string
  idString?: string
  fInit?: string
  fFin?: string
  informeFinal?: string
  actividad: Activity[]
}

export interface ProjectDetailProps {
  project: Project
}

export interface Task {
  idtask: number;
  title: string;
  description: string | null;
  estado: 'PENDIENTE' | 'ENPROCESO' | 'COMPLETADO' | 'ARCHIVADO';
  createdAt: string; 
  updatedAt: string;
}
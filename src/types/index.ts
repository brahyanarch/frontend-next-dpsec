// types/index.ts
export interface Subunidad {
    id_subuni: number;
    n_subuni: string;
  }
  
  export interface Role {
    id_rol: number;
    n_rol: string;
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
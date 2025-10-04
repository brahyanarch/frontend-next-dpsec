
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { capitalizarNombre } from '@/services/capitalizar.service'; 
import {getToken} from '@/services/api/getToken.service'
import Cookies from "js-cookie";

interface Subunidad {
  id_subuni: number;
  n_subuni: string;
}

interface Rol {
  id_rol: number;
  n_rol: string;
}

interface Usuario {
  iduser: number;
  subunidad: Subunidad;
  roles: Rol;
  iddatauser: number;
}

interface DataUser {
  dni: string;
  email: string;
  nombre: string;
  APaterno: string;
  AMaterno: string;
  idpe: number | null;
  prgest: number | null; // corregir un prgest es un programa de estudio incluye nombre del programa y mas datos
}

interface Permiso {
  id_per: number;
  n_per: string;
  abreviatura: string;
}

export interface UserData {
  usuario: Usuario;
  dataUser: DataUser;
  permisos: Permiso[] | null;
  usuarios: Usuario[] | null;
  access: boolean;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  logout: () => void;
  hasPermission: (permissionName: string) => boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  hasPermission: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("auth-token");
  
  const fetchUserData = async (token: string) => {
    
  };

  const logout = () => {
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    .then(() => {
      setUser(null);
      window.location.href = '/intranet';
    })
    .catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  };

  useEffect(() => {
    const fetchTokenAndUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/authenticate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.ok) {
          const userData: UserData = await response.json();
          if (userData.access) {
            userData.dataUser.nombre = capitalizarNombre(userData.dataUser.nombre);
            userData.dataUser.APaterno = capitalizarNombre(userData.dataUser.APaterno);
            userData.dataUser.AMaterno = capitalizarNombre(userData.dataUser.AMaterno);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenAndUser();
  }, []);

  const hasPermission = (permissionName: string): boolean => {
    if (!user?.access || !user?.permisos?.length) {
      return false;
    }
    
    return user.permisos.some(permiso => permiso.n_per === permissionName);
    //return false; // Temporalmente permitimos todo
  };

  // funcion para hacer switch de usuario
  const switchUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/switch-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      if (response.ok) {
        const newUserData: UserData = await response.json();
        if (newUserData.access) {
          newUserData.dataUser.nombre = capitalizarNombre(newUserData.dataUser.nombre);
          newUserData.dataUser.APaterno = capitalizarNombre(newUserData.dataUser.APaterno);
          newUserData.dataUser.AMaterno = capitalizarNombre(newUserData.dataUser.AMaterno);
          setUser(newUserData);
        }
      }
    } catch (error) {
      console.error("Error switching user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
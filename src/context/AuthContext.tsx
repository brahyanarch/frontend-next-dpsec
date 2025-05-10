
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
  estado: boolean;
  subunidad: Subunidad;
  roles: Rol;
}

interface DataUser {
  dni: string;
  email: string;
  nombre: string;
  APaterno: string;
  AMaterno: string;
  idpe: number | null;
  prgest: number | null;
}

export interface UserData {
  usuario: Usuario;
  dataUser: DataUser;
  access: boolean;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  logout: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {}
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

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
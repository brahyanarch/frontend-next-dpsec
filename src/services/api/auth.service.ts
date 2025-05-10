// services/api/auth.service.ts
import { LoginResponse, User } from "@/types";
import { getToken } from "@/services/api/getToken.service"; // Importar la función para obtener el token
import { toast } from "sonner"; // Importa la función toast de sonner
import { Data} from '../../app/intranet/inicio/sub-configuracion/usuarios/data/schema'
import { API_URL } from "@/services/api/API.service";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al iniciar sesión");
  }

  return response.json();
};

export const loginUnique = async (user: User): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/api/auth/login/unique`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      iddatausuario: user.iddatauser,
      idrol: user.roles.id_rol,
      idsubunidad: user.subunidad.id_subuni,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al seleccionar el rol");
  }

  return response.json();
};

export const obtenerUsuarios = async (): Promise<Data[]> => {
  const token = await getToken()
  console.log(token);
  try {
    const response = await fetch(`${API_URL}/api/auth/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      toast.error(errorData.error || "Error al obtener usuarios")
      throw new Error(errorData.error || "Error al obtener usuarios")
    }

    const data = await response.json()
    return data.users

  } catch (error) {
    toast.error("Error al cargar los usuarios")
    throw error
  }
}

export const actualizarEstadoUsuario = async (
  userId: number, 
  nuevoEstado: boolean
): Promise<boolean> => {
  const token = await getToken()
  
  try {
    const response = await fetch(`${API_URL}/api/auth/user/${userId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    })

    if (!response.ok) throw new Error("Error en la solicitud")
    return true
  } catch (error) {
    throw error
  }
}
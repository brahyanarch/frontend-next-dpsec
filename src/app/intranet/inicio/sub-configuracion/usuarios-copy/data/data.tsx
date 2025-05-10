import {
  UserCheck,
  UserX
} from "lucide-react";

export const estado = [
  {
    value: true,
    label: "Activo",
    icon: UserCheck,
    color: "bg-green-100", // Fondo
    borderColor: "border-green-400", // Borde
    textColor: "text-green-800", // Texto
  },
  {
    value: false,
    label: "Inactivo",
    icon: UserX,
    color: "bg-red-100", // Fondo
    borderColor: "border-red-400", // Borde
    textColor: "text-red-600", // Texto
  },
];
